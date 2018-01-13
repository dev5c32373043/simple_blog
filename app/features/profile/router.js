const profileRouter = require('express').Router();
const passport      = require('passport');
const mailer        = require('../mailer/');
const events        = require('events');
const multiparty    = require('multiparty');
const uploader      = require('../uploader/');

profileRouter.get('/info', passport.authenticate('jwt', {session: false}), (req, res)=>{
  models.Post.find({author: req.user._id}, 'author authorNickname title image body createdAt updatedAt')
  .sort('-updatedAt').exec((error, posts)=>{
    if(error) return res.status(500).json(error)
    res.json({
      user: {
        nickname: req.user.nickname,
        email: req.user.email,
        emailConfirmed: req.user.emailConfirmed
      },
      posts: posts
    })
  })
})

profileRouter.patch('/info', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const info = req.body;

  if(typeof info.nickname != 'undefined' && req.user.nickname != info.nickname){
    req.user.nickname = info.nickname;
  }
  if(typeof info.email != 'undefined' && req.user.email != info.email){
    req.user.email = info.email;
    req.user.emailConfirmed = false;
  }
  if(typeof info.newPassword != 'undefined' && info.currentPassword){
    if(req.user.comparePassword(info.currentPassword)){
      req.user.password = info.newPassword;
    }
  }

  req.user.save((error, user)=>{
    if(error) return res.status(403).json(error)

    if(!user.emailConfirmed){
      let mailOptions = {
        to: user.email,
        emailToken: user.emailToken
      }
      mailer(mailOptions, (error, info)=>{
        if(error) res.status(500).send(error)
        res.json(user);
      })
    }else res.json(user)
  })
})

profileRouter.post('/posts', passport.authenticate('jwt', {session: false}), (req, res)=>{
  let form = new multiparty.Form({uploadDir: `${process.cwd()}/tmp`});
  const savePost = (str, fields)=>{
    let image = (NODE_ENV == 'production' ? str : `/uploads/${str}`)
    new models.Post({
      author: req.user._id,
      authorNickname: req.user.nickname,
      image: image,
      title: fields.title,
      body: fields.body
    })
    .save((error, post)=>{
      if(error) return res.status(403).send(error)
      res.status(201).json(post)
    })
  }
  const rejectPost = (fields)=>{
    new models.Post({
      author: req.user._id,
      authorNickname: req.user.nickname,
      title: fields.title,
      body: fields.body
    }).validate((error)=>{
      res.status(403).json(error)
    })
  }

  form.parse(req, (err, fields, files)=> {
    if(files.image || fields.image){
      if(NODE_ENV == 'production') savePost(fields.image, fields)
      else uploader(res, files.image[0], (filename)=> savePost(filename, fields))
    }else return rejectPost(fields);
  });
})

profileRouter.patch('/posts', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const emitter = new events.EventEmitter();
  let form = new multiparty.Form({uploadDir: `${process.cwd()}/tmp`});
  form.parse(req, (err, fields, files)=> {
    models.Post.findById(fields.id, (error, post)=>{
      if(error) return res.json(error);
      post.title = fields.title || post.title;
      post.body = fields.body || post.body;
      post.updatedAt = Date.now();
      if(files.image || fields.image){
        if(NODE_ENV == 'production'){
          post.image = fields.image
          emitter.emit('update/end', post)
        }else{
          uploader(res, files.image[0], (filename)=> {
            post.image = `/uploads/${filename}`;
            emitter.emit('update/end', post)
          })
        }
      }else emitter.emit('update/end', post)
    })

    emitter.on('update/end', (post)=>{
      post.save((error, post)=>{
        if(error) return res.status(403).json(error)
        res.status(200).json(post)
      })
    })
  });
})

module.exports = profileRouter;

const mainRouter = require('express').Router();
const passport   = require('passport');

mainRouter.use('/', (req, res, next)=>{
  passport.authenticate('jwt', {session: false}, (err, user, info)=> {
    req.authenticated = (user ? true : false)
    next()
  })(req, res, next)
})

mainRouter.get('/', (req, res)=>{
  models.Post.find({}).sort('-updatedAt').exec((error, posts)=>{
    if(error) return res.status(500).send(error)
    res.json({posts: posts, authenticated: req.authenticated})
  })
})

mainRouter.get('/post/:id', (req, res)=>{
  models.Post.findById(req.params.id, (error, post)=>{
    if(error) return res.status(500).send(error)
    res.json(post)
  })
})

module.exports = mainRouter;

const authRouter = require('express').Router();
const jwt        = require('jsonwebtoken');
const passport   = require('passport');
const jwtSecret  = require(`${process.cwd()}/config`)[NODE_ENV].jwtSecret;
const mailer     = require('../mailer');

authRouter.post('/sign_in', (req, res)=>{
  if(req.body.email && req.body.password){
    let email = req.body.email, password = req.body.password;
    models.User.findOne({email: email}, (error, user)=>{
      if(error) return res.status(500).send(error)
      if(!user) return res.status(401).json({message:"wrong email or password"})
      if(user.comparePassword(password)){
        let payload = {id: user.id};
        let token = jwt.sign(payload, jwtSecret);
        res.cookie('jwt', token, { expires: new Date(2033, 11, 11), httpOnly: true, signed: true }).json({message: "ok"});
        }else res.status(401).json({message:"wrong email or password"})
    })
  }else{
    res.status(403).json({message: 'email and password required!'})
  }
})

authRouter.post('/sign_up', (req, res)=>{
  let email = req.body.email,
  nickname = req.body.nickname,
  password = req.body.password;
  let newUser = new models.User({
    email: email,
    nickname: nickname,
    password: password
  })
  newUser.save((error, user)=>{
    if(error) return res.status(403).json(error)
    let mailOptions = {
      to: user.email,
      emailToken: user.emailToken
    }
    mailer(mailOptions, (error, info)=>{
      if(error) res.status(500).json(error)
      let payload = {id: user.id};
      let token = jwt.sign(payload, jwtSecret);
      res.cookie('jwt', token, {
        expires: new Date(2033, 11, 11),
        httpOnly: true,
        signed: true
      }).json({message: "ok"});
    })
  })
})

authRouter.delete('/logout', (req, res)=>{
  res.clearCookie('jwt').end()
})

module.exports = authRouter;

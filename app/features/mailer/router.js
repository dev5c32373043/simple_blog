const mailRouter = require('express').Router();
const pug        = require('pug');
const NODE_ENV   = process.env.NODE_ENV || 'development';

if(NODE_ENV == 'development'){
  mailRouter.get('/', (req, res)=>{
    const template = pug.compileFile(`${__dirname}/views/layout.pug`);
    res.end(template({message: 'Glad to see you, activate your account through the link below',
    link: {
      text: 'Confirm account',
      href: `http://localhost:3000/email_confirmation/notfound`
    }}))
  })
}

mailRouter.get('/confirmation/:token', (req, res)=>{
  models.User.findOne({emailToken: req.params.token}, (error, user)=>{
    if(error) return res.status(404).end('Something went wrong');
    if(!user) return res.status(500).end('Something went wrong');
    user.emailConfirmed = true;
    user.save((error, user)=>{
      if(error) return res.end('Something went wrong');
      res.json({status: 'ok'})
    })
  })
})

module.exports = mailRouter;

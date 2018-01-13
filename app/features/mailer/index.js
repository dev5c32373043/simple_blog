const pug        = require('pug');
const juice      = require('juice');
const config     = require(`${process.cwd()}/config`);
const nodemailer = require('nodemailer');

module.exports = (options, cb)=>{
  const transporter = nodemailer.createTransport(config[NODE_ENV].smtp);
  const template = pug.compileFile(`${__dirname}/views/layout.pug`);

  let mailOptions = {
    to: options.to,
    subject: 'Email confirmation',
    messageData: {
      message: 'Glad to see you, activate your account through the link below',
      link: {
        text: 'Confirm account',
        href: `${config[NODE_ENV].host}/email_confirmation/${options.emailToken}`
      }
    }
  }

  mailOptions.html = juice(template(mailOptions.messageData));

  transporter.sendMail(mailOptions, (error, info)=> cb(error, info))
}

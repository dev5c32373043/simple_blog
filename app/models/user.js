const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');

const schema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    validate: {
      isAsync: true,
      validator: emailValidator
    }
  },
  emailToken: {
    type: String,
    unique: true
  },
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  nickname: {
    type: String,
    required: [true, 'Nickname required'],
    minlength: [3, 'Nickname must be greater than or equal 3 characters.'],
    unique: true,
    validate: {
      isAsync: true,
      validator: nicknameValidator
    }
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: [8, 'Password must be greater than or equal 8 characters.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

function nicknameValidator(value, next){
  if(this.isModified('nickname')){
    this.model('User').count({ nickname: value }, (error, count)=> {
      next(!count, 'Nickname already exists')
    })
  }
}
function emailValidator(value, next) {
  let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  let validate = (error, value, count = null)=>{
    switch (true) {
      case (error):
        next(error)
        break;
      case (!!count):
        next(!count, 'Email already exists')
        break;
      case (!emailRegex.test(value)):
        next(emailRegex.test(value), 'Email not correct')
        break;
      default:
        next()
    }
  }
  if(!this.emailConfirmed){
    this.model('User').count({ email: value }, (error, count)=> {
      validate(error, value)
    })
  }else validate(null, value)
}

schema.statics.generateHash = (password)=> bcrypt.hashSync(password, 8);
schema.statics.generateToken = ()=> crypto.randomBytes(128).toString('hex');

schema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password)
}

schema.post('validate', function(doc, next){
  if(doc.isNew){
    doc.password = this.model('User').generateHash(doc.password);
    doc.emailToken = this.model('User').generateToken();
  }else if(doc.isModified('password')){
    doc.password = this.model('User').generateHash(doc.password);
  }else if(doc.isModified('emailConfirmed')){
    doc.emailToken = this.model('User').generateToken();
  }
  next()
})

module.exports = mongoose.model('User', schema)

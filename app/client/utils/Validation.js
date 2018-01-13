class errorHandler{
  constructor(fields, errors, mapCb, forCb){
    this.target = this.key = this.element = null;
    this.validate(fields, errors, mapCb, forCb)
  }
  validate(fields, errors, mapCb, forCb){
    let errorKeys = Object.keys(errors);
    fields.map((element)=>{
      this.element = element;
      if(!errorKeys.includes(this.element)){
        if(typeof mapCb == 'function') mapCb.call(this)
        self[this.element].classList.remove('is-invalid')
      }
    })
    for(let key in errors){
      this.target = this.key = key;
      if(typeof forCb == 'function') forCb.call(this)
      self[this.target].nextElementSibling.textContent = errors[this.key].message
      self[this.target].classList.add('is-invalid')
    }
  }
}

const validatePassword = (fieldName, ref, key, data)=>{
  if(data[ref].length){
    if(data[key].length < 1){
      self[key].nextElementSibling.textContent =  `${key} required!`
      self[key].classList.add('is-invalid')
    }else if(data[key].length < 8) {
      self[key].nextElementSibling.textContent =  `${key} must be greater than or equal 8 characters.`
      self[key].classList.add('is-invalid')
    }
  }
}

const signUpHandler = (errors)=>{
  new errorHandler(['nickname', 'email', 'password'], errors)
}

const settingsHandler = (errors)=>{
  function mapCb(){
    if(this.element == 'password') this.element = 'newPassword';
  }
  function forCb(){
    this.target = (this.key == 'password' ? 'newPassword' : this.key)
  }
  new errorHandler(['nickname', 'email', 'password'], errors, mapCb, forCb)
}

const createPostHandler = (errors)=>{
  function mapCb(){
    if(this.element == 'image'){
      self[this.element].nextElementSibling
      .style.display = 'none';
    }
  }
  function forCb(){
    if(this.key == 'image'){
      self[this.key].nextElementSibling.style.display = 'block';
    }
  }
  new errorHandler(['title', 'image', 'body'], errors, mapCb, forCb)
}

const editPostHandler = (errors)=>{
  new errorHandler(['title', 'body'], errors)
}

export { validatePassword, signUpHandler, settingsHandler, createPostHandler, editPostHandler }

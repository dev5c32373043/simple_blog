import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SignIn extends Component{
  constructor(props){
    super(props)
    this.onSubmit = this.onSubmit.bind(this);
  }
  showAlert(type, message, target){
    let targetE = target || '.profile-container';
    $(targetE).prepend(`<div class='alert alert-${type} show' role='alert'>${message}</div>`)
    setTimeout(()=> $('.alert').addClass('fadeOut'), 4000)
    setTimeout(()=> $('.alert').alert('close'), 5000)
  }
  onSubmit(e){
    e.preventDefault()
    fetch('/auth/sign_in', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: sign_in_email.value,
        password: sign_in_password.value
      })
    }).then((resp)=>{
      if(resp.status != 200) return this.showAlert('dark', 'Wrong email or password', 'form')
      resp.json().then((user)=>{
        this.props.history.push('/profile')
      })
    })
  }
  render(){
    return(
      <form onSubmit={this.onSubmit} className='auth-form card card-outline-secondary'>
       <div className="form-group row">
         <div className="col-12">
           <label htmlFor="sign_in_email">Email</label>
           <input className="form-control" type="email" name='email' id="sign_in_email" />
         </div>
      </div>
      <div className="form-group row">
        <div className="col-12">
          <label htmlFor="sign_in_password">Password</label>
          <input className="form-control" type="password" name='password' id="sign_in_password" />
        </div>
     </div>
     <div className='row'>
       <div className="col-6">
         <button type="submit" className="btn btn-dark">Login</button>
       </div>
      <div className="col-6">
         <Link className="btn btn-dark float-right" to='/sign_up'>SignUp</Link>
       </div>
     </div>
      </form>
    )
  }
}

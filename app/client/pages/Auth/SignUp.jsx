import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { signUpHandler } from '../../utils/Validation';

export default class SignUp extends Component{
  constructor(props){
    super(props)
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e){
    e.preventDefault()
    fetch('/auth/sign_up', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        nickname: nickname.value,
        password: password.value
      })
    }).then((resp)=> {
      let errors = null;
      if(resp.status != 200) errors = true;
      resp.json().then((data)=>{
        errors ? signUpHandler(data.errors) : this.props.history.push('/profile')
      })
    })
    .catch((error)=> console.error(error))
  }
  render(){
    return(
      <form onSubmit={this.onSubmit} className='auth-form card card-outline-secondary' noValidate>
        <div className="form-group row">
          <div className="col-12">
            <label htmlFor="sign_up_nickname">Nickname</label>
            <input className="form-control" type="text" placeholder='Enter your nickname' id="nickname" required />
            <div className="invalid-feedback" />
          </div>
       </div>
       <div className="form-group row">
         <div className="col-12">
           <label htmlFor="sign_up_email">Email</label>
           <input className="form-control" type="email" placeholder='Enter your email' id="email" required />
           <div className="invalid-feedback" />
         </div>
      </div>
      <div className="form-group row">
        <div className="col-12">
          <label htmlFor="sign_up_password">Password</label>
          <input className="form-control" type="password" placeholder='Enter your password' id="password" required />
          <div className="invalid-feedback" />
        </div>
     </div>
     <div className='row'>
       <div className="col-6">
         <button type="submit" className="btn btn-dark">Submit</button>
       </div>
      <div className="col-6">
        <Link className="btn btn-dark float-right" to='/sign_in'>Back to Login</Link>
       </div>
     </div>
      </form>
    )
  }
}

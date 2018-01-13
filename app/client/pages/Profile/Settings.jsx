import React, { Component } from 'react';
import { settingsHandler, validatePassword } from '../../utils/Validation';

export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nickname: '',
      email: '',
      currentPassword: '',
      newPassword: ''
    }
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.setField = this.setField.bind(this);
  }
  componentWillMount(){
    this.setState(this.props.user)
  }
  componentWillReceiveProps(props){
    this.setState(props.user)
  }
  setField(e){
    if(e.target.className.includes('is-invalid')){
      e.target.classList.remove('is-invalid')
    }
    this.setState({[e.target.name]: e.target.value })
  }
  onFormSubmit(e){
    e.preventDefault();
    for(let item in this.state){
      if(!['nickname', 'email'].includes(item)){
        if(item == 'newPassword'){
          validatePassword('newPassword', 'currentPassword', item, this.state)
        }
        if(item == 'currentPassword'){
          validatePassword('currentPassword', 'newPassword', item, this.state)
        }
      }
    }
    fetch('/profile/info', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    }).then((resp)=>{
      if(resp.status == 500) return this.props.history.push('/500')
      resp.json().then((data)=>{
        if(data.errors) return settingsHandler(data.errors)
        if(!data.emailConfirmed) this.props.emailIsConfirmed({user: data})
        this.props.showAlert('dark', 'Profile info successfully updated!')
      })
    })
  }
  render(){
    return(
      <div className="tab-pane" id="settings" role="tabpanel" aria-labelledby="settings-tab">
        <form className='settings-form' onSubmit={this.onFormSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <input type="text" className="form-control" onChange={this.setField}
                   id="nickname" name='nickname' placeholder='Enter your new nickname' value={this.state.nickname} required />
            <div className="invalid-feedback" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" onChange={this.setField}
                   id="email" name='email' placeholder="someman@example.com" value={this.state.email} required />
            <div className="invalid-feedback" />
          </div>
          <div className="row">
            <div className="form-group password-current">
              <label htmlFor="current-password">Current Password</label>
              <input type="password" className="form-control"
                name='currentPassword' id="currentPassword" onChange={this.setField} />
                <div className="invalid-feedback" />
            </div>
            <div className="form-group password-new">
              <label htmlFor="new-password">New Password</label>
              <input type="password" name='newPassword' className="form-control"
                     id="newPassword" onChange={this.setField} />
              <div className="invalid-feedback" />
            </div>
          </div>
          <button type="submit" className="btn btn-lg btn-dark btn-block">Save</button>
        </form>
      </div>
    )
  }
}

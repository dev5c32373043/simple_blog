import React, { Component } from 'react';
import Posts  from './Posts.jsx';
import Settings from './Settings.jsx';
import 'bootstrap';
import Loader from '../../components/Loader.jsx';

export default class Profile extends Component{
  constructor(props){
    super(props)
    this.state = {
      info: {},
      content: null
    }
    this.emailIsConfirmed = this.emailIsConfirmed.bind(this);
  }
  componentWillMount(){
    this.getInfo()
  }
  async getInfo(){
    await fetch('/profile/info', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((resp)=> {
      if(resp.status == 401) return this.props.history.push('/401')
      if(resp.status != 200) return this.showAlert('danger', 'Something went wrong!')
      resp.json().then((info)=>{
        this.setState({info: info})
        this.emailIsConfirmed(info)
      })
    })
  }
  showAlert(type, message, target){
    let targetE = target || '.profile-container';
    $(targetE).prepend(`<div class='alert alert-${type} show' role='alert'>${message}</div>`)
    setTimeout(()=> $('.alert').addClass('fadeOut'), 4000)
    setTimeout(()=> $('.alert').alert('close'), 5000)
  }
  emailIsConfirmed(info){
    if(info.user.emailConfirmed){
      this.setState({content:
        [<ul className="nav nav-tabs" role="tablist" key='nav'>
          <li className="nav-item">
            <a className="nav-link active" id="posts-tab" data-toggle="tab"
                href="javascript:void(false)" data-target="#profile_posts" role="tab" aria-controls="profile_posts" aria-selected="true">Posts</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="settings-tab" data-toggle="tab"
                href="javascript:void(false)" data-target="#settings" role="tab" aria-controls="settings" aria-selected="false">Settings</a>
          </li>
        </ul>,
        <div className="tab-content" key='actions'>
          <Posts env={info.env} posts={info.posts} showAlert={this.showAlert} history={this.props.history} />
          <Settings user={info.user} emailIsConfirmed={this.emailIsConfirmed} showAlert={this.showAlert} />
        </div>]
      })
    }else{
      this.setState({content: <h1>Please confirm your email</h1>})
    }
  }
  render(){
    return(
      <div className='profile-container'>
        {this.state.content ? this.state.content : <Loader />}
      </div>
    )
  }
}

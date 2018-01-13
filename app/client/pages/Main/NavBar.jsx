import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavBar extends Component{
  constructor(props){
    super(props);
    this.state = {
      authenticated: false
    }
    this.onLogout = this.onLogout.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.dataReceived){
      this.setState({authenticated: nextProps.authenticated})
    }
  }
  onLogout(){
    fetch('/auth/logout', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((res)=>{
      if(res.status == 200) this.setState({authenticated: false})
    })
  }
  checkAuth(){
    if(this.props.dataReceived){
      if(this.state.authenticated){
        return [<Link key={Math.random()} className="btn btn-outline-light" to='/profile'>Profile</Link>,
        <a key={Math.random()} className="btn btn-outline-light" onClick={this.onLogout} href='javascript:void(false)'>Logout</a>]
      }else{
        return [<Link key={Math.random()} className="btn btn-outline-light" to='/sign_in'>SignIn</Link>,
        <Link key={Math.random()} className="btn btn-outline-light" to='/sign_up'>SignUp</Link>]
      }
    }
  }
  render(){
    return(
      <nav className="navbar fixed-top  navbar-dark bg-dark">
        <a className="navbar-brand" href="/">SimpleBlog</a>
        <form className="form-inline">
          {this.checkAuth()}
        </form>
      </nav>
    )
  }
}

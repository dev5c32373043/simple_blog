import { Switch, Route } from 'react-router-dom'
import React from 'react';
import { Component } from 'react';

import MailConfirmation from './pages/MailConfirmation.jsx';
import Main             from './pages/Main/index.jsx';
import Post             from './components/Post/index.jsx';
import Profile          from './pages/Profile/index.jsx';
import SignIn           from './pages/Auth/SignIn.jsx';
import SignUp           from './pages/Auth/SignUp.jsx';
import ErrorPageLayout  from './pages/ErrorPage/Layout.jsx';

export default class Router extends Component{
  render(){
    return(
      <Switch>
        <Route exact path='/'                    component={Main}    />
        <Route path='/posts/:id'  render={(props)=>{
          return <Post {...props} show />
        }} />
        <Route path='/profile'                   component={Profile} />
        <Route path='/email_confirmation/:token' component={MailConfirmation} />
        <Route path='/sign_in'                   component={SignIn}  />
        <Route path='/sign_up'                   component={SignUp}  />
        <Route exact path='/401' render={(props)=>{
          return <ErrorPageLayout
            errorCode='401'
            firstMessage='YOU UNAUTHORIZED'
            secondMessage='PLEASE SIGN IN'
            linkMessage='SignIn'
            linkHref='/sign_in'
            {...props} />
        }} />
        <Route exact path='/500' render={(props)=>{
          return <ErrorPageLayout
            errorCode='500'
            firstMessage='Oops'
            secondMessage='Something went wrong'
            linkMessage='COME BACK HOME'
            linkHref='/'
            {...props} />
        }} />
        <Route exact path='*' render={(props)=>{
          return <ErrorPageLayout
            errorCode='404'
            firstMessage='THE PAGE'
            secondMessage='WAS NOT FOUND'
            linkMessage='COME BACK HOME'
            linkHref='/'
            {...props} />
        }} />
      </Switch>
    )
  }
}

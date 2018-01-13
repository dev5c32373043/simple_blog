import React, { Component } from 'react';
import Loader from '../components/Loader.jsx';

export default class MailConfirmation extends Component {
  constructor(props){
    super(props)
      fetch(`/mail/confirmation/${this.props.match.params.token}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((resp)=>{
        resp.status == 200 ? this.props.history.push('/profile') : this.props.history.push('/404')
      })
  }
  render(){
    return <Loader />
  }
}

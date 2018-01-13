import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorPageLayout extends Component{
  render(){
    return(
    <div className='not_found_container'>
      <div id="clouds">
        <div className="cloud x1"></div>
        <div className="cloud x1_5"></div>
        <div className="cloud x2"></div>
        <div className="cloud x3"></div>
        <div className="cloud x4"></div>
        <div className="cloud x5"></div>
      </div>
      <div className='c'>
        <div className='_error_code'>{this.props.errorCode}</div>
        <hr />
        <div className='_1'>{this.props.firstMessage}</div>
        <div className='_2'>{this.props.secondMessage}</div>
        <Link className='back-button' to={this.props.linkHref}>{this.props.linkMessage}</Link>
      </div>
    </div>
    )
  }
}

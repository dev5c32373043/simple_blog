import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

import CreateModal from './modals/Create.jsx';
import EditModal from './modals/Edit.jsx';

const modalRoot = document.getElementById('modal-root');

export default class ModalPortal extends Component{
  constructor(props){
    super(props)
    this.state = {
      action: ''
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({ action: nextProps.action })
  }
  componentDidUpdate(){
    if(this.state.action.length){
      $(`#${this.state.action}Modal`).modal('show')
    }
  }
  render(){
    if(this.props.action == 'create'){
      return ReactDOM.createPortal(
        <CreateModal {...this.props} />,
        modalRoot
      )
    }else if(this.props.action == 'edit'){
      return ReactDOM.createPortal(
        <EditModal {...this.props} />,
        modalRoot
      )
    }else return null;
  }
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Router from './router.jsx';

class App extends Component{
  render(){
    return (
      <Router />
    )
  }
}

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('app'));

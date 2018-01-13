import React, { Component } from 'react';
import Loader from '../../components/Loader.jsx';
import Moment from 'moment';

export default class ShowPost extends Component{
  constructor(props){
    super(props)
    this.state = {
      title: '',
      image: '',
      body: '',
      author: '',
      updatedAt: '',
      dataReceived: false
    }
    this.getPostBody = this.getPostBody.bind(this);
  }
  componentWillMount(){
    let location = this.props.location
    if(location && location.post && this.props.show){
      let post = this.props.location.post;
      this.setState({
        title: post.title,
        image: post.image,
        body: post.body,
        author: post.authorNickname,
        updatedAt: Moment(post.updatedAt).fromNow(),
        dataReceived: true
      })
    }
    else this.getPost()
  }
  getPost(){
    if(this.props.show){
      fetch(`/main/post/${this.props.match.params.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((resp)=>{
        if(resp.status == 200){
          resp.json().then((post)=>{
            this.setState({
              title: post.title,
              image: post.image,
              body: post.body,
              author: post.authorNickname,
              updatedAt: Moment(post.updatedAt).fromNow(),
              dataReceived: true
            })
          })
        }
      })
    }
  }
  getPostBody(){
    return (this.props.show ? {__html: this.state.body} : {__html: this.props.post.body})
  }
  render(){
    if(this.state.dataReceived){
      return(
        <div className='post-show'>
          <img className="card-img-top" src={this.state.image} />
          <div className="card-title">
            <small className="text-muted">{this.state.updatedAt}</small>
            <div className='author'><i /><h5>{this.state.author}</h5></div>
            <h1>{this.state.title}</h1>
          </div>
          <div className='divider' />
          <p className="card-text" dangerouslySetInnerHTML={this.getPostBody()} />
        </div>
      )
    }else{
      return <Loader />
    }
  }
}

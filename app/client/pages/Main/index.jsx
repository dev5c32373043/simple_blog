import React from 'react';
import { Component } from 'react';
import NavBar from './NavBar.jsx';
import Post   from '../../components/Post/index.jsx';
import Loader from '../../components/Loader.jsx';

export default class Main extends Component{
  constructor(props){
    super(props)
    this.state = {
      posts: [],
      authenticated: false,
      dataReceived: false
    }
    this.renderPosts = this.renderPosts.bind(this);
  }
  componentDidMount(){
    this.getPosts.call(this)
  }
  async getPosts(){
    await fetch('/main', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((resp)=> {
      if(resp.status != 200) return this.showAlert('danger', 'Something went wrong!')
      resp.json().then((data)=>{
        this.setState({posts: data.posts, authenticated: data.authenticated, dataReceived: true})
      })
    })
  }
  renderPosts(){
    if(this.state.dataReceived){
      let posts = [];
      for(let i = 0; i < this.state.posts.length; i++){
        let post = this.state.posts[i];
        posts.push(<Post key={post._id} post={post} />)
      }
      return posts;
    }else return <Loader />
  }
  render(){
    return(
      <div>
        <NavBar
          authenticated={this.state.authenticated}
          dataReceived={this.state.dataReceived} {...this.props} />
        <div className='posts'>
          {this.renderPosts()}
        </div>
      </div>
    )
  }
}

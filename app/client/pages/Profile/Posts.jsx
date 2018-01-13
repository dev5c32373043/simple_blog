import React, { Component } from 'react';
import Post   from '../../components/Post/index.jsx';

import ModalPortal from './ModalPortal.jsx';

export default class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      editPost: {},
      modalAction: ''
    }
    this.renderPosts = this.renderPosts.bind(this);
    this.updatePosts = this.updatePosts.bind(this);
    this.syncPostData = this.syncPostData.bind(this);
    this.showCreateModal = this.showCreateModal.bind(this);
  }
  componentWillMount(){
    this.setState({posts: this.props.posts})
  }
  updatePosts(post, isUpdated){
    let posts = [...this.state.posts];
    if(isUpdated){
      for(let i = 0; i < posts.length; i++){
        if(posts[i]._id == post._id){
          posts.splice(i, 1)
          break;
        }
      }
    }
    posts.unshift(post)
    window.scrollTo(0, 0)
    this.setState({posts: posts})
  }
  renderPosts(){
    let posts = [];
    for(let i = 0; i < this.state.posts.length; i++){
      let post = this.state.posts[i];
      posts.push(<Post syncPostData={this.syncPostData}  key={post._id} post={post} editable={true} />)
    }
    return posts;
  }
  syncPostData(post){
    this.setState({editPost: post, modalAction: 'edit'})
  }
  showCreateModal(){
    this.setState({modalAction: 'create'})
  }
  render(){
    return(
      <div className="tab-pane active" id="profile_posts" role="tabpanel" aria-labelledby="posts-tab">
        <button type="button" className="btn btn-dark btn-block"
                id="create_post" onClick={this.showCreateModal} >Create a new one</button>
        <div className='posts'>
          {this.renderPosts()}
        </div>
        <ModalPortal
          action={this.state.modalAction}
          post={this.state.editPost}
          showAlert={this.props.showAlert}
          updatePosts={this.updatePosts}  />
      </div>
    )
  }
}

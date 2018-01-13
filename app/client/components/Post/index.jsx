import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'moment';

import ShowPost from './Show.jsx';

export default class Post extends ShowPost{
  constructor(props){
    super(props)
    this.getPostBody = this.getPostBody.bind(this);
    this.isEditable = this.isEditable.bind(this);
  }
  isEditable(){
    if(this.props.editable){
      return (
        <button className='btn btn-outline-dark btn-lg edit-btn'
                onClick={()=> this.props.syncPostData(this.props.post)}>Edit</button>
      )
    }
  }
  render(){
    if(!this.props.show){
      let updatedAt = Moment(this.props.post.updatedAt).fromNow();
      return(
        <div className='post'>
          <div className="card mb-3">
            <img className="card-img-top" src={this.props.post.image} />
              <div className="card-body">
                <h4 className="card-title">{this.props.post.title}</h4>
                <p className="card-text body-content" dangerouslySetInnerHTML={super.getPostBody()} />
                <p className="card-text">
                  <small className="text-muted">{updatedAt}</small>
                  <Link
                    to={{
                      pathname: `/posts/${this.props.post._id}`,
                      post: this.props.post
                    }}
                    className='btn btn-outline-dark btn-lg show-btn'>Show</Link>
                  {this.isEditable()}
                </p>
              </div>
            </div>
          </div>
        )
      }else{
        return super.render()
      }
  }
}

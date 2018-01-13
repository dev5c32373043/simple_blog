import React, { Component } from 'react';
import DropZone from '../../../components/DropZone.jsx';
import { createPostHandler } from '../../../utils/Validation';
import Quill from 'quill';
import 'bootstrap';

export default class CreateModal extends Component{
  constructor(props){
    super(props)
    this.state = {
      title: '',
      image: null,
      editor: {}
    }
    this.createPost = this.createPost.bind(this);
    this.updateParentImage = this.updateParentImage.bind(this);
  }
  componentDidMount(){
    this.setState({editor: new Quill('#body', {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      },
      theme: 'snow'
      })
    })
  }
  createPost(){
    let formData = new FormData();
    if(this.state.title.length){
      formData.append("title", this.state.title)
    }
    formData.append("image", this.state.image)
    if(this.state.editor.getText().trim().length){
      formData.append("body", this.state.editor.root.innerHTML)
    }
    fetch('/profile/posts', {
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then((resp)=>{
      $('#postModal').modal('hide')
      if(resp.status == 500) return this.props.history.push('/500')
      resp.json().then((data)=>{
        if(data.errors) return createPostHandler(data.errors)
        this.props.showAlert('dark', 'Post created successfully!')
        $('#createModal').modal('hide')
        this.props.updatePosts(data)
      })
    })
  }
  updateParentImage(image){
    this.setState({image: image});
  }
  render(){
    return(
      <div className="modal fade" id="createModal" tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">Write something awesome!</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <DropZone
                  history={this.props.history}
                  updateParentImage={this.updateParentImage}
                  showAlert={this.props.showAlert} />
                <div className="invalid-feedback" />
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" className="form-control"
                         onChange={(e)=> this.setState({title: e.target.value})} name='title' id="title" />
                  <div className="invalid-feedback" />
                </div>
                <div className="form-group">
                  <label htmlFor="body">Body</label>
                  <div className="form-control" name='body'  id="body" />
                  <div className="invalid-feedback" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-dark" data-dismiss="modal">Close</button>
              <button type="button" onClick={this.createPost} className="btn btn-dark">Create</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

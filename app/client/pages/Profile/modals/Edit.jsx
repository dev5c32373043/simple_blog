import React, { Component } from 'react';
import DropZone from '../../../components/DropZone.jsx';
import { editPostHandler } from '../../../utils/Validation';
import Quill from 'quill';
import 'bootstrap';

export default class EditModal extends Component{
  constructor(props){
    super(props)
    this.state = {
      id: null,
      title: '',
      image: {},
      editor: {}
    }
    this.updatePost = this.updatePost.bind(this);
    this.updateParentImage = this.updateParentImage.bind(this);
  }
  componentDidMount(){
    let editor = new Quill('#body', {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      },
      theme: 'snow'
    })
    editor.root.innerHTML = this.props.post.body;
    this.setState({
      id: this.props.post._id,
      editor: editor,
      title: this.props.post.title
    })
  }
  componentWillReceiveProps(nextProps){
    this.state.editor.root.innerHTML = nextProps.post.body;
    this.setState({
      id: nextProps.post._id,
      title: nextProps.post.title
    })
  }
  updatePost(){
    let formData = new FormData();
    formData.append("id", this.state.id)
    let image = this.state.image;
    if(typeof image == 'string' || typeof image.name == 'string'){
      formData.append("image", image)
    }
    formData.append("title", this.state.title)
    if(this.state.editor.getText().trim().length){
      formData.append("body", this.state.editor.root.innerHTML)
    }else formData.append("body", '')
    fetch('/profile/posts', {
      method: 'PATCH',
      credentials: 'include',
      body: formData
    }).then((resp)=>{
      if(resp.status == 500) return this.props.history.push('/500')
      resp.json().then((data)=>{
        if(data.errors) return editPostHandler(data.errors)
        this.props.showAlert('dark', 'Post updated successfully!')
        this.props.updatePosts(data, true)
        $('#editModal').modal('hide')
      })
    })
  }
  updateParentImage(image){
    this.setState({image: image});
  }
  render(){
    return(
      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
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
                  image={this.props.post.image}
                  updateParentImage={this.updateParentImage}
                  showAlert={this.props.showAlert} />
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" className="form-control"
                         onChange={(e)=> this.setState({title: e.target.value})} value={this.state.title} name='title' id="title" />
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
              <button type="button" onClick={this.updatePost} className="btn btn-dark">Update</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

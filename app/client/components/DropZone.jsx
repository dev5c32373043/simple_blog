import React, { Component } from 'react';

export default class DropZone extends Component{
  constructor(props){
    super(props)
    this.state = {
      image: ''
    }
  }
  getSignedRequest(file){
    fetch(`/sign-s3?file-type=${file.type}`, {
      method: 'GET',
      credentials: 'include'
    }).then((resp)=>{
      if(resp.status != 200) return this.props.showAlert('dark', 'Could not upload file.', 'form')
      resp.json().then((data)=>{
        this.uploadToS3(file, data.signedRequest, data.url);
      })
    })
  }
  uploadToS3(file, signedRequest, url){
    fetch(signedRequest, {
      method: 'PUT',
      body: file
    }).then((resp)=>{
      if(resp.status != 200) return this.props.showAlert('dark', 'Could not upload file.', 'form')
      this.props.updateParentImage(url)
      this.setState({image: url})
    })
  }
  uploadImage(e){
    e.preventDefault()
    let target = (e.target.nodeName == 'INPUT' ? e.target : e.dataTransfer);
    let file = target.files[0];
    if(this.validate(file.type)){
      if(location.origin == "https://simple-express-blog.herokuapp.com"){
        this.getSignedRequest(file);
      }else{
        this.props.updateParentImage(file);
        let reader  = new FileReader();
        reader.onloadend = (e)=> {
          this.setState({image: e.target.result})
        }

        reader.readAsDataURL(file);
      }
    }else{
      this.props.showAlert('danger', 'Image type not valid supported types .png, .jpg, .jpeg, .gif', 'form')
    }
  }
  componentDidMount(){
    if(this.props.image) this.setState({image: this.props.image})

    image.ondragover = (e)=> {
      e.preventDefault()
      e.target.classList.add('hover-uploader')
    }
    image.ondragleave = ()=> image.classList.remove('hover-uploader');
    image.ondrop = (e)=> this.uploadImage(e)
    image.onclick = ()=> imageUpload.click()
    imageUpload.onchange = (e)=> this.uploadImage(e)
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.image){
      this.setState({image: nextProps.image})
    }
  }
  validate(type){
    return ["image/jpeg", "image/png", "image/gif"].includes(type);
  }
  render(){
    let elements = [];
    if(this.state.image && this.state.image.length){
      elements.push(<img key='preview-image' id="preview" src={this.state.image} />)
    }
    elements.push(
      <input key='image-upload' type="file" id="imageUpload" />,
      <div key='drop-zone' className="form-group drag-box" id='image'>
        <p>Drop image here or click to upload.</p>
      </div>)
    return elements;
  }
}

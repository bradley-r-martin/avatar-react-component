import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import './dropzoneControl.styles.css';

class DropzoneControl extends Component{
  constructor(props){
    super(props)
    this.state = {
      preview: props.preview,
      accept: props.accept
    }
    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(nextProps){
    this.setState({preview:nextProps.preview});
  }
  componentDidMount() {
    const self = this;
    /* Attachs the on drop over styles */
    this.refs.upload.addEventListener("dragleave", function(){
      self.setState({
        isDropping:false
      });
    }, false);
    this.refs.upload.addEventListener("dragover", function(){
      self.setState({
        isDropping:true
      });
    }, false);
    this.refs.upload.addEventListener("drop", function(){
      self.setState({
        isDropping:false
      });
    }, false);
  }

  onChange(event){

    let reader = new FileReader();
    let file = event.target.files[0];
    if (!file) return;
    var self = this;
    reader.onload = function(file) {
      let i = 0
      for (i = 0; i < self.state.accept.length; i++) {
        if(file.target.result.includes(self.state.accept[i])){
          ReactDOM.findDOMNode(self.refs.upload).value = '';
          this.props.onChange(file);
          break;
        }
      }
      if(i==self.state.accept.length){
        alert('File type not supported');
      }
    }.bind(this);
    reader.readAsDataURL(file);
  }


  render(){

    var className = classNames(
      'dropzoneControl',
      { drop: this.state.isDropping },
      { preview: this.state.preview }
    );


    return(
      <div className={className}>
        {this.state.preview &&
        <img src={this.state.preview}  />
        }
        <span></span>
        <input ref="upload" type="file" accept="image/*" onChange={this.onChange.bind(this)} />
      </div>
    );
  }
}
DropzoneControl.defaultProps = {
  preview: null,
  accept: [
    'image/jpg',
    'image/bmp',
    'image/gif',
    'image/png',
    'image/jpeg'
  ],
  onChange: function(){console.log('No onChange() callback defined.');}
}

export default DropzoneControl;
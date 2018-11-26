import React, { Component } from "react";

import { Modal, Button } from 'react-bootstrap';

import CroppingControl from "./croppingControl/croppingControl";
import MagnificationControl from './magnificationControl/magnificationControl';
import DropzoneControl from './dropzoneControl/dropzoneControl';

class Avatar extends Component{
  constructor(props){
    super(props);
    this.state = {
      original: null, // Holds the original images dataURI
      upload: null,
      preview: props.preview, 
      accept: props.accept,
      magnification: 1,
      maxMagnification: props.magnification,
      output: props.output,
      onAccept: props.onAccept,
      onCancel: props.onCancel
    }
    this.handleCroppingCancel = this.handleCroppingCancel.bind(this);
    this.handleCroppingAccepted = this.handleCroppingAccepted.bind(this);
  }
  handleCroppingAccepted(){
    /* The user is happy with the cropping result and wishes to upload */
    this.setState({
        original:   null,
        preview:    this.state.adjusted, 
        upload:    this.state.adjusted, 
        isCropping:   false
    });
    /* Fire onAccept event */
    this.state.onAccept({
        original:   this.state.original,
        upload:     this.state.adjusted
    });
  }
  handleCroppingCancel(){
    /* The cropping tool has been cancelled */
    this.setState({
      isCropping:     false
    });
    /* Fire onCancel event */
    this.state.onCancel();
  }
  magnify(level){
    this.setState({
      magnification: level
    });
  }
  image(image){
    this.setState({
      adjusted: image
    });
  }
  onChange(file){
    this.setState({
     // preview: file.target.result /* if no crop */
     original: file.target.result, 
     isCropping: true,
     magnification:1 // Reset magnification
    });
  }
  render(){
    return(
      <div className="avatar">
        <DropzoneControl 
          preview={this.state.preview}
          accept={this.props.accept}
          onChange={this.onChange.bind(this)}
        />
        <Modal show={this.state.isCropping} >
          <Modal.Header>
            <Modal.Title>Cropping</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CroppingControl ref="cropper"
              zoom={this.state.magnification}
              image={this.state.original}
              width={this.state.output[0]}
              height={this.state.output[1]}
              adjusted={this.image.bind(this)}
            />
          </Modal.Body>
          <Modal.Footer>
            <MagnificationControl 
              setMagnification={this.magnify.bind(this)} 
              max={this.state.maxMagnification} 
              value={this.state.magnification} 
              step={this.props.step}
            />   
            <Button onClick={this.handleCroppingCancel}>Cancel</Button>
            <Button onClick={this.handleCroppingAccepted}>Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
Avatar.defaultProps ={
  preview: 'https://via.placeholder.com/150x150', // Is the saved image or placeholder image.
  output: [300,300],
  step: 0.01,
  magnification: 3,
  accept: [
    'image/jpg',
    'image/bmp',
    'image/gif',
    'image/png',
    'image/jpeg'
  ],
  onAccept: function(){},
  onCancel: function(){}
}
export default Avatar;
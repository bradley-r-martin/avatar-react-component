import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import './croppingControl.styles.css';

class CroppingControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      image: {},
      mouse: {
        x: null,
        y: null
      },
      preview: null,
      zoom: props.zoom,
      maxZoom: props.zoom
    };
    this.listeners = [];
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.syncImage = this.syncImage.bind(this);
  }
  isDataURL(s) {
    const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
    return !!s.match(regex);
  }
  mouseDownListener(e){
    this.setState({
      image: this.state.image,
      dragging: true,
      mouse: {
        x: null,
        y: null
      }
    });
  }
  preventSelection(e){
    if (this.state.dragging) {
      e.preventDefault();
      return false;
    }
  }
  mouseUpListener(e) {
    this.setState({ dragging: false, preview: this.toDataURL() });
  }
  mouseMoveListener(e) {
    if(!this.state.dragging) return;
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    var imageX = this.state.image.x;
    var imageY = this.state.image.y;
    var newImage = this.state.image;
    if(this.state.mouse.x && this.state.mouse.y) {
      var dx = this.state.mouse.x - mouseX;
      var dy = this.state.mouse.y - mouseY;
      var bounded = this.boundedCoords(imageX, imageY, dx, dy);
      newImage.x = bounded.x;
      newImage.y = bounded.y;
    }
    this.setState({
      image: this.state.image,
      mouse: {
        x: mouseX,
        y: mouseY
      }
    });
    this.syncImage();
  }
  boundedCoords(x, y, dx, dy) {
    var newX = x - dx;
    var newY = y - dy;
    var scaledWidth = this.state.image.width * this.state.zoom;
    var dw = (scaledWidth - this.state.image.width) / 2;
    var rightEdge = this.props.width;
    if (newX - dw > 0) {
      x = dw;
    } else if (newX < -scaledWidth + rightEdge) {
      x = rightEdge - scaledWidth;
    } else {
      x = newX;
    }
    var scaledHeight = this.state.image.height * this.state.zoom;
    var dh = (scaledHeight - this.state.image.height) / 2;
    var bottomEdge = this.props.height;
    if (newY - dh > 0) {
      y = dh;
    } else if (newY < -scaledHeight + bottomEdge) {
      y = bottomEdge - scaledHeight;
    } else {
      y = newY;
    }
    return { x: x, y: y };
  }
  renderImage(){
    /* Use to render and re-render the image preview */
    if(this.props.image && this.props.image != this.state.cache){
      /* This is a new image or is the first time the cropping 
          tool has seen this image and we need to build the initial image to the canvas.
        */
      var image = new Image();
      if (!this.isDataURL(this.props.image)){
        image.crossOrigin = "anonymous";
      } 
      image.onload = () => {
        var scaledHeight, scaledWidth;
        var canvasAspectRatio = this.props.height / this.props.width;
        var imageAspectRatio = image.height / image.width;
        if(canvasAspectRatio > imageAspectRatio) {
          scaledHeight = this.props.height;
          let scaleRatio = scaledHeight / image.height;
          scaledWidth = image.width * scaleRatio;
        } else {
          scaledWidth = this.props.width;
          let scaleRatio = scaledWidth / image.width;
          scaledHeight = image.height * scaleRatio;
        }
        var scaledImage = { width: scaledWidth, height: scaledHeight };
        scaledImage.resource = image;
        scaledImage.x = 0;
        scaledImage.y = 0;
        this.setState({
          isDragging: false,
          image: scaledImage,
          // preview: this.toDataURL(),
          cache: this.props.image // Add the image to the cache for next compare.
        });
      };
      image.src = this.props.image;
    }
    var context = ReactDOM.findDOMNode(this.refs.canvas).getContext("2d");
    context.clearRect(0, 0, this.props.width, this.props.height);
    this.renderToCanvas(context, this.state.image);
  }
  syncImage(){
    /* Return image to parent */
    var image = this.toDataURL();
    this.props.adjusted(image);
  }
  renderToCanvas(context, image) {
    if (!image.resource) return;
    context.save();
    context.globalCompositeOperation = "destination-over";
    var scaledWidth = this.state.image.width * this.state.zoom;
    var scaledHeight = this.state.image.height * this.state.zoom;
    var x = image.x - (scaledWidth - this.state.image.width) / 2;
    var y = image.y - (scaledHeight - this.state.image.height) / 2;
    x = Math.min(x, 0);
    y = Math.min(y, 0);
    y =
      scaledHeight + y >= this.props.height
        ? y
        : y + (this.props.height - (scaledHeight + y));
    x =
      scaledWidth + x >= this.props.width
        ? x
        : x + (this.props.width - (scaledWidth + x));
    context.drawImage(
      image.resource,
      x,
      y,
      image.width * this.state.zoom,
      image.height * this.state.zoom
    );
    context.restore();
  }
  toDataURL() {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = this.props.width;
    canvas.height = this.props.height;
    this.renderToCanvas(context, {
      resource: this.state.image.resource,
      x: this.state.image.x,
      y: this.state.image.y,
      height: this.state.image.height,
      width: this.state.image.width
    });
    return canvas.toDataURL();
  }
  magnify(level){
    this.setState({ zoom: level });
    this.syncImage();
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.zoom!=this.state.zoom){
      this.magnify(nextProps.zoom);
    }
  }
  componentDidMount(){
    var canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.listeners = {
      mousemove: e => this.mouseMoveListener(e),
      mouseup: e => this.mouseUpListener(e),
      mousedown: e => this.mouseDownListener(e)
    };
    window.addEventListener("mousemove", this.listeners.mousemove, false);
    window.addEventListener("mouseup", this.listeners.mouseup, false);
    canvas.addEventListener("mousedown", this.listeners.mousedown, false);
    document.onselectstart = e => this.preventSelection(e);

    var self = this;
    this.refs.output.addEventListener("dragleave", function(){
      self.setState({
        isDropping:false
      });
    }, false);
    this.refs.output.addEventListener("dragover", function(){
      self.setState({
        isDropping:true
      });
    }, false);
    this.refs.output.addEventListener("drop", function(){
      self.setState({
        isDropping:false
      });
    }, false);


  }
  componentWillUnmount() {
    var canvas = ReactDOM.findDOMNode(this.refs.canvas);
    window.removeEventListener("mousemove", this.listeners.mousemove);
    window.removeEventListener("mouseup", this.listeners.mouseup);
    canvas.removeEventListener("mousedown", this.listeners.mousedown);
  }
  componentDidUpdate() {
    this.renderImage();
  }
  render(){
    var className = classNames(
      'croppingControl',
      { drop: this.state.isDropping }
    );
    return (
      <div className={className}>
        <div ref="output" className="output">
          <input ref="upload" type="file" accept="image/*" />
          <canvas ref="canvas"
            width={this.props.width}
            height={this.props.height}
          />
          <span className="dimensions">{this.props.width} X {this.props.height}</span>
        </div>
      </div>
    );
  }
}
CroppingControl.defaultProps = { 
  width: 400, 
  height: 400, 
  zoom: 1
};
export default CroppingControl;
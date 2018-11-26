import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import './magnificationControl.styles.css';

class MagnificationControl extends Component{
  constructor(props){
    super(props);
      this.state = {
        magnification: props.value
      };
  }
  handleChange() {
    var level= ReactDOM.findDOMNode(this.refs.zoom).value;
    this.setState({ 
      magnification: level
    });
    this.props.setMagnification(level);
  }
  render(){
    var className = classNames(
      'magnificationControl',
      { disabled: this.props.max==1 ? true : false }
    );
    return (
      <div className={className}>
        <span className="min"></span>
        <input type="range" ref="zoom" name="zoom" min="1"
          step={this.props.step}
          onChange={this.handleChange.bind(this)}
          max={this.props.max}
          value={this.state.magnification}
        />
        <span className="max"></span>
      </div>
    );
  }
}
MagnificationControl.defaultProps = {
  magnification: 1,
  step: 0.01,
  max: 3,
  setMagnification: function(){console.log('No setMagnification() callback defined.');}
}

export default MagnificationControl;
import React, { Component } from 'react';
import './App.css';

import { Grid, Row, Col } from 'react-bootstrap';

import Avatar from './components/avatar/Avatar';

class App extends Component {
  constructor(props){
    super(props);
  }
  onAccept(file){
    console.log(file);

    fetch('upload.php', {
      method: 'POST',
      mode: "same-origin",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "original": file.original,
        "cropped":  file.upload
      })
    }).then(function(response) {
      console.log(response);
    });


  }
  onCancel(){

  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Avatar Component</h1>
        </header>

        <Grid>
          <Row>
            <Col xs={12} md={4}>
              <strong>Avatar - 200 X 200</strong>
              <Avatar 
                preview="https://via.placeholder.com/200x200"
                output={[200,200]}
                magnification={3}
                onAccept={this.onAccept.bind(this)}
                onCancel={this.onCancel.bind(this)}
              />
            </Col>
            <Col xs={6} md={4}>
            <strong>Avatar - 570 X 500</strong>
              <Avatar 
                preview="https://via.placeholder.com/570x500"
                output={[570,500]}
                magnification={3}
                onAccept={this.onAccept.bind(this)}
                onCancel={this.onCancel.bind(this)}
              />
            </Col>
            <Col xs={6} md={4}>
            <strong>PNG image only</strong>
              <Avatar 
                preview="https://via.placeholder.com/350x350"
                output={[350,350]}
                accept={['image/png']}
                magnification={8}
                onAccept={this.onAccept.bind(this)}
                onCancel={this.onCancel.bind(this)}
              />
            </Col>
          </Row>
        </Grid>
        <Grid style={{'margin-top':60}}>
          <Row>
            <Col xs={12} md={6}>
              <strong>No magnification</strong>
              <Avatar 
                preview="https://via.placeholder.com/400x400"
                output={[400,400]}
                magnification={1}
                onAccept={this.onAccept.bind(this)}
                onCancel={this.onCancel.bind(this)}
              />
            </Col>
            <Col xs={6} md={6}>
            <strong>Magnification Steps</strong>
              <Avatar 
                preview="https://via.placeholder.com/250x250"
                output={[250,250]}
                magnification={3}
                step={0.5}
                onAccept={this.onAccept.bind(this)}
                onCancel={this.onCancel.bind(this)}
              />
            </Col>
          </Row>
        </Grid>
        <p className="App-intro" style={{'margin-top':60}}>
          Component <code>import Avatar from './avatar';</code>
        </p>
      </div>
    );
  }
}

export default App;

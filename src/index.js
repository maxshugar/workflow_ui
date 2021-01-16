import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GraphEditor from './components/graphEditor';
import CodeEditor from './components/codeEditor';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import Button from './components/button';

ReactDOM.render(
  <Container fluid>
    <Row>
      <Col><GraphEditor/></Col>
      <Col><CodeEditor/></Col>
    </Row>
  </Container>,
  document.getElementById('root')
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export const Home = () =>
(
  <Container fluid>
    <Row style={{ backgroundColor: '#2b3137', padding: '50px' }}>
      <Col align="center">
        <h1 style={{ marginBottom: '50px' }}>Test your products <b>quickly</b>,<br />
          and <b>focus</b> on writing<br /> high <b>quality</b> software.</h1>
        <Button style={{ fontSize: '40px', fontFamily: 'myriad_pro_bold', backgroundColor: '#54c7ec', padding: '20px' }}>Get Started!</Button>
      </Col>
    </Row>
    <Row style={{
      position: 'absolute',
      bottom: 0,
      width: '100%',
      lineHeight: '60px',
      backgroundColor: '#f5f5f5',
      paddingLeft: '20px'
    }} >
      <Col>
        <Row>
          <h5>© 2021 Sony UK Technology Center</h5>
        </Row>
        <Row>
          <h6>Advanced Manufacturing Research and Operations Center</h6>
        </Row>
      </Col>
    </Row>
  </Container>
);


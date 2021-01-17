import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default memo(({ data }) => {
  return (
    <>
      
      <Container style={{padding: "10px"}}>
      <Handle
        type="target"
        position="left"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <Handle
        type="target"
        position="right"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
          <Row>
            <Col>
            Info
            </Col>
            <Col>
            Controlls
            </Col>
          </Row>
          <Row>
          <input
            type="text"
            value = { data.label }
            style={{width: "50%", textAlign: "center"}}
            />
          </Row>
      </Container>
    </>
  );
});
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './index.css';

export const Home = () => {

  return (
    <>
      <Container fluid>
        <Row style={{ backgroundColor: '#2b3137', padding: '50px' }}>
          <Col>
            <Row align="center">
              <Col sm={8}>
                <p className="hero_text">
                  Test products <b>quickly</b>,<br />
              automate <b>deployment</b> and<br />
                  <b>collaborate</b> on projects
            </p>
              </Col>
              <Col sm={4}>
                <img
                  src="/logo_old.png"
                  width="200"
                  height="200"
                  className="my-auto"
                  style={{ float: 'left', marginTop: '60px;' }}
                  alt="WorkFlow logo"
                />
              </Col>
            </Row>
            <Row align="center">
              <Col>
                <Button style={{ fontSize: '25px', fontFamily: 'myriad_pro_bold', backgroundColor: '#25c2a0', padding: '10px 40px', border: 'none' }}>Get Started</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Container style={{ marginTop: '30px' }}>
        <Row>
          <Col align="center">
            <img
              src="/icons/checklist.png"
              width="100"
              height="100"
              alt="WorkFlow logo"
              className="my-2"
            />
            <p style={{ fontFamily: "croma_sans_bold", fontSize: "1.25rem" }}>Automated Product Testing</p>
            <p>Create scripts that test products and model their relationship between one another.</p>
          </Col>

          <Col align="center">
            <img
              src="/icons/cogs.png"
              width="100"
              height="100"
              alt="WorkFlow logo"
              className="my-2"
            />
            <p style={{ fontFamily: "croma_sans_bold", fontSize: "1.25rem" }}>Rapid Deployment</p>

            <p>Deploy your work directly to the production floor, in the click of a button.</p>
          </Col>

          <Col align="center">
            <img
              src="/icons/github.png"
              width="100"
              height="100"
              alt="WorkFlow logo"
              className="my-2"
            />
            <p style={{ fontFamily: "croma_sans_bold", fontSize: "1.25rem" }}>Collabative Development</p>
            <p>Work together on projects and review eachothers code through the power of GitHub.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}


import React, { useEffect } from 'react';
import { Container, Accordion, Card, Button, ListGroup } from 'react-bootstrap';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import { FloatingActionButton } from '../floating_action_button';
import style from './index.module.css';
import { history } from '../../helpers';
import { useSelector, useDispatch } from 'react-redux';

export const Projects = () => {
  const dispatch = useDispatch()
  const projects = useSelector(state => state.projects);

  // useEffect(() => {
  //   dispatch(projectActions.getAll());
  // }, [])

  // useEffect(() => {
  //   console.log(projects);
  // }, [projects])

  return (
    <>
      <FloatingActionButton label="New Project" icon={faPlusCircle} action={() => { history.push("/projects/new"); }} />
      <Container>
        <h1>Projects</h1>
        <Accordion style={{ marginTop: '50px' }} defaultActiveKey="0">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0" className={style.headingFont}>
                Favourites
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <ListGroup variant="flush">
                  
                </ListGroup>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion style={{ marginTop: '20px' }} defaultActiveKey="0">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Favourites
        </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>Hello! I'm the body</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion style={{ marginTop: '20px' }} defaultActiveKey="0">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                All Projects
        </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>

                <ListGroup variant="flush">
                  {projects != null &&
                    projects.map(project => <ListGroup.Item  className={style.project_list_item} onClick={() => history.push(`/projects/${project.id}`)} >{project.name}</ListGroup.Item>)
                  }
                </ListGroup>

              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

      </Container>
    </>
  );

}
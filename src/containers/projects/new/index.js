import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import styles from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { projectActions } from '../../../_actions';
import { history } from '../../../_helpers';

export const NewProject = (props) => {

    const dispatch = useDispatch();

    const [projectName, setProjectName] = useState();

    const handleCreate = (e) => {
        e.preventDefault()
        dispatch(projectActions.create({name: projectName}));
        //history.push("/projects");
    }

    const handleInputChanged = (event) => {
        setProjectName(event.target.value);
    }

    return (
        <>
            <div style={{ marginTop: '60px' }}>
                <Container style={{ padding: '0px 300px' }}>
                    <h1>New Project</h1>
                    <Form>
                        <Form.Group>
                            <Form.Label>Project name</Form.Label>
                            <Form.Control onChange={handleInputChanged.bind(this)} type="text" placeholder="Enter project name" />
                        </Form.Group>
                        <Button  onClick={handleCreate.bind(this)} variant="primary" type="Create project">
                            Submit
                        </Button>
                    </Form>
                </Container>
            </div>
        </>
    );
}


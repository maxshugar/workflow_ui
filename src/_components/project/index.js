import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './index.css';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { projectActions, taskActions } from '../../_actions';
import { CodeEditor } from '../code_editor';
import GraphEditor from '../graph_editor';
import { Console } from '../console';

export const Project = () => {

    const [selectedNode, setSelectedNode] = useState({id: -1, data: {label: 'test'}});

    let { id } = useParams();

    const handleRun = () => {
        dispatch(taskActions.run(selectedNode.data.code));
    }

    const dispatch = useDispatch()
    const project = useSelector(state => state.projects.item);

    const taskResult = useSelector(state => state.tasks.item)

    useEffect(() => {
        dispatch(projectActions.get(id));
    }, [])

    useEffect(() => {
        console.log({project});
    }, [project])

    useEffect(() => {
        console.log({taskResult});
    }, [taskResult])

    return (
    <>  
        <Container fluid>
            <Row>
                <Col>
                <h1 style={{ display: 'inline-block' }} >{project && project.name}</h1>
                <div style={{ float: 'right' }} >
                        <Button style={{ margin: '10px' }} onClick={handleRun.bind(this)} >Run</Button>
                        <Button>Debug</Button>
                </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CodeEditor selectedNode={selectedNode} />
                </Col>
                <Col>
                    <GraphEditor selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
                </Col>
            </Row>
            <Row>
                <Console/>
            </Row>
        </Container>
    </>
    );
}


import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './index.css';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { projectActions } from '../../_actions';
import { CodeEditor } from '../code_editor';
import GraphEditor from '../graph_editor';


export const Project = () => {

    const [selectedNode, setSelectedNode] = useState({id: -1, data: {label: 'test'}});

    let { id } = useParams();

    const dispatch = useDispatch()
    const project = useSelector(state => state.projects.item);

    useEffect(() => {
        dispatch(projectActions.get(id));
    }, [])

    // useEffect(() => {
    //     console.log({project});
    // }, [project])

    return (
    <>
        <Container fluid>
            <h1>{project && project.name}</h1>
            <Row>
                <Col>
                    <CodeEditor selectedNode={selectedNode} />
                </Col>
                <Col>
                    <GraphEditor selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
                </Col>
            </Row>
        </Container>
    </>
    );
}


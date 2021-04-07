import React, { useState, useEffect } from 'react';
import GraphEditor from '../../components/graph_editor';
import { CodeEditor } from '../../components/code_editor';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';



export const Editor = () =>  {
    const [selectedNode, setSelectedNode] = useState({id: -1, data: {label: 'test'}});
    return(
    <div className="Editor">
        <Container fluid>
            <Row>
            <Col><GraphEditor selectedNode={selectedNode} setSelectedNode={setSelectedNode} /></Col>
            <Col><CodeEditor selectedNode={selectedNode}/></Col>
            </Row>
        </Container>
    </div>
    )
};

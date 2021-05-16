import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './index.css';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { projectActions, taskActions } from '../../_actions';
import { CodeEditor } from '../code_editor';
import GraphEditor from '../graph_editor';
import { Console } from '../console';
// import { io } from "socket.io-client";
// import { socket } from '../../_helpers/socket';

import socketIOClient from "socket.io-client";

const socket = socketIOClient('http://localhost:8080');



export const Project = () => {

    useEffect(() => {
        
        socket.on("connect", data => {
            console.log('Connected to socket!');
        });

        socket.on('runResult', data => {
            console.log({data});
            if(data.ok)
                setConsoleText(data.res);
            else{
                setConsoleText(data.err);
            }
            if(data.hasOwnProperty('exitCode'))
                setConsoleText(`Script exited with code ${data.exitCode}.`);
        });

    }, []);

    const [selectedNode, setSelectedNode] = useState(
        {data: {
            label: "Script Node", code: ""
        },
        id: "2",
        position: {x: 141.8125, y: 192},
        type: "ScriptNode"
    });

    const [consoleText, setConsoleText] = useState();

    let { id } = useParams();
    
    const handleRun = () => {
        const data = { language: 'js', blocking: false, code: selectedNode.data.code };
        setConsoleText(`Running ${selectedNode.data.label}, please wait..`);
        socket.emit('runScript', data);
        //dispatch(taskActions.run(JSON.stringify(data)));
        //console.log(selectedNode)
    }

    const dispatch = useDispatch();
    const project = useSelector(state => state.projects.item);
    const taskResult = useSelector(state => state.tasks.item);

    useEffect(() => {
        console.log({taskResult});
    }, [taskResult])

    useEffect(() => {
        dispatch(projectActions.get(id));
    }, [])

    useEffect(() => {
        console.log({project});
    }, [project])

    // socket.on('connect', () => {
    //     // update messages
    //     console.log('Connected to socket!');
    // });
    // socket.on('runResult', payload => {
    //     // update messages
    //     console.log({payload});
    // });

    return (
    <>  
            <Container fluid style={{ maxHeight:"100%" }}> 
                <Row>
                    <Col>
                        <h3 style={{ display: 'inline-block' }} >Project Name: {project && project.name}</h3>
                        <div style={{ float: 'right' }} >
                                <Button style={{ margin: '5px' }} onClick={() => handleRun()} disabled={!selectedNode.type === 'ScriptNode'}>Run Script</Button>
                                <Button style={{ margin: '5px' }}>Debug Script</Button>
                                <Button style={{ margin: '5px' }}>Run Sequence</Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CodeEditor selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
                    </Col>
                    <Col>
                        <GraphEditor selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
                    </Col>
                </Row>
                <Row>
                    <Console consoleText={consoleText} />
                </Row>
            </Container>
    </>
    );
}


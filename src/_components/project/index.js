import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './index.css';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { projectActions, taskActions } from '../../_actions';
import { CodeEditor} from '../code_editor';
import GraphEditor from '../graph_editor';
import { Console } from '../console';
// import { io } from "socket.io-client";
// import { socket } from '../../_helpers/socket';

import socketIOClient from "socket.io-client";

const socket = socketIOClient('http://localhost:8000');



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

    const [selectedNode, setSelectedNode] = useState( {
        id: '1',
        type: 'StartNode',
        data: { label: 'Start Sequence'},
        position: { x: 250, y: 100 },
      }
    );

    const [consoleText, setConsoleText] = useState();

    let { id } = useParams();
    
    const handleRun = () => {
        console.log(selectedNode.data)
        const data = { language: 'js', script: selectedNode.data.script };
        setConsoleText(`Running ${selectedNode.data.label}, please wait..`);
        socket.emit('run', data);
        //dispatch(taskActions.run(JSON.stringify(data)));
        //console.log(selectedNode)
    }

    const handleDebug = () => {


        const {script, breakpoints} = selectedNode.data;
        console.log(breakpoints)
        // socket.emit('debugScript', {
        //     script,
        //     breakpoints
        // });
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
                                <Button style={{ margin: '5px' }} onClick={() => handleRun()} disabled={selectedNode.type !== 'ScriptNode'}>Run Script</Button>
                                <Button style={{ margin: '5px' }} onClick={() => handleDebug()} disabled={selectedNode.type !== 'ScriptNode'}>Debug Script</Button>
                                <Button style={{ margin: '5px' }} disabled={selectedNode.type !== 'ScriptNode'}>Run Sequence</Button>
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


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

let socket = null;



export const Project = () => {

    useEffect(() => {
        
        socket = socketIOClient('http://localhost:8000');
        socket.on("connect", data => {
            prettifyConsoleText('Connected to edge device.');
        });

        socket.on('data', data => {
            console.log({data});
            if(data.ok)
                setConsoleText(data.res);
            else{
                setConsoleText(data.err);
            }
            if(data.hasOwnProperty('exitCode'))
                setConsoleText(`Script exited with code ${data.exitCode}.`);
        });

        // socket.on('PAUSED', data => {
        //     console.log({data});
        //     if(data.breakpoint)
        //         setBreakpointHit(data.lineNumber)
        // });

        socket.on('state', state => {
            console.log({state})
            setDebuggerState(state);
        })

    }, []);

    const [debuggerState, setDebuggerState] = useState(null);

    const [selectedNode, setSelectedNode] = useState( {
        id: '1',
        type: 'StartNode',
        data: { 
            label: 'Start Sequence',
            script: '',
            breakpoints: []
        },
        position: { x: 250, y: 100 },
      }
    );
    
    const user = useSelector(state => state.authentication.user);
    
    const prettifyConsoleText = (text, type) => {
        setConsoleText(`<${user.username}/> ${text}`);
    }

    const [consoleText, setConsoleText] = useState();

    let { id } = useParams();

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
                                <Button style={{ margin: '5px' }} disabled={selectedNode.type !== 'ScriptNode'}>Run Sequence</Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CodeEditor prettifyConsoleText={prettifyConsoleText} debuggerState={debuggerState} socket={socket} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
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


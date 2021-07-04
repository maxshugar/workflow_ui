import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./index.css";
import Styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { CodeEditor } from "../code_editor";
import GraphEditor from "../graph_editor";
import { Console } from "../console";

import socketIOClient from "socket.io-client";
import { get as getProject } from "../../features/projectSlice";
import Split from "react-split";

let socket = null;

export const Project = () => {
  const dispatch = useDispatch();

  const id =
    window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];

  const user = useSelector((state) => state.user.user);

  const project = useSelector((state) => state.project.project.data);

  useEffect(() => {
    dispatch(getProject(id));
  }, []);

  useEffect(() => {
    socket = socketIOClient("http://localhost:8000");
    socket.on("connect", (data) => {
      prettifyConsoleText("Connected to edge device.", "SUCCESS");
    });

    socket.on("data", (data) => {
      setConsoleText({ text: data });
    });

    socket.on("error", (err) => {
      setConsoleText({ text: err, style: { color: "red" } });
    });

    socket.on("state", (state) => {
      setDebuggerState(state);
    });

    socket.on("sequencerState", ({ state, taskId, name }) => {
      console.log(state)

      switch(state){
        case 'STATE_SEQ_RUNNING':
          prettifyConsoleText('Sequencer starting.', 'INFO');
        break;
        case 'STATE_SEQ_COMPLETE':
          prettifyConsoleText('Sequencer complete.', 'INFO');
        break;
        case 'STATE_SEQ_IDLE':
          prettifyConsoleText('Sequencer idle.', 'INFO');
        break;
        case 'STATE_SEQ_TASK_RUNNING':
          prettifyConsoleText(`[${name}] running.`, 'INFO');
        break;
        case 'STATE_SEQ_TASK_COMPLETE':
          prettifyConsoleText(`[${name}] complete.`, 'INFO');
        break;
        case 'STATE_SEQ_TASK_ERROR':
          prettifyConsoleText(`[${name}] error.`, 'INFO');
        break;
      }

      if (state) setSequencerState({ state, taskId });
    });
  }, []);

  const [debuggerState, setDebuggerState] = useState(null);
  const [sequencerState, setSequencerState] = useState(null);

  const [selectedNode, setSelectedNode] = useState({
    id: "Start",
    type: "StartNode",
    data: {
      label: "Start",
      script: "",
      breakpoints: [],
    },
    position: { x: 250, y: 100 },
  });

  const [prevSelectedNode, setPrevSelectedNode] = useState(null);

  const prettifyConsoleText = (text, type) => {
    const formattedText = `[${user.data.login}] ${text}`;
    if (type == "INFO")
      setConsoleText({ text: formattedText, style: { color: "aqua" } });
    else if (type == "SUCCESS")
      setConsoleText({ text: formattedText, style: { color: "green" } });
    else setConsoleText({ text: formattedText });
  };

  const [consoleText, setConsoleText] = useState();

  return (
    <>
      <Container fluid style={{ maxHeight: "100%", marginTop: '20px' }}>
        <Wrapper>
          <Split className="split" direction="horizontal" minSize={700}>
            <div>

                  <CodeEditor
                    prettifyConsoleText={prettifyConsoleText}
                    debuggerState={debuggerState}
                    socket={socket}
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                  />
                  <Console consoleText={consoleText} />
         
            </div>

              <GraphEditor
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                prevSelectedNode={prevSelectedNode}
                setPrevSelectedNode={setPrevSelectedNode}
                project={project}
                socket={socket}
                sequencerState={sequencerState}
              />
    
          </Split>
        </Wrapper>
      </Container>
    </>
  );
};

const Wrapper = Styled.section`
  .split {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
  }

  .gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
  }
  .gutter.gutter-vertical {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
    cursor: row-resize;
}
`;

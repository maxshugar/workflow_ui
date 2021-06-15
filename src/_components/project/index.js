import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { CodeEditor } from "../code_editor";
import GraphEditor from "../graph_editor";
import { Console } from "../console";

import socketIOClient from "socket.io-client";
import { get } from "../../features/projectSlice";

let socket = null;

export const Project = () => {
  const dispatch = useDispatch();

  const id =
    window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];

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
  }, []);

  const [debuggerState, setDebuggerState] = useState(null);

  const [selectedNode, setSelectedNode] = useState({
    id: "1",
    type: "StartNode",
    data: {
      label: "Start Sequence",
      script: "",
      breakpoints: [],
    },
    position: { x: 250, y: 100 },
  });

  const user = useSelector((state) => state.user.user);

  const prettifyConsoleText = (text, type) => {
    const formattedText = `[${user.data.login}] ${text}`;
    if (type == "INFO")
      setConsoleText({ text: formattedText, style: { color: "aqua" } });
    else if (type == "SUCCESS")
      setConsoleText({ text: formattedText, style: { color: "green" } });
    else setConsoleText({ text: formattedText });
  };

  const [consoleText, setConsoleText] = useState();

  const project = useSelector((state) => state.project.project.data);

  useEffect(() => {
    dispatch(get(id));
  }, []);

  useEffect(() => {
    console.log({ project });
  }, [project]);

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
      <Container fluid style={{ maxHeight: "100%" }}>
        <Row>
          <Col>
            <h3 style={{ display: "inline-block" }}>
              Project Name: {project && project._id}
            </h3>
            <div style={{ float: "right" }}>
              <Button
                style={{ margin: "5px" }}
                disabled={selectedNode.type !== "ScriptNode"}
              >
                Run Sequence
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <CodeEditor
              prettifyConsoleText={prettifyConsoleText}
              debuggerState={debuggerState}
              socket={socket}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          </Col>
          <Col>
            <GraphEditor
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          </Col>
        </Row>
        <Row>
          <Console consoleText={consoleText} />
        </Row>
      </Container>
    </>
  );
};

import React, { useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/addon/selection/active-line";
import { Controlled as ControlledEditor } from "react-codemirror2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPlayCircle,
  faShare,
  faStepForward,
  faStopCircle,
} from "@fortawesome/free-solid-svg-icons";

import "./index.css";
import { Dropdown } from "react-bootstrap";

export const CodeEditor = (props) => {
  const {
    selectedNode,
    setSelectedNode,
    prettifyConsoleText,
    socket,
    debuggerState,
  } = props;

  const [isRunning, setIsRunning] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [clearMarkers, setClearMarkers] = useState(false);

  const debuggerStateRef = useRef(debuggerState);
  const socketRef = useRef(socket);

  const [language, setLanguage] = useState("language");

  const handleRun = () => {
    prettifyConsoleText(`Running ${selectedNode.data.label}, please wait..`);
    socket.emit("run", selectedNode.data);
  };
  const handleDebug = () => {
    //prettifyConsoleText(`Debugging ${selectedNode.data.label}, please wait..`);
    socket.emit("debug", selectedNode.data);
  };
  const handleContinue = () => socket.emit("continue", selectedNode.data);
  const handleAbort = () => socket.emit("abort");

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  const clearMarkersDOM = () => {
    for (let i = 0; i < markers.length; i++) {
      markers[i].clear();
    }
  };

  useEffect(() => {
    setMarkers([]);
    setClearMarkers(false);
  }, [clearMarkers]);

  const markLine = (lineNumber, className = "codemirror-highlighted") => {
    const from = { line: lineNumber - 1, ch: 0 };
    const to = { line: lineNumber - 1, ch: 1000000 };
    let m = editorRef.current.markText(from, to, { className });
    setMarkers(markers.concat(m));
  };

  useEffect(() => {
    let selectedNodeCopy = { ...selectedNode };
    selectedNodeCopy.data.language = language;
    setSelectedNode(selectedNodeCopy);
    editorRef.current.setOption("mode", language);
    console.log(editorRef.current);
  }, [language]);

  useEffect(() => {
    let prevState = debuggerStateRef.current;
    console.log(debuggerState);
    if (debuggerState == null) return;
    switch (debuggerState.state) {
      case "STATE_RUNNING":
        setIsRunning(true);
        break;
      case "STATE_DEBUGGING":
        setIsDebugging(true);
        prettifyConsoleText(
          `Debugging ${selectedNode.data.label}, please wait..`
        );
        break;
      case "STATE_COMPLETE":
        setIsRunning(false);
        setIsDebugging(false);
        prettifyConsoleText(
          `${selectedNode.data.label} complete :)`,
          "SUCCESS"
        );
        clearMarkersDOM();
        setClearMarkers(true);
        break;
      case "STATE_PAUSED":
        if (debuggerState.breakpoint) {
          markLine(debuggerState.lineNumber);
        }
        break;
      case "STATE_ABORTED":
        prettifyConsoleText(`Aborted.`);
        setIsReady(false);
        clearMarkersDOM();
        setClearMarkers(true);
        socket.emit("getState");
        break;
      case "STATE_IDLE":
        const engineType = debuggerState.engineType;

        console.log(debuggerState);

        if (engineType === "python") {
          if (prevState) {
            if (
              prevState.state == "STATE_BREAKPOINT_ADDED" ||
              prevState.state == "STATE_BREAKPOINT_REMOVED"
            )
              break;
            else if (prevState.state == "STATE_ABORTED") {
              // Add current breakpoints back to new debugger instance after abort.
              socket.emit("addBreakpoints", selectedNode.data.breakpoints);
            }
          }
          prettifyConsoleText(`Python engine ready.`, "INFO");
        } else if (engineType === "javascript") {
          prettifyConsoleText(`JavaScript engine ready.`, "INFO");
        }
        setIsReady(true);
        setIsRunning(false);
        setIsDebugging(false);
        break;
      case "STATE_CONTINUING":
        clearMarkersDOM();
        setClearMarkers(true);
        break;
      case "STATE_BREAKPOINT_ADDED":
        addBreakpoint(debuggerState.lineNumber);
        break;
      case "STATE_BREAKPOINT_REMOVED":
        removeBreakpoint(debuggerState.lineNumber);
        break;
    }
    debuggerStateRef.current = debuggerState;
  }, [debuggerState]);

  function makeMarker() {
    var marker = document.createElement("div");
    marker.style.color = "#fff";
    marker.style.marginLeft = "5px";
    marker.innerHTML = "●";
    return marker;
  }

  const selectedNodeRef = useRef(selectedNode);
  const editorRef = useRef(null);

  // Update breakpoints when switching between nodes.
  useEffect(() => {
    setLanguage(selectedNode.data.language);

    // If a new node has been selected.
    if (selectedNode.id != selectedNodeRef.current.id) {
      // Remove all breakpoints for previously selected node.
      let breakpoints = selectedNodeRef.current.data.breakpoints;
      for (let i = 0; i < breakpoints.length; i++) {
        editorRef.current.setGutterMarker(
          breakpoints[i] - 1,
          "breakpoints",
          null
        );
      }
      // Render previously set breakpoints for current node.
      breakpoints = selectedNode.data.breakpoints;
      for (let i = 0; i < breakpoints.length; i++) {
        editorRef.current.setGutterMarker(
          breakpoints[i] - 1,
          "breakpoints",
          makeMarker()
        );
      }
    }

    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  function handleChange(editor, data, value) {
    let selectedNodeCopy = { ...selectedNode };
    selectedNodeCopy.data.script = value;
    setSelectedNode(selectedNodeCopy);
  }

  function breakpointExists(lineNumber) {
    let editor = editorRef.current;
    let lineInfo = editor.lineInfo(lineNumber);
    return lineInfo.gutterMarkers;
  }

  function addBreakpoint(lineNumber) {
    let editor = editorRef.current;
    let selectedNodeCopy = { ...selectedNodeRef.current };
    selectedNodeCopy.data.breakpoints.push(lineNumber);
    setSelectedNode(selectedNodeCopy);
    editor.setGutterMarker(lineNumber - 1, "breakpoints", makeMarker());
    editor.addLineClass(lineNumber - 1, "line", "new-breakpoint");
  }

  function removeBreakpoint(lineNumber) {
    let editor = editorRef.current;
    // Remove the breakpoint.
    let selectedNodeCopy = { ...selectedNodeRef.current };
    const index = selectedNodeCopy.data.breakpoints.indexOf(lineNumber);
    if (index > -1) {
      selectedNodeCopy.data.breakpoints.splice(index, 1);
      setSelectedNode(selectedNodeCopy);
      editor.setGutterMarker(lineNumber - 1, "breakpoints", undefined);
    }
  }

  function handleGutterClick(editor, line, str, ent) {
    if (selectedNodeRef.current.type !== "ScriptNode") return;

    if (selectedNodeRef.current.data.language !== "python") return;

    let socket = socketRef.current;
    editorRef.current = editor;

    let val = breakpointExists(line);

    if (!breakpointExists(line)) {
      socket.emit("addBreakpoint", line + 1);
    } else {
      socket.emit("removeBreakpoint", line + 1);
    }
  }

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  return (
    <div className={`editor-container`}>
      <div className="editor-title">
        <Button
          style={{ margin: "5px" }}
          onClick={() => handleRun()}
          disabled={
            selectedNode.type !== "ScriptNode" ||
            isRunning ||
            isDebugging ||
            !isReady
          }
        >
          Run
          <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faPlay} />
        </Button>

        <Button
          style={{ margin: "5px" }}
          onClick={() => handleDebug()}
          disabled={
            selectedNode.type !== "ScriptNode" ||
            isDebugging ||
            isRunning ||
            !isReady
          }
        >
          Debug
          <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faPlayCircle} />
        </Button>

        <Button
          style={{ margin: "5px" }}
          onClick={() => handleContinue()}
          disabled={!isDebugging || !isReady}
        >
          Continue
          <FontAwesomeIcon
            style={{ marginLeft: "10px" }}
            icon={faStepForward}
          />
        </Button>

        <Button
          style={{ margin: "5px" }}
          onClick={() => handleAbort()}
          disabled={(!isRunning && !isDebugging) || !isReady}
          variant="warning"
        >
          Abort
          <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faStopCircle} />
        </Button>

        <Dropdown style={{ display: "inline-block", width: "120px", float: 'right', margin: '5px' }} alignRight>
          <Dropdown.Toggle
            variant="info"
            
            id="dropdown-basic"
            disabled={selectedNode && selectedNode.type !== "ScriptNode"}
          >
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setLanguage("python")}>
              Python
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setLanguage("javascript")}>
              JavaScript
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <ControlledEditor
        onBeforeChange={handleChange}
        onGutterClick={handleGutterClick}
        editorDidMount={handleEditorDidMount}
        value={selectedNode.data.script}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: "python",
          theme: "material",
          lineNumbers: true,
          styleActiveLine: true,
          gutters: ["CodeMirror-linenumbers", "breakpoints"],
        }}
      />
    </div>
  );
};

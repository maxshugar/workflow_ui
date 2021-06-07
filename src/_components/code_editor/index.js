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
  faCompressAlt,
  faExpandAlt,
  faPlay,
  faPlayCircle,
  faShare,
  faShareAlt,
  faStepForward,
  faStopCircle,
} from "@fortawesome/free-solid-svg-icons";

import "./index.css";

export const CodeEditor = (props) => {
  const {
    selectedNode,
    setSelectedNode,
    setConsoleText,
    socket,
    debuggerState,
  } = props;

  const [open, setOpen] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [isReady, setIsReady] = useState(true);

  const handleRun = () => {
    setConsoleText(`Running ${selectedNode.data.label}, please wait..`);
    socket.emit("run", selectedNode.data);
  };
  const handleDebug = () => {
    setConsoleText(`Debugging ${selectedNode.data.label}, please wait..`);
    socket.emit("debug", selectedNode.data);
  };
  const handleContinue = () => socket.emit("continue", selectedNode.data);
  const handleStep = () => socket.emit("step", selectedNode.data);
  const handleAbort = () => socket.emit("abort");

  useEffect(() => {
    console.log(debuggerState);
    if (debuggerState == null) return;
    switch (debuggerState.state) {
      case "STATE_RUNNING":
        setIsRunning(true);
        break;
      case "STATE_DEBUGGING":
        setIsDebugging(true);
        setConsoleText(`Debugging ${selectedNode.data.label}, please wait..`);
        break;
      case "STATE_COMPLETE":
        setIsRunning(false);
        setIsDebugging(false);
        setConsoleText(`${selectedNode.data.label} complete :)`);
        break;
      case "STATE_PAUSED":
        if (debuggerState.breakpoint) {
          const from = { line: debuggerState.lineNumber - 1, ch: 0 };
          const to = { line: debuggerState.lineNumber - 1, ch: 1000000 };
          editorRef.current.markText(from, to, {
            className: "codemirror-highlighted",
          });
        }
        break;
      case "STATE_ABORTED":
        setConsoleText(`Aborted.`);
        setIsReady(false);
        break;
      case "STATE_STARTED":
        setConsoleText(`Debugger ready.`);
        setIsReady(true);
        setIsRunning(false);
        setIsDebugging(false);
    }
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

  //   useEffect(() => {
  //     console.log(breakpointHit);

  //     const from = { line: breakpointHit - 1, ch: 0 };
  //     const to = { line: breakpointHit - 1, ch: 1000000 };
  //     editorRef.current.markText(from, to, {
  //       className: "codemirror-highlighted",
  //     });
  //   }, [breakpointHit]);

  useEffect(() => {
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
    console.log("onBeforeChange");
    let selectedNodeCopy = { ...selectedNode };
    selectedNodeCopy.data.script = value;
    setSelectedNode(selectedNodeCopy);
  }

  function handleGutterClick(editor, line, str, ent) {
    editorRef.current = editor;

    let lineInfo = editor.lineInfo(line);

    // If no breakpoint exists on line.
    if (!lineInfo.gutterMarkers) {
      let selectedNodeCopy = { ...selectedNodeRef.current };
      selectedNodeCopy.data.breakpoints.push(line + 1);
      setSelectedNode(selectedNodeCopy);
    } else {
      // Remove the breakpoint.
      let selectedNodeCopy = { ...selectedNodeRef.current };
      const index = selectedNodeCopy.data.breakpoints.indexOf(line + 1);
      if (index > -1) {
        selectedNodeCopy.data.breakpoints.splice(index, 1);
        setSelectedNode(selectedNodeCopy);
      }
    }

    editorRef.current.setGutterMarker(
      line,
      "breakpoints",
      lineInfo.gutterMarkers ? null : makeMarker()
    );
    editorRef.current.addLineClass(line, "line", "new-breakpoint");

    console.log(selectedNodeRef.current);
  }

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  return (
    <div className={`editor-container ${open ? "" : "collapsed"}`}>
      <div className="editor-title">
        <h5>Editor Title</h5>
        <div>
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
            <FontAwesomeIcon
              style={{ marginLeft: "10px" }}
              icon={faPlayCircle}
            />
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
            onClick={() => handleStep()}
            disabled={!isDebugging || !isReady}
          >
            Step
            <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faShare} />
          </Button>

          <Button
            style={{ margin: "5px" }}
            onClick={() => handleAbort()}
            disabled={(!isRunning && !isDebugging) || !isReady}
          >
            Abort
            <FontAwesomeIcon
              style={{ marginLeft: "10px" }}
              icon={faStopCircle}
            />
          </Button>

          <button
            type="button"
            className="expand-collapse-btn"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt} />
          </button>
        </div>
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

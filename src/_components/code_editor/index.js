import React, { useEffect, useState, useRef } from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/python/python'
import { Controlled as ControlledEditor } from 'react-codemirror2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons'

import './index.css'

export const CodeEditor = (props) => {
  const {
    selectedNode,
    setSelectedNode
  } = props
  const [open, setOpen] = useState(true)

  function makeMarker() {
    var marker = document.createElement("div");
    marker.style.color = "#fff";
    marker.style.marginLeft = "5px"
    marker.innerHTML = "●";
    return marker;
  }

  const selectedNodeRef = useRef(selectedNode);

  useEffect(() => {
      selectedNodeRef.current = selectedNode;
   }, [selectedNode])

  function handleChange(editor, data, value) {
    let selectedNodeCopy = { ...selectedNode };
    selectedNodeCopy.data.script = value;
    setSelectedNode(selectedNodeCopy);
  }

  function handleGutterClick(editor, line, str, ent){
    //console.log(selectedNodeRef)

    let lineInfo = editor.lineInfo(line);
    
    // If no breakpoint exists on line.
    // if(!lineInfo.gutterMarkers){
    //   let selectedNodeCopy = { ...selectedNode };
    //   console.log(selectedNodeCopy)
    //   selectedNodeCopy.data.breakpoints.push(line);
    //   setSelectedNode(selectedNodeCopy);
    // } else { // Remove the breakpoint.
    //   let selectedNodeCopy = { ...selectedNode };
    //   const index = selectedNodeCopy.data.breakpoints.indexOf(line)
    //   if(index > -1){
    //     selectedNodeCopy.data.breakpoints.splice(index, 1);
    //     setSelectedNode(selectedNodeCopy);
    //   }
    // }

    editor.setGutterMarker(line, "breakpoints", lineInfo.gutterMarkers ? null : makeMarker());
    editor.addLineClass(line, "line", "new-breakpoint");
    console.log("Bp?");


  }

  return (
    <div className={`editor-container ${open ? '' : 'collapsed'}`}>
      <div className="editor-title">
        Editor Title
        <button
          type="button"
          className="expand-collapse-btn"
          onClick={() => setOpen(prevOpen => !prevOpen)}
        >
          <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt} />
        </button>
      </div>
      <ControlledEditor
        onBeforeChange={handleChange}
        onGutterClick={handleGutterClick}
        value={selectedNode.data.script}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: "python",
          theme: 'material',
          lineNumbers: true,
          gutters: ["CodeMirror-linenumbers", "breakpoints"]
        }}
      />
    </div>
  )
}
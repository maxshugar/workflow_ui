import React, { Component, useEffect } from "react";

import { UnControlled as CodeMirror } from "react-codemirror2";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
require('codemirror/mode/python/python');

function makeMarker() {
  var marker = document.createElement("div");
  marker.style.color = "#fff";
  marker.style.marginLeft = "5px"
  marker.innerHTML = "●";
  return marker;
}


class CodeEditor extends Component{
  constructor(props){
    console.log(props)
    super(props);
    this.state = {
      selectedNode: props.selectedNode,
      setSelectedNode: props.setSelectedNode
    }
    this.instance = null;
  }

  onChange(editor, data, value){
    console.log('on change')
    let selectedNodeCopy = { ...this.state.selectedNode };
    selectedNodeCopy.data.script = value;
    this.state.setSelectedNode(selectedNodeCopy);
    console.log(this.state.selectedNode.data)
  };

  componentDidMount() {
    // setTimeout(() => {this.instance.refresh()}, 0); // Doesn't work
    this.instance.refresh();
  }

  render(){
    return ( 
      <CodeMirror
        value={this.state.selectedNode.data.script}
        options={{
          mode: "python",
          theme: "material",
          lineNumbers: true,
          gutters: [
            'breakpoints'
          ]
        }}
        height="300px"
        onGutterClick={(editor, data, value) => {} }
        onChange={onchange}
        editorDidMount={editor => { this.instance = editor }}
      />
    );
  }
}

export default CodeEditor;

// // Render editor
// export const CodeEditor = ({ selectedNode, setSelectedNode }) => {

//   let breakpoints = {};


  

//   useEffect(() => {
//     console.log({msg:'code editor node changed to', selectedNode})
//   }, [selectedNode]);

//   const handleGutterClick = (editor, line, str, ent) => {

//     console.log(selectedNode)

//     // let lineInfo = editor.lineInfo(line);
    
//     // // If no breakpoint exists on line.
//     // if(!lineInfo.gutterMarkers){
//     //   let selectedNodeCopy = { ...selectedNode };
//     //   console.log(selectedNodeCopy)
//     //   selectedNodeCopy.data.breakpoints.push(line);
//     //   setSelectedNode(selectedNodeCopy);
//     // } else { // Remove the breakpoint.
//     //   let selectedNodeCopy = { ...selectedNode };
//     //   const index = selectedNodeCopy.data.breakpoints.indexOf(line)
//     //   if(index > -1){
//     //     selectedNodeCopy.data.breakpoints.splice(index, 1);
//     //     setSelectedNode(selectedNodeCopy);
//     //   }
//     // }

//     // editor.setGutterMarker(
//     //   line,
//     //   "breakpoints",
//     //   lineInfo.gutterMarkers ? null : makeMarker()
//     // );
//     // editor.addLineClass(line, "line", "new-breakpoint");
//     // console.log("Bp?");
//   };

//   //   console.log(Editor)

//   return (
//     <CodeMirror
//       value={selectedNode.data.script}
//       options={{
//         mode: "python",
//         theme: "material",
//         lineNumbers: true,
//         gutters: [
//           'breakpoints'
//         ]
//       }}
//       height="300px"
//       onGutterClick={(editor, data, value) => {handleGutterClick()} }
//       onChange={onChange}
//     />
//   );
// };

// import React, { Component } from "react";
// import AceEditor from "react-ace";

// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/theme-github";

// // Render editor
// export const CodeEditor = ({ selectedNode, setSelectedNode }) => {

//   const onChange = (newValue) => {
//     let selectedNodeCopy = {...selectedNode};
//     selectedNodeCopy.data.code = newValue;
//     setSelectedNode(selectedNodeCopy);
//   };

//   const onFocus = (e) => {
//     console.log({e})
//   };

//   return (
//     <AceEditor
//       mode="javascript"
//       theme="github"
//       onChange={onChange}
//       name="UNIQUE_ID_OF_DIV"
//       editorProps={{ $blockScrolling: true }}
//       value={selectedNode.data.code || ""}
//       style={{ border: '1px solid black', width: '100%' }}
//       onFocus={onFocus}
//     />
//   );
// };

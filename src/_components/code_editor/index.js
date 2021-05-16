import React, { Component } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

// Render editor
export const CodeEditor = ({ selectedNode, setSelectedNode }) => {

  const onChange = (newValue) => {
    let selectedNodeCopy = {...selectedNode};
    selectedNodeCopy.data.code = newValue;
    setSelectedNode(selectedNodeCopy);
  }; 

  return (
    <AceEditor
      mode="javascript"
      theme="github"
      onChange={onChange}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      value={selectedNode.data.code || ""}
      style={{ border: '1px solid black', width: '100%' }}
    />
  );
};

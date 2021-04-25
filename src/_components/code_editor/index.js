import React, { Component } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import { ConnectionMode } from "react-flow-renderer";

// Render editor
export const CodeEditor = ({selectedNode}) => {
  const onChange = (newValue) => {
    selectedNode.data.code = newValue;
  }

    return( 
    <AceEditor
        mode="javascript"
        theme="github"
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        value={selectedNode.data.code || "default"}
    />
    )
}
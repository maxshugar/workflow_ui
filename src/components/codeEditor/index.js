import React, { Component } from "react";
import { render } from "react-dom";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

// Render editor
export default class CodeEditor extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    render(){
        return(
        <AceEditor
            mode="java"
            theme="github"
            onChange={this.onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
        />
        )
    }

    onChange(newValue){
      console.log("change", newValue);
    }
}

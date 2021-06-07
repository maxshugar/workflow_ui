import React, { useState, useEffect, Fragment } from "react";

import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";

import './index.css'


export const CodeEditor = (props) => {


    const highlight = code => (
        <Highlight {...defaultProps} theme={theme} code={code} language="python">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Fragment>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => <span {...getTokenProps({ token, key })} />)}
                </div>
              ))}
            </Fragment>
          )}
        </Highlight>
      )


      const pycode = `
      def test():
          print("Hello, World!")
      
    `
  const [content, setContent] = useState(pycode);

  const handleKeyDown = (evt) => {
    let value = content,
      selStartPos = evt.currentTarget.selectionStart;

    // handle 4-space indent on
    if (evt.key === "Tab") {
      value =
        value.substring(0, selStartPos) +
        "    " +
        value.substring(selStartPos, value.length);
      evt.currentTarget.selectionStart = selStartPos + 3;
      evt.currentTarget.selectionEnd = selStartPos + 4;
      evt.preventDefault();

      setContent(value);
    }
  };

//   useEffect(() => {
//     Prism.highlightAll();
//   }, [content]);

  const jscode = `const App = props => {
    return (
      <div>
        <h1> React App </h1>
        <div>Awesome code</div>
      </div>
    );
  };
  `;
 

  //setContent(pycode)

//   useEffect(() => {
//     Prism.highlightAll();
//   }, []);

  return (
    <div className="code-edit-container">
      <textarea
        className="code-input"
        value={pycode}
         onChange={(evt) => setContent(evt.target.value)}
        onKeyDown={handleKeyDown}
      />
      <pre className="code-output">
        <code>{highlight(content)}</code>
      </pre>
      {/* <pre>
        <code>{highlight(pycode)}</code>
      </pre> */}
    </div>
  ); 
};

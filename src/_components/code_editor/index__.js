import React, { useState, useEffect, Fragment } from "react";

import Highlight, { defaultProps } from "prism-react-renderer";

// import Prism from "prismjs";

import './index.css'

export const CodeEditor = (props) => {

  const [lineNumbers, setLineNumbers] = useState([]);

  const countLines = (codeString) => {
    return codeString?.split(/\r*\n/);
  };

    const highlight = code => (
        <Highlight {...defaultProps} code={code} language="py">
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


      const pycode = `def test():\n\tprint("Hello, World!")`
  const [content, setContent] = useState(pycode);

  const handleKeyDown = evt => {
    let value = content,
      selStartPos = evt.currentTarget.selectionStart;

    console.log(evt.currentTarget);

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

  useEffect(() => {
    let numLines = countLines(content)
    console.log(numLines)
  }, [content]);

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
  <div className="container code-edit-container">
    <div className="line-nums">
      <p className="lineNumber">1</p>
      <p className="lineNumber">1</p>
      <p className="lineNumber">1</p>
      <p className="lineNumber">1</p>
    </div>
    <textarea
      className="code-input"
      value={content}
      onChange={evt => setContent(evt.target.value)}
      onKeyDown={handleKeyDown}
    />
    <pre className="code-output">
      <code className={`language-${props.language}`}>{highlight(content)}</code>
    </pre>
  </div>
);
};

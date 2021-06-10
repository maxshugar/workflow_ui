import React, { useState, useEffect } from "react";
import Terminal from "react-console-emulator";
import styles from './index.module.css';

export const Console = ({consoleText}) => {
  const terminal = React.createRef();
  
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if(consoleText != null){
      const rootNode = terminal.current;
      rootNode && rootNode.pushToStdout(consoleText);
      //console.log('code', consoleText);
      rootNode && rootNode.scrollToBottom()
    }
    
  }, [consoleText])

  // Experimental syntax, requires Babel with the transform-class-properties plugin
  // You may also define commands within render in case you don't have access to class field syntax

  return (
    <Terminal
      className={styles.console}
      ref={terminal} // Assign ref to the terminal here
        commands={{}}
        readOnly
        disabled={isRunning}
        locked={isRunning}
        noAutoScroll={true}
    />
  );

};

import React, { useState, useEffect } from "react";
import Terminal from "react-console-emulator";
import TerminalMessage from "./TerminalMessage";
import innerText from "react-innertext";
import styles from "./index.module.css";

export const Console = ({ consoleText }) => {
  const terminalRef = React.createRef();

  const parseEOL = (stdout) => {
    const parsedStdout = [];
    for (let i = 0; i < stdout.length; i++) {
      const currentLine = stdout[i];
      const { message, isEcho, style } = currentLine;
      const messageText = innerText(message);
      // Do not parse echoes (Raw inputs)
      const parsed =
        !isEcho && /\n|\\n/g.test(messageText)
          ? messageText.split(/\n|\\n/g)
          : [message];

      for (const line of parsed) {
        parsedStdout.push({ message: line, isEcho: currentLine.isEcho, style });
      }
    }
    return parsedStdout;
  };

  useEffect(() => {
    let terminal = terminalRef.current;

    terminal.pushToStdout = (message, style, options) => {
      const { stdout } = terminal.state
      if (terminal.props.locked) stdout.pop()
      stdout.push({ message, isEcho: options?.isEcho || false, style })
      /* istanbul ignore next: Covered by interactivity tests */
      if (options?.rawInput) terminal.pushToHistory(options.rawInput)
      terminal.setState({ stdout: stdout })
    } 

    terminal.getStdout = () => {
      // Parse EOL if it isn't disabled
      const stdoutLocal = !terminal.props.noNewlineParsing
        ? parseEOL(terminal.state.stdout)
        : terminal.state.stdout;

      return stdoutLocal.map((line, i) => {
        return (
          <TerminalMessage
            key={i}
            content={line.message}
            dangerMode={terminal.props.dangerMode}
            className={
              !line.isEcho
                ? terminal.props.messageClassName
                : /* istanbul ignore next: Covered by interactivity tests */ undefined
            }
            style={line.style}
          />
        );
      });
    };
  }, [terminalRef]);

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (consoleText != null) {
      const {text, style} = consoleText;
      const rootNode = terminalRef.current;
      rootNode && rootNode.pushToStdout(text, style);
      //console.log('code', consoleText);
      rootNode && rootNode.scrollToBottom();
    }
  }, [consoleText]);

  // Experimental syntax, requires Babel with the transform-class-properties plugin
  // You may also define commands within render in case you don't have access to class field syntax

  return (
    <Terminal
      className={styles.console}
      ref={terminalRef} // Assign ref to the terminal here
      commands={{}}
      readOnly
      disabled={isRunning}
      locked={isRunning}
      noAutoScroll={true}
    />
  );
};

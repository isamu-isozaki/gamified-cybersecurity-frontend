import React, { useState } from "react";
import Terminal, { TerminalOutput } from 'react-terminal-ui';
import PropTypes from 'prop-types';

function TerminalGCS({
    commands,
    terminalOutputs,
    sendCommand
}) {
    const [terminalLineData, setTerminalLineData] = useState([
        <TerminalOutput key={1}>Welcome to the React Terminal UI Demo!</TerminalOutput>
    ]);

    const handleCommand = async (terminalInput) => {
        //sendCommand(terminalInput);
        setTerminalLineData(
          commands.map((command, idx) => (
            terminalOutputs[idx]
        )));
      }

      return (
        <div className="container">
          <Terminal 
            name='Gamified Cybersecurity' 
            onInput={ terminalInput => handleCommand(terminalInput) }
          >
            { terminalLineData }
          </Terminal>
        </div>
      );
}

TerminalGCS.propTypes = {
  commands: PropTypes.array,
  terminalOutputs: PropTypes.array,
  sendCommand: PropTypes.func,
}

export default TerminalGCS;
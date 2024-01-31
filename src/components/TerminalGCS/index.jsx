import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { sendCommand } from '../../app/store/command';
import { connect } from 'react-redux';
import '../../global.css';

function TerminalGCS({
    socket
}) {
    const [inputCommand, setInputCommand] = useState("");
    const [terminalOutput, setTerminalOutput] = useState([]);

    const handleCommand = async (terminalInput) => {
        socket.emit('command', terminalInput);
      }
      
      useEffect(() => {
        socket.on('commandResult', (result) => {
            console.log(result);
          setTerminalOutput(terminalOutput.concat(result));
          console.log(terminalOutput);
        });
      });

      return (
        <div>
          <h1>Terminal</h1>
          <div className="w-1/2 bg-black h-96">
            <div className="overflow-y-auto max-h-full">
              {terminalOutput.map((commnand, idx) => (
                <div className="text-white" key={idx}>
                  {terminalOutput[idx]}
                </div>
                ))}
            </div>
            <div className="flex">
              <span className="text-white pr-2">$</span>
              <input type="text"
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCommand(inputCommand);
                    setInputCommand("");
                  }
                }}
                className="w-full bg-transparent text-white border-none focus:outline-none"
              />
            </div>
          </div>
        </div>
      );
}

export default TerminalGCS;
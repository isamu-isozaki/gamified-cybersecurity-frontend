import React, { useState } from "react";
import PropTypes from 'prop-types';
import { sendCommand } from '../../app/store/command';
import { connect } from 'react-redux';
import '../../global.css';

function TerminalGCS({
    commands,
    terminalOutputs,
    sendCommand
}) {
    const [inputCommand, setInputCommand] = useState("");

    const handleCommand = async (terminalInput) => {
        sendCommand(terminalInput);
        console.log(terminalInput);
      }

      return (
        <div>
          <h1>Terminal</h1>
          <div className="w-1/2 bg-black h-96">
            <div className="overflow-y-auto max-h-full">
              {commands.map((commnand, idx) => (
                <div className="text-white" key={idx}>
                  {terminalOutputs[idx]}
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

TerminalGCS.propTypes = {
  commands: PropTypes.array,
  terminalOutputs: PropTypes.array,
  sendCommand: PropTypes.func,
}

const mapStateToProps = (state) => {
  return {commands: state.command.commands, terminalOutputs: state.command.terminalOutputs}
}
export default connect(
  mapStateToProps,
  {
    sendCommand
  },
)(TerminalGCS);
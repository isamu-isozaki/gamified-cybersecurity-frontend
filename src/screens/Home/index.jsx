//Based on https://github.com/mmazzarolo/react-native-login-animation-example
import React, { useState } from "react";

import { sendCommand } from '../../app/store/command';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TerminalGCS from "../../components/TerminalGCS";

function Home({
  commands,
  terminalOutputs,
  sendCommand, 
  socket
}){
  const [inputCommand, setInputCommand] = useState("");
  console.log(inputCommand)
  return (
    <div className="home">
       <TerminalGCS socket={socket} />
    </div>
  );
}

Home.propTypes = {
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
)(Home);
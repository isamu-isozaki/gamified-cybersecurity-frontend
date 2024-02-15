//Based on https://github.com/mmazzarolo/react-native-login-animation-example
import React, { useState } from "react";

import { sendCommand } from '../../app/store/command';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
        <h1>Home?</h1>
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
//Based on https://github.com/mmazzarolo/react-native-login-animation-example
import React, { useState } from "react";

import { sendCommand } from '../../store/command';
import { connect } from 'react-redux';
import { Flex, Spacer, Divider, Input, Button  } from "@chakra-ui/react";
import PropTypes from 'prop-types';
function Home({
  commands,
  terminalOutputs,
  sendCommand
}){
  const [inputCommand, setInputCommand] = useState("");
  console.log(inputCommand)
  return (
    <Flex direction='column' justify='center' align='center' height='100%'>
      <Spacer />
      <h2>{"Welcome to Gamified Cyber Security!"}</h2>
      <Input onChange={(e)=>setInputCommand(e.target.value)} value={inputCommand} />
      <Button onClick={()=>{
        console.log("sending command")
        console.log(inputCommand)
        sendCommand(inputCommand)
        setInputCommand("")
      }}>Send Command</Button>
      {commands.map((command, idx) => (
        <Flex direction='column' justify='center' align='center' height='100%' key={idx}>
          <div>command: {command}</div>
          <div>{terminalOutputs[idx]}</div>
          <Divider />
        </Flex>
      ))}
      <Spacer />
    </Flex>
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
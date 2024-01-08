import './console.css';
import {TerminalContainer} from '../../components/DevinTerminal';

import React, { useState } from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {sendCommand} from "../../store/command";

import sw1EyeImage from '../../assets/sw1_eye.png';
import sw2EyeImage from '../../assets/sw2_eye.png';

function Console({
                     commands,
                     terminalOutputs,
                     sendCommand
                 }) {
    const [chatButtonImage, setChatButtonImage] = useState(sw2EyeImage)
    const [chatWidth, setChatWidth] = useState('30%');
    const [terminalWidth, setTerminalWidth] = useState('70%');

    const toggleChatWidth = () => {
        if (chatWidth === '0%') {
            setChatWidth('30%');
            setTerminalWidth('70%');
            setChatButtonImage(sw2EyeImage)
        } else {
            setChatWidth('0%');
            setTerminalWidth('100%');
            setChatButtonImage(sw1EyeImage)
        }
    };

    return (
        <>
            <div className="Console">
                <TitleBar />
                <div className="ContainerContainer">
                    <ChatContainer chatWidth={chatWidth}/>
                    <TerminalContainer terminalWidth={terminalWidth} chatButtonImage={chatButtonImage} toggleChatWidth={toggleChatWidth}/>
                </div>
            </div>
        </>
    );
}

function TitleBar() {
    return (
        <div className="TitleBar">
            <h3> Title bar for ... reasons </h3>
        </div>
    );
}

function ChatContainer({chatWidth}) {

    return (
        <div className="ChatContainer" style={{ width: chatWidth}}>
            HELLO, IT ME
        </div>
    );
}

Console.propTypes = {
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
)(Console);
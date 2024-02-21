import React, {useRef, useState} from "react";
import PropTypes from 'prop-types';
import { sendCommand } from '../../store/command.js';
import { connect } from 'react-redux';
import '../../../global.css';
import './terminalGCS.css';
import {ulid} from "ulidx";

//find better solution?
import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "@/components/chat/message";

function TerminalGCS({
                         commands,
                         terminalOutputs,
                         sendCommand
                     }) {
    const [inputCommand, setInputCommand] = useState("");
    const [messages, setMessages] = useState([]);
    const [scrollAreaHeight, setScrollAreaHeight] = useState(500);
    const TerminalChatRef = useRef();

    const scrollToBottom = () => {
        TerminalChatRef.current.scrollTop = TerminalChatRef.current.scrollHeight;
    }

    const handleCommand = async (terminalInput) => {
        sendCommand(terminalInput);
        console.log(terminalInput);

        setMessages((curr) => [...curr, {
            id: ulid(),
            content: `$ ${terminalInput}`,
            type: 'USER'
        }]);

        scrollToBottom();
    }

    return (
        <div className="TerminalGCS bg-black h-full w-full flex-col">
            <div className="TerminalChat" ref={TerminalChatRef}>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message.content}</li>
                    ))}
                </ul>
            </div>
            <div className="InputBox">
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
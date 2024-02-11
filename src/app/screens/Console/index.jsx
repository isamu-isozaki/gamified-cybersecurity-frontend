import './console.css';
import ChatWindow from "../../components/chat/chatwindow";
import {TerminalContainer} from '../../components/DevinTerminal';

import React, { useState } from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {sendCommand} from "../../store/command";

import sw1EyeImage from '../../assets/sw1_eye.png';
import sw2EyeImage from '../../assets/sw2_eye.png';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Flag, Network, Settings, SendHorizonal } from "lucide-react";
import { socket } from '../../../App';

function Console({ socket }) {
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
                    <TerminalContainer terminalWidth={terminalWidth} chatButtonImage={chatButtonImage} toggleChatWidth={toggleChatWidth} socket={socket}/>
                </div>
            </div>
        </>
    );
}

function FlagInput({onSubmit}) {
    const [input, setInput] = useState("");
    
    function handleChange(e) {
        setInput(e.target.value);
    }

    function handleSubmit() {
        onSubmit(input);
        setInput("");
    }

    return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
                <Flag />
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <div className="flex w-full max-w-sm items-center space-x-2 space-x-reverse">
                <Button onClick={handleSubmit} variant="ghost" size="icon">
                    <SendHorizonal />
                </Button>
                <Input value={input} onInput={handleChange} />
            </div>
        </PopoverContent>
    </Popover>
    )
}

function TitleBar() {
    const [stage, setStage] = useState(0);
    const stages = [
        "egg",
        "critter" 
    ];

    function toggleFlagInput() {
        setFlagInputVisible((flagInputVisible) => !flagInputVisible);
    }

    function sendFlag(input) {
        if (input.trim() === stages[stage])
        {
            setStage((stage) => stage + 1);
        }        
    }

    return (
        <div className="TitleBar flex flex-row items-center">
            <div className="basis-1/4"><Progress value={(stage / Object.keys(stages).length) * 100}/></div>
            <div className="basis-1/2"><h3> Title bar for ... reasons </h3></div>
            <div className="basis-1/4 flex flex-row-reverse">
                <Button variant="ghost" size="icon">
                    <Settings />
                </Button>
                <Button variant="ghost" size="icon">
                    <Network />
                </Button>
                <FlagInput onSubmit={sendFlag} />
            </div>
        </div>
    );
}

function ChatContainer({chatWidth}) {

    return (
        <div className="ChatContainer" style={{ width: chatWidth}}>
            <ChatWindow socket={ socket }/>
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
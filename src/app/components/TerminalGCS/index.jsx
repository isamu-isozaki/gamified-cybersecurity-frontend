import React, {useRef, useState, useEffect} from "react";
import '../../../global.css';
import './terminalGCS.css';
import {ulid} from "ulidx";

//find better solution?
import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "@/components/chat/message";

function TerminalGCS({socket}) {
    const [inputCommand, setInputCommand] = useState("");
    const [messages, setMessages] = useState([]);
    const [scrollAreaHeight, setScrollAreaHeight] = useState(500);
    const TerminalChatRef = useRef();

    const scrollToBottom = () => {
        TerminalChatRef.current.scrollTop = TerminalChatRef.current.scrollHeight;
    }
    const [terminalOutput, setTerminalOutput] = useState([]);

    const handleCommand = async (terminalInput) => {
        socket.emit('command', terminalInput);

        setMessages((curr) => [...curr, {
            id: ulid(),
            content: `$ ${terminalInput}`,
            type: 'USER'
        }]);

        scrollToBottom();
    }

    useEffect(() => {
        const handleCommandOutput = (result) => {
            console.log(result);
            setTerminalOutput(terminalOutput.concat(result));
            setMessages((curr) => [...curr, {
                id: ulid(),
                content: `> ${result}`,
                type: 'USER'
            }]);
            console.log(terminalOutput);
        }
        socket.on('commandResult', handleCommandOutput);

        return () => socket.off('commandResult', handleCommandOutput);
    }, [socket]);

    return (
        <div className="TerminalGCS">
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

export default TerminalGCS;
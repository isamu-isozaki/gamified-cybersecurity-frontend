import React, { useState, useEffect } from "react";
import '../../../global.css';
import './terminalGCS.css';

function TerminalGCS({socket}) {
    const [inputCommand, setInputCommand] = useState("");
    const [terminalOutput, setTerminalOutput] = useState([]);

    const handleCommand = async (terminalInput) => {
        socket.emit('command', terminalInput);
    }

    useEffect(() => {
        const handleCommandOutput = (result) => {
            console.log(result);
            setTerminalOutput(terminalOutput.concat(result));
            console.log(terminalOutput);
        }
        socket.on('commandResult', handleCommandOutput);

        return () => socket.off('commandResult', handleCommandOutput);
    }, [socket]);

    return (
        <div className="TerminalGCS">
            <div className="w-1/2 bg-black h-full w-full">
                <div className="overflow-y-auto max-h-full w-full">
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
import './devinTerminal.css';

function TerminalContainer({terminalWidth, toggleChatWidth}) {
    return (
        <div className="TerminalContainer" style={{width: terminalWidth}}>
            <TerminalSelector toggleChatWidth={toggleChatWidth}/>
            <h2> suck -f sponge </h2>
        </div>
    );
}

function TerminalSelector({toggleChatWidth}) {
    return (
        <div className="TerminalSelector">
            <div className="ChatToggleButton" onClick={toggleChatWidth}>

            </div>
            <h2> CPU1 , CPU2, :) </h2>
        </div>
    );
}

export {TerminalContainer, TerminalSelector};
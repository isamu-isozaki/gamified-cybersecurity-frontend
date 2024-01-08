import './devinTerminal.css';
import TerminalGCS from "../TerminalGCS";

function TerminalContainer({terminalWidth, chatButtonImage, toggleChatWidth}) {
    return (
        <div className="TerminalContainer" style={{width: terminalWidth}}>
            <TerminalSelector chatButtonImage={chatButtonImage} toggleChatWidth={toggleChatWidth}/>
            <TerminalGCS />
        </div>
    );
}

function TerminalSelector({chatButtonImage, toggleChatWidth}) {
    return (
        <div className="TerminalSelector">
            <ChatToggleButton chatButtonImage={chatButtonImage} toggleChatWidth={toggleChatWidth}/>
            <TerminalButton name="CPU 1" />
            <TerminalButton name="CPU 2" />
        </div>
    );
}

function ChatToggleButton({chatButtonImage, toggleChatWidth}) {
    return (
        <div className="ChatToggleButton" onClick={toggleChatWidth}>
            <img src={chatButtonImage} alt="button to hide chat" style={{width: '30px', height: '30px'}}/>
        </div>
    );
}

function TerminalButton({name}) {
    return(
        <div className="TerminalButton">
            <h1>{name}</h1>
        </div>
    );
}

export {TerminalContainer, TerminalSelector};
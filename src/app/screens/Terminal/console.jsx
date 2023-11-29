function ConsoleContainer({consoleWidth, toggleChatWidth}) {
    return (
        <div className="ConsoleContainer" style={{width: consoleWidth}}>
            <ConsoleSelector toggleChatWidth={toggleChatWidth}/>
            <h2> suck -f sponge </h2>
        </div>
    );
}

function ConsoleSelector({toggleChatWidth}) {
    return (
        <div className="ConsoleSelector">
            <div className="ChatToggleButton" onClick={toggleChatWidth}>
                <img src="Logo192.png" style={{ width: '30px', height: '30px' }} />
            </div>
            <h2> CPU1 , CPU2, :) </h2>
        </div>
    );
}
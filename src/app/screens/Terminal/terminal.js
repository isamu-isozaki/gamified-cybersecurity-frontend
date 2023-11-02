function Terminal() {
    const [chatWidth, setChatWidth] = React.useState('30%');
    const [consoleWidth, setConsoleWidth] = React.useState('70%');

    const toggleChatWidth = () => {
        if (chatWidth === '0%') {
            setChatWidth('30%');
            setConsoleWidth('70%')
        } else {
            setChatWidth('0%');
            setConsoleWidth('100%')
        }
    };

    return (
        <>
            <div className="Terminal">
                <TitleBar />
                <div className="ContainerContainer">
                    <ChatContainer chatWidth={chatWidth} />
                    <ConsoleContainer consoleWidth={consoleWidth} toggleChatWidth={toggleChatWidth}/>
                </div>
            </div>
        </>
    );
}

function TitleBar() {
    return (
        <div className="TitleBar">
            <h3> woah, that *is* smelly...</h3>
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
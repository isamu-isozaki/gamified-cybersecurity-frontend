import ConsoleContainer from './console.jsx';

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
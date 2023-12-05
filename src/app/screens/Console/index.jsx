import './console.css';
import {TerminalContainer} from '../../components/DevinTerminal';

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {sendCommand} from "../../store/command";

function Console() {
    const [chatWidth, setChatWidth] = React.useState('30%');
    const [terminalWidth, setTerminalWidth] = React.useState('70%');

    const toggleChatWidth = () => {
        if (chatWidth === '0%') {
            setChatWidth('30%');
            setTerminalWidth('70%')
        } else {
            setChatWidth('0%');
            setTerminalWidth('100%')
        }
    };

    return (
        <>
            <div className="Console">
                <TitleBar />
                <div className="ContainerContainer">
                    <ChatContainer chatWidth={chatWidth} />
                    <TerminalContainer terminalWidth={terminalWidth} toggleChatWidth={toggleChatWidth}/>
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

const mapStateToProps = (state) => {
    return {commands: state.command.commands, terminalOutputs: state.command.terminalOutputs}
}

export default connect(
    mapStateToProps,
    {
        sendCommand
    },)(Console);
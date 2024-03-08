import { useEffect, useMemo, useRef, useState } from 'react';

import { useSocket } from '@/contexts/socketContext';
import { cn } from '@/lib/utils';
import { strip } from 'ansicolor';
import PropTypes from 'prop-types';
import { ScrollArea } from './ui/scroll-area';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useSelection } from '@/lib/useSelection';
import { useCopyToClipboard } from 'usehooks-ts';

export const Terminal = ({ id, hidden, sendChatInput }) => {
  const socket = useSocket();
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [previousCommands, setPreviousCommands] = useState([]);
  const [selectedPreviousCommandOffset, setSelectedPreviousCommandOffset] =
    useState(0);
  const [storedCommand, setStoredCommand] = useState(null);
  const [command, setCommand] = useState('');
  const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
  const [_, copy] = useCopyToClipboard();
  const scrollContainerRef = useRef();
  const terminalInputRef = useRef(null);
  const pendingCommandsRef = useRef([]);
  const { isTextSelected, getSelectedText } = useSelection(scrollContainerRef);

  const handleCommand = async (cmd, store = true) => {
    pendingCommandsRef.current.push(cmd.trim());
    socket.emit(`sshCommand:${id}`, cmd);

    if (store) {
      setPreviousCommands((curr) => [...curr, cmd.trim()]);
    }
    setSelectedPreviousCommandOffset(0);
    setStoredCommand(null);
    setCommand('');
  };

  const handleInput = (event) => {
    setCommand(event.target.value);
  };

  const handleEnter = (event) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case 'c':
          return handleCommand('\x03', false);
        case 'd':
          return handleCommand('exit', false);
        case 'z':
          return handleCommand('\x1A', false);
        default:
          return;
      }
    } else if (event.key === 'Enter') {
      return handleCommand(event.target.value);
    } else if (event.key === 'ArrowUp') {
      if (
        previousCommands.length > 0 &&
        selectedPreviousCommandOffset + 1 <= previousCommands.length
      ) {
        if (selectedPreviousCommandOffset === 0) {
          setStoredCommand(command);
        }
        const nextOffset = selectedPreviousCommandOffset + 1;
        const nextCommand =
          previousCommands[previousCommands.length - nextOffset];
        setSelectedPreviousCommandOffset(nextOffset);
        setCommand(nextCommand);
        moveCursorToEnd();
      }
    } else if (event.key === 'ArrowDown') {
      if (selectedPreviousCommandOffset > 0) {
        let nextOffset = selectedPreviousCommandOffset - 1;
        setSelectedPreviousCommandOffset(nextOffset);
        let nextCommand;
        if (nextOffset === 0) {
          nextCommand = storedCommand;
          setCommand(nextCommand);
          setStoredCommand(null);
        } else {
          nextCommand = previousCommands[previousCommands.length - nextOffset];
          setCommand(nextCommand);
        }
        moveCursorToEnd();
      }
    }
  };

  const moveCursorToEnd = () => {
    setTimeout(() => {
      if (terminalInputRef.current) {
        terminalInputRef.current.selectionStart =
          terminalInputRef.current.selectionEnd =
            terminalInputRef.current?.value.length || 0;
      }
    }, 0);
  };

  const focusInput = () => {
    if (
      !window.getSelection ||
      window.getSelection().toString().trim() === ''
    ) {
      terminalInputRef?.current?.focus();
    }
  };

  const handleDisconnect = (message) =>
    setTerminalOutput((curr) =>
      curr.concat({
        type: 'error',
        content: message,
      })
    );

  const handleCommandOutput = (result) => {
    result = strip(result).replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g,
      ''
    );
    setTerminalOutput((curr) => {
      if (
        curr.length > 0 &&
        pendingCommandsRef.current.length > 0 &&
        pendingCommandsRef.current[0] === result.trim()
      ) {
        pendingCommandsRef.current.shift();
        const last = curr.pop(curr.length - 1);

        return curr.concat({
          type: 'output',
          content: `${last.content} ${result}`,
        });
      }

      return [...curr, { type: 'output', content: result }];
    });
  };

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      setScrollAreaHeight(scrollContainerRef.current?.clientHeight || 0);
    });
    resizeObserver.observe(scrollContainerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    socket.on(`sshOutput:${id}`, handleCommandOutput);
    socket.on(`sshDisconnected:${id}`, handleDisconnect);

    return () => {
      socket.off(`sshOutput:${id}`, handleCommandOutput);
      socket.off(`sshDisconnected:${id}`, handleDisconnect);
    };
  }, [socket]);

  const inputComponent = useMemo(
    () => (
      <input
        ref={terminalInputRef}
        autoFocus
        value={command}
        onChange={handleInput}
        onKeyDown={handleEnter}
        className={
          '!bg-transparent !border-none text-white outline-none flex-1'
        }
      />
    ),
    [command, handleInput, handleEnter]
  );

  const handleCopySelectedText = () => copy(getSelectedText());

  const handleSendChatInput = () => {
    sendChatInput(getSelectedText());
  };

  return hidden ? null : (
    <ContextMenu key={id}>
      <ContextMenuTrigger
        disabled={!isTextSelected}
        className={cn(
          'w-full flex-1 flex flex-col',
          hidden && 'w-0 h-0 hidden'
        )}
      >
        <div
          ref={scrollContainerRef}
          className="w-full flex-1 bg-neutral-950 cursor-text"
          onClick={focusInput}
        >
          <ScrollArea
            className="w-full"
            style={{
              height: `${scrollAreaHeight}px`,
            }}
          >
            <div className="w-full p-3 text-lg text-wrap break-all flex flex-col">
              {terminalOutput.map((output, i) => (
                <div key={i} className="flex align-baseline">
                  <span
                    className={cn(
                      'text-white whitespace-pre-line',
                      output.type === 'error' && 'text-destructive'
                    )}
                  >
                    {output.content}
                  </span>
                  {i === terminalOutput.length - 1 && (
                    <>
                      <span>&nbsp;</span>
                      {inputComponent}
                    </>
                  )}
                </div>
              ))}
              {terminalOutput?.length <= 0 && inputComponent}
            </div>
          </ScrollArea>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleCopySelectedText}>Copy</ContextMenuItem>
        <ContextMenuItem onClick={handleSendChatInput}>
          Copy to Chat
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

Terminal.propTypes = {
  id: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  sendChatInput: PropTypes.func.isRequired,
};

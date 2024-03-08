import { useEffect, useRef, useState } from 'react';

import { Loader } from '@/components/loaders/loader';
import { Terminal } from '@/components/terminal';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useSocket } from '@/contexts/socketContext';
import { TerminalButton } from '@/screens/lab/components/terminalButton';
import { PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';

export const Console = ({ isChatOpen, toggleChat, sendChatInput }) => {
  const socket = useSocket();
  const [terminals, setTerminals] = useState([]);
  const [isAddingTerminal, setIsAddingTerminal] = useState(true);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [scrollAreaWidth, setScrollAreaWidth] = useState(0);
  const scrollContainerRef = useRef();

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      setScrollAreaWidth(scrollContainerRef.current?.clientWidth || 0);
    });
    resizeObserver.observe(scrollContainerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    handleAddTerminal();

    return () => {
      socket.off('sshConnected');
      socket.off('sshFailed');
    };
  }, []);

  const handleAddTerminal = async () => {
    setIsAddingTerminal(true);
    try {
      const id = await handleConnectSsh();

      setTerminals((curr) => [...curr, id]);
      setSelectedTerminal(id);
    } catch (e) {
      toast.error(e);
    }
    setIsAddingTerminal(false);
  };

  const handleCloseTerminal = (id) => {
    if (selectedTerminal === id) {
      const terminalIndex = terminals.indexOf(id);

      if (terminalIndex > 0) {
        setSelectedTerminal(terminals[terminalIndex - 1]);
      } else {
        setSelectedTerminal(terminals[0]);
      }
    }

    setTerminals((curr) => curr.filter((t) => t !== id));
  };

  const handleConnectSsh = () => {
    return new Promise((res, rej) => {
      socket.emit('requestSsh');

      socket.on('sshConnected', (id) => {
        socket.off('sshConnected');
        socket.off('sshFailed');
        res(id);
      });

      socket.on('sshFailed', (message) => {
        socket.off('sshConnected');
        socket.off('sshFailed');
        rej(message);
      });
    });
  };

  return (
    <div className="h-full max-h-full flex flex-1 flex-col">
      <div className="w-full p-3 flex gap-3 items-center bg-neutral-900 color-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleChat}
          alt={`${isChatOpen ? 'Close' : 'Open'} chat`}
        >
          {isChatOpen ? (
            <PanelLeftClose className="h-6 w-6" />
          ) : (
            <PanelLeftOpen className="h-6 w-6" />
          )}
        </Button>
        <div ref={scrollContainerRef} className="flex-1 overflow-hidden">
          <ScrollArea
            type="auto"
            className="whitespace-nowrap"
            style={{
              width: `${scrollAreaWidth}px`,
            }}
          >
            <div className="w-max flex flex-row flex-nowrap py-3 gap-3">
              {terminals.map((id, i) => (
                <TerminalButton
                  key={id}
                  id={id}
                  isSelected={selectedTerminal === id}
                  index={i}
                  onSelect={setSelectedTerminal}
                  onClose={handleCloseTerminal}
                  canClose={terminals.length > 1}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleAddTerminal}
          disabled={isAddingTerminal}
        >
          {isAddingTerminal ? <Loader /> : <Plus />}
        </Button>
      </div>
      <div className="flex flex-1">
        {terminals.map((id) => (
          <Terminal
            key={id}
            id={id}
            hidden={selectedTerminal !== id}
            sendChatInput={sendChatInput}
          />
        ))}
      </div>
    </div>
  );
};

Console.propTypes = {
  isChatOpen: PropTypes.bool.isRequired,
  toggleChat: PropTypes.func.isRequired,
  sendChatInput: PropTypes.func.isRequired,
};

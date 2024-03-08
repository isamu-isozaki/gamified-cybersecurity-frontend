import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { Message } from './message';
import { ulid } from 'ulidx';
import { useSocket } from '@/contexts/socketContext';
import PropTypes from 'prop-types';

const MAX_CHARACTERS = 300;

// eslint-disable-next-line no-unused-vars
const THE_SIZE_OF_MY_PEANITS = 1.4;

export const ChatWindow = ({ extraChatInput, setExtraChatInput }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
  const scrollContainerRef = useRef();

  useEffect(() => {
    if (extraChatInput.trim() !== '') {
      setInput((curr) => curr + extraChatInput);
      setExtraChatInput('');
    }
  }, [extraChatInput]);

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

  const handleSubmit = () => {
    if (input.trim() === '') return;

    setMessages((curr) => [
      ...curr,
      {
        id: ulid(),
        content: input,
        type: 'USER',
      },
    ]);
    setInput('');

    socket.emit('chatMessage', input);
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessages((curr) => [
        ...curr,
        {
          id: ulid(),
          content: data,
          type: 'GPT',
        },
      ]);
    };
    socket.on('chatResponse', receiveMessageHandler);

    return () => socket.off('messageResponse', receiveMessageHandler);
  }, [socket]);

  const handleChange = (e) => {
    if (e.target.value.trim().length > MAX_CHARACTERS) return;

    setInput(e.target.value);
  };

  const handleEnterPressed = (e) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col pb-3 gap-3 h-full max-h-full">
      <div
        ref={scrollContainerRef}
        className="flex-1 self-end overflow-hidden w-full"
      >
        <ScrollArea
          style={{
            height: `${scrollAreaHeight}px`,
          }}
          className="px-3"
        >
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}
        </ScrollArea>
      </div>
      <div className="flex flex-row gap-3 px-3">
        <Textarea
          value={input}
          onInput={handleChange}
          onKeyDown={handleEnterPressed}
          className="bg-neutral-400 border-none focus:!border-none"
        ></Textarea>
        <div className="flex flex-col justify-between">
          <Button
            onClick={handleSubmit}
            disabled={input.trim() === ''}
            size="icon"
            variant="accented"
          >
            <SendHorizontal />
          </Button>
          <span
            className={cn(
              'text-right text-neutral-200 text-sm',
              input.trim().length === MAX_CHARACTERS ? 'text-destructive' : ''
            )}
          >
            {input.trim().length}/{MAX_CHARACTERS}
          </span>
        </div>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  extraChatInput: PropTypes.string,
  setExtraChatInput: PropTypes.func,
};

import { ChatWindow } from '@/components/chat/chatWindow';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Console } from '@/screens/lab/sections/console';
import { useRef, useState } from 'react';

export const Content = () => {
  const [extraChatInput, setExtraChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const chatPanelRef = useRef(null);

  const handleSetChatOpen = () => setIsChatOpen(true);

  const handleSetChatClosed = () => setIsChatOpen(false);

  const toggleChat = () => {
    if (chatPanelRef.current) {
      if (chatPanelRef.current.isCollapsed()) {
        chatPanelRef.current.expand();
      } else {
        chatPanelRef.current.collapse();
      }
    }
  };

  const sendChatInput = (input) => {
    setExtraChatInput(input);
  };

  return (
    <div className="flex flex-1 w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          onCollapse={handleSetChatClosed}
          onExpand={handleSetChatOpen}
          ref={chatPanelRef}
          collapsible
          collapsedSize={0}
          defaultSize={25}
          minSize={25}
          className={'h-full overflow-hidden'}
        >
          <div className={'flex h-full w-full'}>
            <div className="flex flex-col flex-1 bg-neutral-800">
              <ChatWindow
                extraChatInput={extraChatInput}
                setExtraChatInput={setExtraChatInput}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={25}>
          <Console
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
            sendChatInput={sendChatInput}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

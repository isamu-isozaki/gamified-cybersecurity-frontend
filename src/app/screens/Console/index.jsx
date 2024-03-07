import React, { useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Loader2, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { getBackendUrl } from "@/lib/utils";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import Terminal from "@/components/terminal";
import ChatWindow from "@/components/chat/chatwindow";
import TitleBar from "./components/titleBar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ulid } from "ulidx";

const URL = getBackendUrl("/");

const socket = io(URL);

function ConsoleContainer({ isChatOpen, toggleChat }) {
  const [terminals, setTerminals] = useState([{
    id: ulid(),
    name: "TRM 1"
  }]);
  const [selectedTerminal, setSelectedTerminal] = useState(0);
  const [scrollAreaWidth, setScrollAreaWidth] = useState(0);
  const scrollContainerRef = useRef();

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      setScrollAreaWidth(scrollContainerRef.current.clientWidth);
    });
    resizeObserver.observe(scrollContainerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const handleAddTerminal = () => {
    setTerminals(curr => curr.concat({
      id: ulid(),
      name: `TRM ${curr.length + 1}`
    }));
  }

  return <div className="h-full max-h-full flex flex-1 flex-col">
          <div className="w-full p-3 flex gap-3 items-start bg-neutral-900 color-white">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              alt={`${isChatOpen ? "Close" : "Open"} chat`}
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
                }}>
                <div className="w-max flex flex-row flex-nowrap pb-3">
                  {terminals.map(({ id, name }) => (
                    <Button
                      key={id}
                      variant="ghost"
                      className="font-bold"
                      title={`Switch to ${name}`}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <Button size="icon" variant="ghost" onClick={handleAddTerminal}>
              <Plus />
            </Button>
          </div>
          <div className="flex flex-1">
            <Terminal socket={socket} />
          </div>
        </div>
}

function ContentContainer() {
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
          className={"h-full overflow-hidden"}
        >
          <div className={"flex h-full w-full"}>
            <div className="flex flex-col flex-1 bg-neutral-800">
              <ChatWindow socket={socket} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={25}>
          <ConsoleContainer isChatOpen={isChatOpen} toggleChat={toggleChat} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function Console() {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);

  useEffect(() => {
    setLab(null);

    fetch(getBackendUrl(`/v1/labs/${labId}/start`), { method: "POST" })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(await response.json());
        }
      })
      .then((lab) => {
        setLab(lab.lab);
      })
      .catch((error) => {
        toast.error(error?.message?.message || "Lab not found");
        navigate("/");
      });

    return () => {
      fetch(getBackendUrl(`/v1/labs/${labId}/stop`), { method: "POST" });
    };
  }, []);

  if (!lab) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-neutral-800">
        <Loader2 className="animate-spin h-14 w-14 text-accent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full h-full max-h-full">
      <TitleBar
        name={lab.name}
        flags={lab.flags}
        initialCompletedFlags={lab.completedFlags}
      />
      <ContentContainer />
    </div>
  );
}

Console.propTypes = {};

export default Console;

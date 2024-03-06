import React, { useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Loader2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { getBackendUrl } from "@/lib/utils";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import Terminal from "@/components/terminal";
import ChatWindow from "@/components/chat/chatwindow";
import TitleBar from "./components/titleBar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const URL = getBackendUrl("/");

const socket = io(URL);

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
        <ResizablePanel>
          <div className="h-full max-h-full flex flex-1 flex-col">
            <div className="w-full p-3 flex gap-3 items-center bg-neutral-900 color-white">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="text-white"
                alt={`${isChatOpen ? "Close" : "Open"} chat`}
              >
                {isChatOpen ? (
                  <PanelLeftClose className="h-6 w-6" />
                ) : (
                  <PanelLeftOpen className="h-6 w-6" />
                )}
              </Button>
              {["TRM 1", "TRM 2", "TRM 3"].map((name) => (
                <Button
                  variant="ghost"
                  className="text-white font-bold"
                  alt={`Switch to ${name}`}
                >
                  {name}
                </Button>
              ))}
            </div>
            <div className="flex flex-1">
              <Terminal socket={socket} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function Console() {
  const { labid } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);

  useEffect(() => {
    setLab(null);

    fetch(getBackendUrl(`/v1/labs/${labid}/start`), { method: "POST" })
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
        console.error(error);
        navigate("/");
      });

    return () => {
      fetch(getBackendUrl(`/v1/labs/${labid}/stop`), { method: "POST" });
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

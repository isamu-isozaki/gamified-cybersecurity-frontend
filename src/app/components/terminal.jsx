import React, { useEffect, useRef, useState } from "react";

import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { strip } from "ansicolor";

function Terminal({ socket }) {
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [command, setCommand] = useState("");
  const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
  const scrollContainerRef = useRef();
  const terminalInputRef = useRef(null);

  const handleCommand = async (cmd) => {
    setTerminalOutput((curr) => {
      if (curr.length > 0) {
        const last = curr.pop(curr.length - 1);

        return curr
          .concat({
            type: "output",
            content: `${last.content} ${cmd}`,
          });
      }

      return [cmd];
    });
    socket.emit("command", cmd);

    setCommand("");
  };

  const handleInput = (event) => {
    setCommand(event.target.value);
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      return handleCommand(event.target.value);
    }
  };

  const focusInput = () => terminalInputRef?.current?.focus();

  const handleDisconnect = (message) =>
    setTerminalOutput((curr) =>
      curr.concat({
        type: "error",
        content: message,
      })
    );

  const handleCommandOutput = (result) => {
    console.log(result);
    setTerminalOutput((curr) =>
      curr.concat({
        type: "output",
        content: strip(result),
      })
    );
  };

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      setScrollAreaHeight(scrollContainerRef.current.clientHeight);
    });
    resizeObserver.observe(scrollContainerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    socket.on("commandOutput", handleCommandOutput);
    socket.on("sshDisconnect", handleDisconnect);

    return () => {
      socket.off("commandOutput", handleCommandOutput);
      socket.off("sshDisconnect", handleDisconnect);
    };
  }, [socket]);

  return (
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
            <div key={i} className="inline">
              <span className={cn("text-white whitespace-pre-line", output.type === 'error' && 'text-destructive')}>
                {output.content}
              </span>
              {i === terminalOutput.length - 1 && (
                <>
                  <span> </span>
                  <input
                    ref={terminalInputRef}
                    autoFocus
                    value={command}
                    onChange={handleInput}
                    onKeyDown={handleEnter}
                    className={
                      "!bg-transparent !border-none text-white outline-none flex-1"
                    }
                  />
                </>
              )}
            </div>
          ))}
          {terminalOutput?.length <= 0 && <input
                    ref={terminalInputRef}
                    autoFocus
                    value={command}
                    onChange={handleInput}
                    onKeyDown={handleEnter}
                    className={
                      "!bg-transparent !border-none text-white outline-none flex-1"
                    }
                  />}
        </div>
      </ScrollArea>
    </div>
  );
}

export default Terminal;

import React, { useEffect, useRef, useState } from "react";

import { ScrollArea } from "./ui/scroll-area";

function Terminal({ socket }) {
  const [terminalOutput, setTerminalOutput] = useState([
    {
      type: "output",
      content: "$",
    },
  ]);
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
          })
          .concat({
            type: "output",
            content: "",
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

  const handleCommandExit = () =>
    setTerminalOutput((curr) =>
      curr.concat({
        type: "output",
        content: "$",
      })
    );

  const handleCommandError = (error) => {};

  useEffect(() => {
    if (scrollContainerRef.current) {
      setScrollAreaHeight(scrollContainerRef.current.clientHeight);
    }
  }, [scrollContainerRef.current]);

  useEffect(() => {
    const handleCommandOutput = (result) => {
      console.log(result);
      setTerminalOutput((curr) =>
        curr.concat({
          type: "output",
          content: result,
        })
      );
    };
    socket.on("commandResult", handleCommandOutput);
    socket.on("commandError", handleCommandError);
    socket.on("commandExit", handleCommandExit);

    return () => socket.off("commandResult", handleCommandOutput);
  }, [socket]);

  return (
    <div
      ref={scrollContainerRef}
      className="w-full flex-1 bg-neutral-950 cursor-pointer"
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
              <span className="text-white whitespace-pre-line">
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
        </div>
      </ScrollArea>
    </div>
  );
}

export default Terminal;

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useRef } from "react";
import { useEffect } from "react";
import Message from "./message";
import { ulid } from "ulidx";

const MAX_CHARACTERS = 300;

const THE_SIZE_OF_MY_PEANITS = 1.4;

function ChatWindow({ socket }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
    const scrollContainerRef = useRef();

    useEffect(() => {
        if(scrollContainerRef.current) {
            setScrollAreaHeight(scrollContainerRef.current.clientHeight);
        }
    }, [scrollContainerRef.current]);

    const handleSubmit = () => {
        if (input.trim() === "")
            return;

        setMessages((curr) => [...curr, {
            id: ulid(),
            content: input,
            type: 'USER'
        }]);
        setInput("");

        // TODO send to ChatGPT
        socket.emit("newMessage", input);
    }

    useEffect(() => {
        const receiveMessageHandler = (data) => {
            setMessages((curr) => [...curr, {
                id: ulid(),
                content: data,
                type: 'GPT'
            }]);
        };
        socket.on("messageResponse", receiveMessageHandler);

        return () => socket.off("messageResponse", receiveMessageHandler);
    }, [socket]);

    const handleChange = (e) => {
        if (e.target.value.trim().length > MAX_CHARACTERS)
            return;

        setInput(e.target.value);
    }

    const handleEnterPressed = (e) => {
        if (e.code === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    }

    return <div className="flex flex-col px-3 pb-3 gap-3 h-full max-h-full overflow-hidden">
        <div ref={scrollContainerRef} className="flex-1 self-end overflow-hidden w-full">
            <ScrollArea style={{
                height: `${scrollAreaHeight}px`
            }}>
                    {messages.map((message) => <Message key={message.id} {...message} />)}
            </ScrollArea>
        </div>
        <div className="flex flex-row gap-3">
            <Textarea value={input} onInput={handleChange} onKeyDown={handleEnterPressed}>

            </Textarea>
            <div className="flex flex-col justify-between">
                <Button onClick={handleSubmit} disabled={input.trim() === ""} variant="outline" size="icon">
                    <SendHorizontal />
                </Button>
                <span className={cn("text-right", input.trim().length === MAX_CHARACTERS ? "text-destructive" : "")}>
                    {input.trim().length}/{MAX_CHARACTERS}
                </span>
            </div>
        </div>
    </div>
}

export default ChatWindow;
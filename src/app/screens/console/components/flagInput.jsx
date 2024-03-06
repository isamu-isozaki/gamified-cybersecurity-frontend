import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Flag, Loader2, SendHorizonal } from "lucide-react";
import { useRef, useState } from "react";

function FlagInput({ onSubmit, isSubmitting }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  function handleChange(e) {
    setInput(e.target.value);
  }

  async function handleSubmit() {
    const shouldClose = await onSubmit(input);
    if (shouldClose) {
      setInput("");
      setIsOpen(false);
    } else {
      inputRef?.current?.focus();
    }
  }

  function handleEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-accent hover:text-white"
        >
          <Flag />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="flex w-full items-center gap-3">
          <Input
            ref={inputRef}
            autoFocus
            value={input}
            onKeyDown={handleEnter}
            onInput={handleChange}
            className="bg-neutral-400 border-none"
            disabled={isSubmitting}
          />
          <Button
            onClick={handleSubmit}
            variant="accented"
            size="icon"
            className="min-w-10"
            disabled={isSubmitting || input.trim() === ""}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <SendHorizonal />
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default FlagInput;

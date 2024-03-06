import { Settings as SettingsIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Settings() {
  const navigate = useNavigate();

  function quitLab() {
    navigate("/");
  }

  function restartLab() {
    //TODO: backend call to restart lab
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-accent hover:text-white"
        >
          <SettingsIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="flex flex-col gap-y-4">
          <Button variant="accentedFilled" onClick={restartLab}>
            Restart Lab
          </Button>
          <Button variant="accentedFilled" onClick={quitLab}>
            Quit Lab
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Settings;

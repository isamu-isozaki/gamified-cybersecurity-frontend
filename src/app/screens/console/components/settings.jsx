import { Loader2, Settings as SettingsIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { getBackendUrl } from "@/lib/utils";

function Settings({ labId }) {
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  const quitLab = () => {
    navigate("/");
  }

  const resetLab = () => {
    console.log('resetting');
    setIsResetting(true);
    fetch(getBackendUrl(`/v1/labs/${labId}/reset`), { method: "POST" })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(await response.json());
        }
      })
      .then((res) => {
        toast.success(res.message);
        navigate(0);
      })
      .catch((error) => {
        toast.error(error?.message?.message || "Lab not found");
        navigate("/");
      }).finally(() => {
        console.log('done');
        setIsResetting(false);
      });
  }

  return (
    <Popover>
      <PopoverTrigger data-state={isResetting ? 'open' : undefined} asChild>
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
          <Button variant="accented" onClick={resetLab} disabled={isResetting}>
            {isResetting ? <Loader2 className="animate-spin h-6 w-6"/> : "Reset Lab"}
          </Button>
          <Button variant="accented" onClick={quitLab} disabled={isResetting}>
            Quit Lab
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Settings;

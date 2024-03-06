import { Progress } from "@/components/ui/progress";
import FlagInput from "./flagInput";
import MachineControl from "./machineControl";
import Settings from "./Settings";
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "sonner";
import { getBackendUrl } from "@/lib/utils";

function TitleBar({ flags, name, initialCompletedFlags }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedFlags, setCompletedFlags] = useState(initialCompletedFlags);

  function sendFlag(input) {
    return new Promise((res, rej) => {
      setIsSubmitting(true);
      fetch(getBackendUrl(`/v1/labs/${name}/submit`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flag: input }),
      })
        .then(async (response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(await response.json());
          }
        })
        .then((response) => {
          setCompletedFlags(response.completedFlags);
          toast.success("Correct!");
          res(true);
        })
        .catch((error) => {
          toast.error("Incorrect flag");
          console.error(JSON.stringify(error));
          res(false);
        })
        .finally(() => setIsSubmitting(false));
    });
  }

  return (
    <div className="w-full bg-neutral-950 flex flex-row items-center py-3 px-3">
      <div className="basis-1/4">
        <Progress value={(completedFlags / flags) * 100} />
      </div>
      <div className="basis-1/2">
        <h3 className="text-white text-center font-bold text-2xl">
          H.E.I.S.E.N.B.E.R.G.
        </h3>
      </div>
      <div className="basis-1/4 flex justify-end gap-3">
        <FlagInput isSubmitting={isSubmitting} onSubmit={sendFlag} />
        <MachineControl />
        <Settings />
      </div>
    </div>
  );
}

TitleBar.propTypes = {
  flags: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  initialCompletedFlags: PropTypes.number.isRequired,
};

export default TitleBar;

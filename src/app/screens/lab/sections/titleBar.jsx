import { Progress } from '@/components/ui/progress';
import { FlagInput } from '../components/flagInput';
import { MachineControl } from '../components/machineControl';
import { Settings } from '../components/settings';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getBackendUrl } from '@/lib/utils';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import PropTypes from 'prop-types';

export const TitleBar = ({ flags, name, initialCompletedFlags }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedFlags, setCompletedFlags] = useState(initialCompletedFlags);

  const sendFlag = (input) => {
    return new Promise((res) => {
      setIsSubmitting(true);
      fetch(getBackendUrl(`/v1/labs/${name}/submit`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          toast.success(response.message);
          res(true);
        })
        .catch((error) => {
          toast.error('Incorrect flag');
          console.error(JSON.stringify(error));
          res(false);
        })
        .finally(() => setIsSubmitting(false));
    });
  };

  const flagPercentage = useMemo(
    () => (completedFlags / flags) * 100,
    [completedFlags, flags]
  );

  return (
    <div className="w-full bg-neutral-950 flex flex-row items-center py-3 px-3">
      <div className="basis-1/4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Progress className="w-full" value={flagPercentage} />
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-bold text-lg">{Math.round(flagPercentage)}%</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex justify-center items-center basis-1/2">
        <Tooltip>
          <TooltipTrigger>
            <h3 className="text-white text-center font-bold text-2xl">
              H.E.I.S.E.N.B.E.R.G.
            </h3>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Hosted Education & Instruction System for Emulated Networks &
              Breach Exercises with Real-time Guidance
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="basis-1/4 flex justify-end gap-3">
        <FlagInput isSubmitting={isSubmitting} onSubmit={sendFlag} />
        <MachineControl />
        <Settings labId={name} />
      </div>
    </div>
  );
};

TitleBar.propTypes = {
  flags: PropTypes.number,
  name: PropTypes.string,
  initialCompletedFlags: PropTypes.number,
};

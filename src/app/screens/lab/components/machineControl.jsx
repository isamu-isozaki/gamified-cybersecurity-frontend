import { Loader } from '@/components/loaders/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getBackendUrl } from '@/lib/utils';
import { Network, Power, PowerOff, RotateCcw } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const MachineRowActionButton = ({ isLoading, children, title, ...props }) => {
  return (
    <Tooltip defaultOpen={false}>
      <TooltipTrigger asChild>
        <Button {...props}>{isLoading ? <Loader /> : children}</Button>
      </TooltipTrigger>
      <TooltipContent>{`${title} machine`}</TooltipContent>
    </Tooltip>
  );
};

MachineRowActionButton.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string,
};

const MachineRow = ({ updateMachine, id, name, state, disabled }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const handleStop = () => {
    setIsSubmitting(true);

    fetch(getBackendUrl(`/v1/docker/${id}/stop`), {
      method: 'POST',
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(await response.json());
        }
      })
      .then((response) => {
        toast.success(response.message);
        updateMachine(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleRestart = () => {
    setIsSubmitting(true);
    setIsRestarting(true);

    fetch(getBackendUrl(`/v1/docker/${id}/restart`), {
      method: 'POST',
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(await response.json());
        }
      })
      .then((response) => {
        toast.success(response.message);
        updateMachine(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsRestarting(false);
      });
  };

  const handleStart = () => {
    setIsSubmitting(true);

    fetch(getBackendUrl(`/v1/docker/${id}/start`), {
      method: 'POST',
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(await response.json());
        }
      })
      .then((response) => {
        toast.success(response.message);
        updateMachine(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const isRunning = useMemo(() => state === 'running', [state]);

  return (
    <TableRow className="text-neutral-100 hover:bg-transparent">
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{state}</TableCell>
      <TableCell className="flex items-center justify-center gap-3">
        {isRunning ? (
          <>
            <MachineRowActionButton
              variant={'accented'}
              size="icon"
              disabled={isSubmitting || disabled}
              isLoading={isSubmitting && isRestarting}
              onClick={handleRestart}
              title="Restart"
            >
              <RotateCcw />
            </MachineRowActionButton>
            <MachineRowActionButton
              variant={'destructive'}
              size="icon"
              disabled={isSubmitting || disabled}
              isLoading={isSubmitting && !isRestarting}
              onClick={handleStop}
              title="Stop"
            >
              <PowerOff />
            </MachineRowActionButton>
          </>
        ) : (
          <MachineRowActionButton
            variant={'accented'}
            size="icon"
            disabled={isSubmitting || disabled}
            isLoading={isSubmitting}
            onClick={handleStart}
            title="Start"
          >
            <Power />
          </MachineRowActionButton>
        )}
      </TableCell>
    </TableRow>
  );
};

MachineRow.propTypes = {
  updateMachine: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  state: PropTypes.string,
  disabled: PropTypes.bool,
};

export const MachineControl = () => {
  const [machines, setMachines] = useState([]);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getMachinesList = (skipLoading) => {
    if (!skipLoading) {
      setIsLoading(true);
    }
    fetch(getBackendUrl('/v1/docker'))
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(await response.json());
        }
      })
      .then((machineList) => {
        setMachines(machineList);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getMachinesList();
  }, []);

  const rebootMachines = () => {
    setIsRestarting(true);
    fetch(getBackendUrl('/v1/docker/restart'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: machines.map(({ id }) => id),
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(await response.json());
        }
      })
      .then((response) => {
        toast.success(response.message);
        setMachines(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsRestarting(false);
      });
  };

  const handleUpdateMachine = (machine) => {
    setMachines((curr) => curr.map((m) => (m.id === machine.id ? machine : m)));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={getMachinesList}
          className="text-accent hover:text-white"
        >
          <Network />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-neutral-300">Machine Status</DialogTitle>
        </DialogHeader>
        <div className="flex w-full justify-center">
          {isLoading ? (
            <Loader className="text-neutral-300 h-10 w-10" />
          ) : machines.length > 0 ? (
            <Table>
              <TableHeader className="border-neutral-400">
                <TableRow className="text-neutral-400 hover:bg-transparent">
                  <TableHead className="w-2/4 text-inherit">
                    Machine Name
                  </TableHead>
                  <TableHead className="w-1/4 text-inherit">Status</TableHead>
                  <TableHead className="w-1/4 text-inherit">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((machine) => (
                  <MachineRow
                    key={machine.id}
                    disabled={isRestarting}
                    updateMachine={handleUpdateMachine}
                    {...machine}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <h3 className="text-center text-lg text-neutral-400">
              No machines found
            </h3>
          )}
        </div>
        <div className="flex flex-row grow justify-center space-x-2">
          <Button
            variant="accented"
            className="w-1/3 min-w-fit"
            onClick={rebootMachines}
            disabled={isRestarting}
          >
            {isRestarting ? <Loader /> : 'Reboot Machines'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Network } from "lucide-react";
import { useEffect, useState } from "react";
import { getBackendUrl } from "@/lib/utils";

function MachineRow({ Image, State }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{Image}</TableCell>
      <TableCell>{State}</TableCell>
    </TableRow>
  );
}

function MachineControl() {
  const [machines, setMachines] = useState([]);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getMachinesList = () => {
    setIsLoading(true);
    fetch(getBackendUrl("/v1/command/dockerlist"))
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
    fetch(getBackendUrl("/v1/command/dockerrestart"), {
      method: "POST",
    }).finally(() => {
      getMachinesList();
      setIsRestarting(false);
    });
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
            <Loader2 className="animate-spin text-neutral-300 h-10 w-10" />
          ) : machines.length > 0 ? (
            <Table>
              <TableHeader className="border-neutral-400">
                <TableRow className="text-neutral-400 hover:bg-transparent">
                  <TableHead className="w-2/3 text-inherit">
                    Machine Name
                  </TableHead>
                  <TableHead className="w-1/3 text-inherit">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((machine) => (
                  <MachineRow {...machine} />
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
            variant="accentedFilled"
            className="w-1/3 min-w-fit"
            onClick={rebootMachines}
            disabled={isRestarting}
          >
            {isRestarting ? (
              <Loader2 className="text-accent animate-spin" />
            ) : (
              "Reboot Machines"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MachineControl;

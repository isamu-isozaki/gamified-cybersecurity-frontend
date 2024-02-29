import './console.css';
import ChatWindow from "../../components/chat/chatwindow";
import {TerminalContainer} from '../../components/DevinTerminal';
import MachineControlPanel from '../../components/MachineControlPanel/MachineControlPanel';

import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {sendCommand} from "../../store/command";

import sw1EyeImage from '../../assets/sw1_eye.png';
import sw2EyeImage from '../../assets/sw2_eye.png';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Flag, Network, Settings, SendHorizonal, Loader2 } from "lucide-react";
import { getBackendUrl } from '@/lib/utils';
import { io } from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';

const URL = getBackendUrl("/");

const socket = io(URL);

function Console() {
    const { labid } = useParams();
    const navigate = useNavigate();
    const [chatButtonImage, setChatButtonImage] = useState(sw2EyeImage)
    const [chatWidth, setChatWidth] = useState('30%');
    const [terminalWidth, setTerminalWidth] = useState('70%');
    const [lab, setLab] = useState(null);

    useEffect(() => {
        setLab(null);

        fetch(getBackendUrl(`/v1/labs/${labid}/start`), {method: "POST"}).then(async (response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(await response.json());
            }
        }).then((lab) => {
            setLab(lab.lab);
        }).catch((error) => {
            console.error(error);
            navigate('/');
        });

        return () => {
            fetch(getBackendUrl(`/v1/labs/${labid}/stop`), {method: "POST"});
        }
    }, [])

    const toggleChatWidth = () => {
        if (chatWidth === '0%') {
            setChatWidth('30%');
            setTerminalWidth('70%');
            setChatButtonImage(sw2EyeImage)
        } else {
            setChatWidth('0%');
            setTerminalWidth('100%');
            setChatButtonImage(sw1EyeImage)
        }
    };

    return (
        lab ? <div className="Console">
                <TitleBar name={lab.name} flags={lab.flags} initialCompletedFlags={lab.completedFlags} />
                <div className="ContainerContainer">
                    <ChatContainer chatWidth={chatWidth}/>
                    <TerminalContainer terminalWidth={terminalWidth} chatButtonImage={chatButtonImage} toggleChatWidth={toggleChatWidth} socket={socket}/>
                </div>
            </div> : <span>Loading...</span>
    );
}

function FlagInput({onSubmit, isSubmitting}) {
    const [input, setInput] = useState("");
    
    function handleChange(e) {
        setInput(e.target.value);
    }

    function handleSubmit() {
        onSubmit(input);
        setInput("");
    }

    return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
                <Flag />
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <div className="flex w-full max-w-sm items-center space-x-2 space-x-reverse">
                <Button onClick={handleSubmit} variant="ghost" size="icon">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <SendHorizonal />}
                </Button>
                <Input value={input} onInput={handleChange} />
            </div>
        </PopoverContent>
    </Popover>
    )
}

function MachineRow( { Image, State} )
{
    return (
        <TableRow>
            <TableCell className="font-medium">{Image}</TableCell>
            <TableCell>{State}</TableCell>
        </TableRow>
    )
}

function MachineControl() {
    const [machines, setMachines] = useState([]);
    const [isRestarting, setIsRestarting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getMachinesList = () => {
        setIsLoading(true);
        fetch (getBackendUrl("/v1/command/dockerlist")).then(async (response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(await response.json());
            }
        }).then((machineList) => {
            setMachines(machineList);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    useEffect(() => {
        getMachinesList();
    }, [])

    const rebootMachines = () => {
        setIsRestarting(true);
        fetch (getBackendUrl("/v1/command/dockerrestart"), {
            method: "POST"
        }).finally(() => {
            getMachinesList();
            setIsRestarting(false)
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={getMachinesList}>
                    <Network />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Machine Status</DialogTitle>
                </DialogHeader>
                {isLoading ? <span>Loading...</span> : 
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Machine Name</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {machines.map((machine) => <MachineRow {...machine} />)}
                    </TableBody>
                </Table>}
                <div className="flex flex-row grow justify-center space-x-2">
                    <Button className="basis-1" onClick={rebootMachines} disabled={isRestarting}>{isRestarting ? "Loading..." : "Reboot Machines"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function LabSettings({onSubmit}) {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    
    function handleChange(e) {
        setInput(e.target.value);
    }

    function quitLab() {
        navigate("/");
    }

    function restartLab() {
        //TODO: backend call to restart lab
    }

    return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
                <Settings />
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <div className="flex flex-col gap-y-4">
                <Button onClick={restartLab} >
                    Restart Lab
                </Button>
                <Button onClick={quitLab} >
                    Quit Lab
                </Button>
            </div>
        </PopoverContent>
    </Popover>
    )
}

function TitleBar({ flags, name, initialCompletedFlags }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedFlags, setCompletedFlags] = useState(initialCompletedFlags);

    function sendFlag(input) {
        setIsSubmitting(true);
        fetch(getBackendUrl(`/v1/labs/${name}/submit`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ flag: input })
        }).then(async (response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(await response.json());
            }
        }).then((response) => {
            setCompletedFlags(response.completedFlags);

        }).catch((error) => {
            console.error(error);
        }).finally(() => setIsSubmitting(false));
    }

    return (
        <div className="TitleBar flex flex-row items-center">
            <div className="basis-1/4"><Progress value={(completedFlags / flags) * 100}/></div>
            <div className="basis-1/2"><h3> H.E.I.S.E.N.B.E.R.G. </h3></div>
            <div className="basis-1/4 flex flex-row-reverse">
                <LabSettings />
                <MachineControl />
                <FlagInput isSubmitting={isSubmitting} onSubmit={sendFlag} />
            </div>
        </div>
    );
}

function ChatContainer({chatWidth}) {

    return (
        <div className="ChatContainer" style={{ width: chatWidth}}>
            <ChatWindow socket={ socket }/>
        </div>
    );
}

Console.propTypes = {
    commands: PropTypes.array,
    terminalOutputs: PropTypes.array,
    sendCommand: PropTypes.func,
}

const mapStateToProps = (state) => {
    return {commands: state.command.commands, terminalOutputs: state.command.terminalOutputs}
}

export default connect(
    mapStateToProps,
    {
        sendCommand
    },
)(Console);
/*
Author: Isamu Isozaki (isamu.website@gmail.com)
Description: description
Created:  2021-08-28T23:54:32.711Z
Modified: !date!
Modified By: modifier
*/

import {
    postCommand,
} from '../api/command';
import _ from 'lodash'
export const SEND_COMMAND_SUCCESS = 'SEND_COMMAND_SUCCESS';
export const COMMAND_FAIL = 'COMMAND_FAIL';


const initialState = {
    commands: [],
    terminalOutputs: [],
    error: false,
};

export default function commandReducer(state = initialState, 
{type, payload})
{
    switch (type) {
        case SEND_COMMAND_SUCCESS: {
            const {command, terminalOutput} = payload
            return {...state, commands:[...state.commands, command], terminalOutputs: [...state.terminalOutputs, terminalOutput]}
        }
        case COMMAND_FAIL: {
            console.log(type)
            return state
        }
        default:
            return state;
    }
}

export function sendCommand(command) {
    return async (dispatch) => {
        try {
            console.log("dispatched command")
            console.log(command)
            const {payload} = await postCommand(command)
            console.log("got output")
            console.log(payload)
            const { terminalOutput } = payload
            dispatch({ type: SEND_COMMAND_SUCCESS, payload: {terminalOutput, command}})
        } catch(e) {
            console.log(e)
            dispatch({ type: COMMAND_FAIL, payload: {} });
        }
    }
}
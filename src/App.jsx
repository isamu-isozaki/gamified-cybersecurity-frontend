/**
 * Author: Isamu Isozaki
 */
import React, {useState} from 'react';
import TerminalGCS from "./app/components/TerminalGCS";
import Console from './app/screens/Console';
import LabSelect from './app/screens/LabSelect';
import LabSelectContainer from "./app/screens/LabSelect";
import Home from './screens/Home';
import io from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:10000';

export const socket = io(URL);

function App() {
    const testLabList = [
        {
            title: 'Introduction',
            machineCount: 3,
            difficulty: 1,
        },
        {
            title: 'Crazy Challenge',
            machineCount: 10,
            difficulty: 3,
        },
        {
            title: 'Ultra Hard',
            machineCount: 9999,
            difficulty: 5,
        }
    ]

    const [selectedLab, setSelectedLab] = useState(null);

    const selectLab = (selectedLab) => {
        console.log("do something with with this info:", selectedLab)
        setSelectedLab(selectedLab);
    }

    if (selectedLab != null) {
        return (
            <div className="App">
                <Console socket={socket}/>
            </div>
        );
    } else {
        return (
            <div className="App">
                <LabSelectContainer labList={testLabList} selectLab={selectLab}/>
            </div>
        );
    }
}

export default App;
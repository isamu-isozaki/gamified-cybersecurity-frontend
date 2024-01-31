/**
 * Author: Isamu Isozaki
 */
import React from 'react';
import TerminalGCS from "./app/components/TerminalGCS";
import Console from './app/screens/Console';
import Home from './screens/Home';
import io from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:10000';

export const socket = io(URL);

function App() {
  return (
    <div className="App">
      <Console />
      <Home socket={socket} />
    </div>
  );
}

export default App;
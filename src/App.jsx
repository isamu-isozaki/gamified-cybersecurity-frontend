/**
 * Author: Isamu Isozaki
 */
import React from 'react';
import Home from './app/screens/Home';
import TerminalGCS from "./app/components/TerminalGCS";
import Console from './app/screens/Console';

/**
 * Initialize firebase and go to AuthNavigator
 */
function App() {
  return (
    <div className="App">
      <Console />
    </div>
  );
}

export default App;
/**
 * Author: Isamu Isozaki
 */
import React from 'react';
import Home from './app/screens/Home';
import Terminal from './app/screens/Terminal/terminal.jsx'

/**
 * Initialize firebase and go to AuthNavigator
 */
function App() {
  return (
    <div className="App">
      <Terminal />
    </div>
  );
}

export default App;

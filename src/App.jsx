/**
 * Author: Isamu Isozaki
 */
import React from 'react';
import Home from './app/screens/Home';
import ChatWindow from './app/components/chat/chatwindow';

/**
 * Initialize firebase and go to AuthNavigator
 */
function App() {
  return (
    <div className="App bg-gray-800 h-screen">
      <ChatWindow />
      {/* <Home /> */}
    </div>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import App from './App';
import { ContextProvider } from './Context/SocketContext'

ReactDOM.render(

  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
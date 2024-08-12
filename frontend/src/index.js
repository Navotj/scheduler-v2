import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './main';  // Import your Main component
import './styles.css';      // Import your global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />   {/* Render the Main component */}
  </React.StrictMode>
);

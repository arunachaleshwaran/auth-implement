import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
const root = document.getElementById('root');
if (root === null) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>Hello world</React.StrictMode>
);

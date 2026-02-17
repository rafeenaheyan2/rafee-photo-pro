
import React from 'react';
import { createRoot } from 'https://esm.sh/react-dom@^19.2.4/client';
import App from './App.tsx';

// Initialize React App in No-Build environment
const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(React.createElement(App));
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import App from './App';
import '@styles/global.scss';

// Get the root element from the HTML where the React app will be mounted.
const rootElement = document.getElementById('root');

// Ensure the root element exists before trying to render the app.
if (!rootElement) {
  throw new Error(
    "Failed to find the root element. Please ensure there is an element with id='root' in your index.html.",
  );
}

const root = ReactDOM.createRoot(rootElement);

// Render the application.
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

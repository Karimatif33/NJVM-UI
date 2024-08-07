import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./context/ContextProvider";
import { MsalProvider } from '@azure/msal-react';
import msalInstance from './authConfig';

// Render the app to the DOM
ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <ContextProvider>
      <App />
    </ContextProvider>
  </MsalProvider>,
  document.getElementById("root")
);

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

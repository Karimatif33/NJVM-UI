// console.log = function () {};
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./context/ContextProvider";
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
const pca = new PublicClientApplication(msalConfig);

// In your index.js or App.js (or any entry point of your React app)
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


ReactDOM.render(
  <MsalProvider instance={pca}>
    <ContextProvider>
      <App />
    </ContextProvider>
    </MsalProvider>,
  document.getElementById("root")
);

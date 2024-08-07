// src/authConfig.js
import { PublicClientApplication } from "@azure/msal-browser";
export const msalConfig = {
    auth: {
      clientId: 'bb977033-8f3e-4f91-b2a5-0a3a3591a36f',
      authority: 'https://login.microsoftonline.com/73e3e6a7-4745-4f61-aa48-1143f170b1ba',
      redirectUri: 'https://njmc.horus.edu.eg/auth-end', // Your redirect URI
        },
  cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
  }
};

const msalInstance = new PublicClientApplication(msalConfig);
await msalInstance.initialize();
export default msalInstance;
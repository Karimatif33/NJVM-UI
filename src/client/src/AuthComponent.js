import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import { useStateContext } from './context/ContextProvider';
import Spinner from './components/Spinner';
import * as microsoftTeams from '@microsoft/teams-js';

const AuthComponent = () => {
  const { instance } = useMsal();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser, setStuName, setIsAdmin, setLoading: setGlobalLoading } = useStateContext();

  const logToBackend = async (message, data) => {
    try {
      console.log('Sending log to backend:', { message, data });
      await axios.post('https://njmc.horus.edu.eg/api/log', {
        message,
        data,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error sending log to backend:', error.message);
    }
  };

  const getTeamsContext = (timeout = 10000) => {
    return new Promise((resolve, reject) => {
      if (typeof microsoftTeams === 'undefined') {
        const errorMessage = 'Microsoft Teams SDK is not available';
        console.error(errorMessage);
        logToBackend(errorMessage, {});
        return reject(new Error(errorMessage));
      }

      let timeoutHandle;

      const retrieveContext = () => {
        microsoftTeams.getContext((context) => {
          if (context) {
            clearTimeout(timeoutHandle);
            console.log('Teams context obtained:', context);
            logToBackend('Teams context obtained', { context });
            resolve(context);
          } else {
            const errorMessage = 'Teams context is undefined';
            console.error(errorMessage);
            logToBackend(errorMessage, {});
            reject(new Error(errorMessage));
          }
        });
      };

      timeoutHandle = setTimeout(() => {
        const errorMessage = 'Teams context retrieval timed out';
        console.error(errorMessage);
        logToBackend(errorMessage, {});
        reject(new Error(errorMessage));
      }, timeout);

      microsoftTeams.initialize(() => {
        console.log('Microsoft Teams SDK initialized');
        retrieveContext();
      });
    });
  };

  const getTeamsContextWithRetry = (timeout = 10000, retries = 3) => {
    const attempt = (retryCount) => {
      return getTeamsContext(timeout)
        .catch((error) => {
          if (retryCount > 0) {
            console.log(`Retrying context retrieval... (${retryCount} retries left)`);
            return attempt(retryCount - 1);
          } else {
            console.error('Failed to retrieve Teams context after retries:', error.message);
            logToBackend('Failed to retrieve Teams context after retries', { error: error.message });
            throw error;
          }
        });
    };

    return attempt(retries);
  };

  const handleTeamsAuthentication = async () => {
    console.log('Initializing Teams authentication');
    logToBackend('Initializing Teams authentication', {});
    try {
      microsoftTeams.initialize(() => {
        console.log('Microsoft Teams SDK initialized');
      });

      const context = await getTeamsContextWithRetry();
      const token = await getTeamsAuthToken();

      if (!token || !context) {
        throw new Error('Failed to retrieve Teams authentication token or context.');
      }

      const account = {
        username: context.userPrincipalName || 'unknown',
        homeAccountId: context.userObjectId || 'unknown',
        environment: 'teams',
        tenantId: context.tenantId || 'unknown',
        name: context.userDisplayName || 'unknown',
        idToken: token,
      };

      instance.setActiveAccount(account);
      setUser(context.userPrincipalName || 'unknown');
      setStuName(context.userDisplayName || 'unknown');
      await processAuthentication({ account, accessToken: token });
    } catch (error) {
      console.error('Teams authentication processing failed:', error.message);
      logToBackend('Teams authentication processing failed', { error: error.message });
      setError('Teams authentication error');
      setLoading(false);
    }
  };

  const getTeamsAuthToken = () => {
    return new Promise((resolve, reject) => {
      microsoftTeams.authentication.getAuthToken({
        successCallback: (token) => {
          console.log('Teams auth token obtained:', token);
          logToBackend('Teams auth token obtained', { token });
          resolve(token);
        },
        failureCallback: (error) => {
          console.error('Failed to get Teams auth token:', error);
          logToBackend('Failed to get Teams auth token', { error });
          reject(error);
        },
      });
    });
  };

  const handleSilentAuthentication = async () => {
    console.log('Initializing silent authentication');
    logToBackend('Initializing silent authentication', {});
    try {
      const accounts = instance.getAllAccounts();

      if (accounts.length > 0) {
        const account = accounts[0];
        instance.setActiveAccount(account);

        const tokenResponse = await instance.acquireTokenSilent({
          account: account,
          scopes: ["User.Read"]
        });

        await processAuthentication({ account, accessToken: tokenResponse.accessToken });
      } else {
        await initiateLogin();
      }
    } catch (error) {
      console.error('Silent authentication failed:', error.message);
      logToBackend('Silent authentication failed', { error: error.message });
      await initiateLogin();
    }
  };

  const initiateLogin = async () => {
    if (window.self === window.top) {
      await instance.loginRedirect({
        scopes: ["User.Read"]
      });
    } else {
      const errorMessage = 'Redirects are not supported for iframed applications.';
      console.error(errorMessage);
      logToBackend(errorMessage, {});
      setError('Iframe login error');
      setLoading(false);
    }
  };

  const processAuthentication = async ({ account, accessToken }) => {
    try {
      const email = account.username;
      if (!email) throw new Error('Email not found in account.');

      const username = email.split('@')[0];
      const userId = getUserId(username);

      setUser(username);
      await sendTokenToBackend(accessToken, username);
      await fetchData(userId);
      navigate('/Dashboard');
    } catch (error) {
      console.error('Processing authentication failed:', error.message);
      logToBackend('Processing authentication failed', { error: error.message });
      setError('Processing authentication error');
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const fetchData = async (userId) => {
    try {
      const response = await axios.get(`https://njmc.horus.edu.eg/api/hue/portal/v1/uiTotalsData/${userId}`);
      const data = response.data;

      if (data.length > 0) {
        const firstItem = data[0];
        setIsAdmin(firstItem.IsAdmin);
        setStuName(getName(firstItem.student_name));
      } else {
        const errorMessage = 'Empty array in the response data';
        console.error(errorMessage);
        logToBackend(errorMessage, {});
        setError('No data found');
      }
    } catch (error) {
      console.error('Fetching data failed:', error.message);
      logToBackend('Fetching data failed', { error: error.message });
      setError('Fetching data error');
    }
  };

  const sendTokenToBackend = async (accessToken, username) => {
    try {
      const response = await axios.post('https://njmc.horus.edu.eg/api/auth', null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Username: username,
        },
      });
      console.log('Token sent to backend successfully:', response.data);
      logToBackend('Token sent to backend successfully', { response: response.data });
    } catch (error) {
      console.error('Sending token to backend failed:', error.message);
      logToBackend('Sending token to backend failed', { error: error.message });
      setError('Sending token error');
    }
  };

  const getUserId = (username) => {
    switch (username) {
      case 'katif': return 2209;
      case 'mlotfy': return 53381491;
      case 'mwadood': return 1700;
      case 'asteet': return 1388;
      case 'rkishta': return 1449;
      case 'mbakr': return 1825;
      case 'mzedan': return 2290;
      default: return username;
    }
  };

  const getName = (Name) => {
    switch (Name) {
      case 'katif': return "Karim Atif";
      case 'mlotfy': return "Mohamed Lotfy";
      case 'mwadood': return "Mohamed wadood";
      case 'asteet': return "Ahmed Abu Steet";
      case 'rkishta': return "Ramy Kishta";
      case 'mbakr': return "Mohamed Bakr";
      case 'mzedan': return "Mohamed Zedan";
      default: return Name;
    }
  };

  const isInTeams = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /teams.microsoft.com/.test(document.referrer) || /Mobi|Android/i.test(userAgent) && /TeamsMobile/i.test(userAgent);
  };
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isInTeams()) {
          await handleTeamsAuthentication();
        } else {
          await handleSilentAuthentication();
        }
      } catch (error) {
        console.error('Error initializing authentication:', error.message);
        logToBackend('Error initializing authentication', { error: error.message });
        setError('Initialization error');
        setLoading(false);
      }
    };
    setGlobalLoading(true);
    initializeAuth();
  }, [instance, navigate, setGlobalLoading]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export default AuthComponent;

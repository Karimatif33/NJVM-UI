import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import msalInstance from './authConfig';
import { useStateContext } from './context/ContextProvider';
import Spinner from './components/Spinner';

const AuthComponent = () => {
  const { instance } = useMsal();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const { setUser, setStuName, setIsAdmin } = useStateContext();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize MSAL instance
        await msalInstance.initialize();

        // Handle redirect response from MSAL
        const response = await instance.handleRedirectPromise();
        if (response) {
          const account = response.account;
          const email = account.username;
          const name = account.name;

          // Extract username part from email
          const username = email.split('@')[0];

          // Determine user ID based on username
          let userId;
          if (username === 'katif') {
            userId = 2209;
          } else if (username === 'mzedan') {
            userId = 2290;
          }
          else if (username === 'rkishta') {
            userId = 1449;
          }
          else if (username === 'mbakr') {
            userId = 1825;
          }
          else if (username === 'asteet') {
            userId = 1388;
          } 
          else if (username === 'mlotfy') {
            userId = 53381491;
          }
          else if (username === 'mwadood') {
            userId = 1700;
          }
          else {
            userId = username; // Or handle other usernames appropriately
          }

          setUser(username);
          setStuName(name);
          console.log('Email:', email);
          console.log('Username:', userId);
          console.log('Name:', name);

          // Set the active account
          instance.setActiveAccount(account);

          // Acquire token silently
          const tokenResponse = await instance.acquireTokenSilent({
            account: account,
            scopes: ["User.Read"]
          });
          console.log('Access Token:', tokenResponse.accessToken);

          // Send token to backend
          await sendTokenToBackend(tokenResponse.accessToken, username, name);

          // Fetch user-specific data
          await fetchData(userId);

          // Navigate to the dashboard
          navigate('/Dashboard');
        } else {
          // If there's no response, initiate the login
          await instance.loginRedirect({
            scopes: ["User.Read"]
          });
        }
      } catch (error) {
        console.error('Error handling authentication redirect:', error);
        setError(`Error handling authentication redirect: ${error.message}`);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    const fetchData = async (userId) => {
      try {
        const response = await axios.get(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/uiTotalsData/${userId}`
        );
        const data = response.data; // Axios already parses the response to JSON

        // Check if the array has at least one item
        if (data.length > 0) {
          const firstItem = data[0];
          const role = firstItem.IsAdmin;
          setIsAdmin(role);
          console.log("Role from app", role);
        } else {
          console.error("Empty array in the response data");
        }
      } catch (error) {
        if (error.response) {
          console.error('Server responded with status code:', error.response.status);
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
      }
    };

    const sendTokenToBackend = async (accessToken, username, name) => {
      try {
        const response = await axios.post('https://njmc.horus.edu.eg/api/auth', null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Username: username,
            Name: name,
          },
        });
        console.log('Token sent to backend successfully', response);
      } catch (error) {
        console.error('Error sending token to backend:', error);
      }
    };

    initializeAuth();
  }, [instance, navigate, setUser, setStuName, setIsAdmin]);

  return (
    <div>
      {loading ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
        error && <p>{error}</p>
      )}
    </div>
  );
};

export default AuthComponent;

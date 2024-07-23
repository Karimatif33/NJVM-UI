import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios'; 
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from './authConfig';
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Toaster } from "react-hot-toast";
// import { useMsal } from "@azure/msal-react";
import { Navbar, Footer, Sidebar } from "./components";
import {
  Dashboard,
  Total,
  StudentsPull,
  CoursesPull,
  Transcript,
  StudyTimetable,
  ExamTimeTable,
  Attendance,
  Unbaidinvoices,
  Stacked,
  Pyramid,
  Line,
  Area,
  Bar,
  Pie,
  Financial,
  Calendar,
  // Registration,
  // Questionnaire,
  // Progress,
  // Customization,
  // SubjectResult,
  // CoursesQuestionnaire,
  // ServicesQuestionnaire,
  // SsoDemo,
} from "./pages";

import { useStateContext } from "./context/ContextProvider";
import "./App.css";
import ThemeSettings from "./components/ThemeSettings";
import Registration from "./pages/Registration";
import Questionnaire from "./pages/Questionnaire";
import Progress from "./pages/Progress";
import Customization from "./pages/Customization";
import SubjectResult from "./pages/SubjectResult";
import CoursesQuestionnaire from "./pages/CoursesQuestionnaire";
import ServicesQuestionnaire from "./pages/ServicesQuestionnaire";
import SsoDemo from "./pages/ssoDemo";
const App = () => {
  const {
    activeMenu,
    themeSettings,
    setThemeSettings,
    currentcolor,
    currentMode,
    setUser,
    setStuName,
    setIsAdmin,
    user,
  } = useStateContext();
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
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
          } else {
            userId = username; // Or handle other usernames appropriately
          }   setUser(username)
          setStuName(name);
          console.log('Email:', email);
          console.log('Username:', userId); // This is the part before '@'
          console.log('Name:', name);

          // Set the active account
          instance.setActiveAccount(account);

          // Acquire token silently
          const tokenResponse = await instance.acquireTokenSilent(loginRequest);
          console.log('Access Token:', tokenResponse.accessToken);
          
          // Send token to backend
          await sendTokenToBackend(tokenResponse.accessToken, username, name);
          await fetchData(userId)
        }
      } catch (error) {
        console.error('Error handling authentication redirect:', error);
      }
    }
    const fetchData = async (userId) => {
      
      try {
        const response = await axios.get(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/uiTotalsData/${userId}`
        );
        const data = response.data; // Axios already parses the response to JSON

        // Check if the array has at least one item
        if (data.length > 0) {
          const firstItem = data[0];
          // Access properties from the first item
          const role = firstItem.IsAdmin;
          setIsAdmin(role)
          // Log the values

          console.log("Role from app", role);
          ;
        } else {
          console.error("Empty array in the response data");
        }
      }  catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Server responded with status code:', error.response.status);
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an error
          console.error('Error setting up request:', error.message);
        }
      }
    };

    handleAuthRedirect().then(() => fetchData());
  }, [instance, accounts]);

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


  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(error => console.error('Login failed:', error));
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };





 

  return (
    
    <div className={currentMode === "Dark" ? "dark" : ""}>
      {themeSettings && <ThemeSettings />}
      <BrowserRouter>
      <div className="flex relative dark:bg-main-dark-bg font-cairo ">
      <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentcolor }}
                className="text-3xl text-white rounded-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ease-in">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg ease-in	">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  ease-in	"
                : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 ease-in	"
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
   <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {accounts[0]?.name}</p>
         

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
            <div className="">
              <Routes>
              <Route path="*" element={<Dashboard />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/total" element={<Total />} />
                <Route path="/StudentPull" element={<StudentsPull />} />
                <Route path="/CoursesPull" element={<CoursesPull />} />
                <Route path="/Transcript" element={<Transcript />} />
                <Route path="/study-timetable" element={<StudyTimetable />} />
                <Route path="/exam-timetable" element={<ExamTimeTable />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/Unbaidinvoices" element={<Unbaidinvoices />} />
                <Route path="/exam-timetable" element={<ExamTimeTable />} />
                <Route path="/Registration" element={<Registration />} />
                <Route path="/Questionnaire" element={<Questionnaire />} />
                <Route path="/courses-questionnaire" element={<CoursesQuestionnaire />} />
                <Route path="/services-questionnaire" element={<ServicesQuestionnaire />} />
                <Route path="/Progress" element={<Progress />} />
                <Route path="/Customization" element={<Customization />} />
                <Route path="/Subject-Result" element={<SubjectResult />} />
                <Route path="/ssodemo" component={<SsoDemo/>} />
                <Route path="/line" element={<Line />} />
                <Route path="/area" element={<Area />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/financial" element={<Financial />} />
                <Route path="/pyramid" element={<Pyramid />} />
                <Route path="/stacked" element={<Stacked />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "45px" }}
        toastOptions={{
          success: {
            duration: 2000,
          },
          error: {
            duration: 3000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "#fff",
            color: "#000",
          },
        }}
      />
    </div>
  );
};

export default App;

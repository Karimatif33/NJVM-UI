import React, { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext();

const initialState = {
  cart: false,
  userProfile: false,
  notification: false,
  // IsAdmin:false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState({});
  const [IsAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [DBUser, setDBUser] = useState(null);
  // const [currentcolor, setCurrentColor] = useState("#03C9D7");
  // const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [StuName, setStuName] = useState("");
  const [CurrCourseId, setCurrCourseId] = useState("");
  const [devAutFill, setDevAutFill] = useState("hidden");
  const [isDevMode, setIsDevMode] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const [currentMode, setCurrentMode] = useState(() => {
    // Retrieve the theme mode from localStorage, if available
    return localStorage.getItem("themeMode") || "light";
  });

  const [currentcolor, setCurrentColor] = useState(() => {
    // Retrieve the color mode from localStorage, if available
    return localStorage.getItem("colorMode") || "#b88b1a";
  });


  // useEffect(() => {
  //   // Retrieve userId from local storage
  //   const storedUserId = localStorage.getItem("userId");
  //   if (storedUserId && !DBUser) {
  //     // Check if DBUser state is not already set
  //     setDBUser(storedUserId);
  //   }

  //   // Retrieve StudentCode from local storage
  //   const storedId = localStorage.getItem("StudentCode");
  //   if (storedId && !user) {
  //     // Check if user state is not already set
  //     setUser(storedId);
  //   }
  // }, [DBUser, setDBUser, user, setUser]);


  useEffect(() => {
    const storedDevAutFill = localStorage.getItem('DevMode');
    const storedIsDevMode = localStorage.getItem('isDevMode') === 'true';

    if (storedDevAutFill) {
      setDevAutFill(storedDevAutFill);
    }
    setIsDevMode(storedIsDevMode);
  }, []);

  // Function to set the theme mode
  const setMode = (e) => {
    const mode = e.target.value;
    setCurrentMode(mode);
    localStorage.setItem("themeMode", mode);
  };

  // Function to set the color mode
  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });


  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        activeMenu,
        setActiveMenu,
        IsAdmin,
        setIsAdmin,
        isClicked,
        setIsClicked,
        handleClick,
        screenSize,
        setScreenSize,
        setDBUser,
        DBUser,
        currentcolor,
        currentMode,
        setCurrentMode,
        setCurrentColor,
        themeSettings,
        setThemeSettings,
        setColor,
        setMode,
        StuName,
        setStuName,
        CurrCourseId,
        setCurrCourseId,
        setDevAutFill,
        devAutFill,
        isDevMode,
        setIsDevMode,
        setLoading,
        loading
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

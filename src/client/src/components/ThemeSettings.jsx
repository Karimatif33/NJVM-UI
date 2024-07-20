import React, { useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { themeColors } from "../data/dummy";
import { useStateContext } from "../context/ContextProvider";
import UseSwitchesCustom from "./BtnToggle";

const ThemeSettings = () => {
  const {
    setColor,
    setMode,
    currentMode,
    currentcolor,
    setThemeSettings,
    themeSettings,
    setDevAutFill,
    isDevMode,
    setIsDevMode ,
    devAutFill
  } = useStateContext();
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click occurred outside of the popup
      if (themeSettings && !event.target.closest(".bg-white")) {
        setThemeSettings(false);
      }
    };
    // Add event listener to the document
    document.addEventListener("click", handleOutsideClick);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);


  
  const handledevAutFill = () => {
    setDevAutFill(prevState => {
      const newDevAutFill = prevState === 'a' ? 'hidden' : 'a';
      localStorage.setItem('DevMode', newDevAutFill);
      return newDevAutFill;
    });

    setIsDevMode(prevState => {
      const newIsDevMode = !prevState;
      localStorage.setItem('isDevMode', newIsDevMode.toString());
      return newIsDevMode;
    });
  };

  return (
    <div className="bg-half-transparent w-screen fixed nav-item top-0 right-0">
      <div className="float-right h-screen dark:text-gray-200  bg-white dark:bg-[#484B52] w-400 marginPx">
        <div className="flex justify-between items-center p-4 ml-4">
          <p className="font-semibold text-lg">Settings</p>
          <button
            type="button"
            onClick={() => setThemeSettings(false)}
            style={{ color: "rgb(153, 171, 180)", borderRadius: "50%" }}
            className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
          >
            <MdOutlineCancel />
          </button>
        </div>
        <div className="flex-col border-t-1 border-color p-4 ml-4">
          <p className="font-semibold text-xl ">Mode Option</p>
          <div>

{/* <UseSwitchesCustom/> */}
          </div>

          <div className="mt-4">
            <input
              type="radio"
              id="light"
              name="theme"
              value="Light"
              className="cursor-pointer"
              onChange={setMode}
              checked={currentMode === "Light"}
            />
            <label htmlFor="light" className="ml-2 text-md cursor-pointer">
              Light
            </label>
          </div>
          <div className="mt-2">
            <input
              type="radio"
              id="dark"
              name="theme"
              value="Dark"
              onChange={setMode}
              className="cursor-pointer"
              checked={currentMode === "Dark"}
            />
            <label htmlFor="dark" className="ml-2 text-md cursor-pointer">
              Dark
            </label>
          </div> 
        </div>
        <div className="p-4 border-t-1 border-color ml-4">
          <p className="font-semibold text-xl ">Colors Option</p>
          <div className="flex gap-3">
            {themeColors.map((item, index) => (
              <TooltipComponent
                key={index}
                content={item.name}
                position="TopCenter"
              >
                <div
                  className="relative mt-2 cursor-pointer flex gap-5 items-center"
                  key={item.name}
                >
                  <button
                    type="button"
                    className="h-10 w-10 rounded-full cursor-pointer"
                    style={{ backgroundColor: item.color }}
                    onClick={() => setColor(item.color)}
                  >
                    <BsCheck
                      className={`ml-2 text-2xl text-white ${
                        item.color === currentcolor ? "block" : "hidden"
                      }`}
                    />
                  </button>
                </div>
              </TooltipComponent>
            ))}
          </div>
        </div>
        <div className="p-4 border-t-1 border-color ml-4">
          <p className="font-semibold text-xl ">Dev Mode</p>
          <div className="flex justify-around">
          <div className="center">
          <button
            className={`p-3 rounded center mt-5 ${isDevMode ? 'bg-green-500' : 'bg-orange-400'}`}
            onClick={handledevAutFill}
          >
            {isDevMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
          </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;


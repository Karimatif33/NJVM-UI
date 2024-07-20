import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaTasks } from "react-icons/fa";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import avatar from "../data/avatar.jpg";
import toast from "react-hot-toast";

// import { Cart, Chat, Notification, UserProfile } from '.';
import { useStateContext } from "../context/ContextProvider";
import UserProfile from "./UserProfile";

import Notfication from "./Notfication";
import ToDo from "./ToDo";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

export const Navbar = () => {
  const { user } = useStateContext();
  const {
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setIsClicked,
    screenSize,
    setScreenSize,
    currentcolor,
    StuName,
  } = useStateContext();
  useEffect(() => {
    const handleresize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleresize);
    handleresize();
    return () => window.removeEventListener("resize", handleresize);
  }, []);
  useEffect(() => {
    if (screenSize <= 1220) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      {/* to fix toggle i created a seprit btn */}
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
        color={currentcolor}
        icon={<AiOutlineMenu />}
      />
      <span className="w-[45px] hidden disBlock ">
        <img src="https://i.ibb.co/k5MmzZP/2icon.png" alt="" />
      </span>
      <div className="flex">
        {/* <NavButton
          title="To_Do"
          dotColor="#03C9D7"
          customFunc={() => handleClick("To_Do")}
          color="black"
          icon={<FaTasks />}
        /> */}
        {/* <NavButton
          title="notfication"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick("notfication")}
          color="black"
          icon={<RiNotification3Line />}
        /> */}
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg hover:dark:bg-[#33373e] "
            onClick={() => handleClick("userProfile")}
          >
            {StuName !== ""
              ? user && (
                  <>
                    <p className="font-semibold dark:font-light dark:text-gray-300">
                      logged as ({" "}
                      <span
                        style={{ color: `${currentcolor}` }}
                        className="text-green-700 rounded-full select-all font-black"
                      >{`${user}`}</span>{" "}
                      )
                    </p>
                    <img
                      className="rounded-full w-7 h-8"
                      src={avatar}
                      alt="user-profile"
                    />
                    <p>
                      <span className="text-gray-400 text-14">Hi,</span>{" "}
                      <span className="text-gray-400 font-bold ml-1 text-14">
                        {`${StuName.split(" ")[0]} ${StuName.split(" ")[1]}`}
                      </span>
                    </p>
                    <MdKeyboardArrowDown className="text-gray-400 text-14" />
                  </>
                )
              : ""}
          </div>
        </TooltipComponent>
        {/* {isClicked.To_Do && <ToDo />} */}
        {/* {isClicked.notfication && <Notfication />} */}
        {/* {isClicked.userProfile && <UserProfile />} */}
      </div>
    </div>
  );
};
export default Navbar;

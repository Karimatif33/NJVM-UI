import React from "react";
import { Link, NavLink } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import MCLogoMainSidebar from "../utiltis/IMG/MC.png"; // Adjust the path as necessary
import HUELogoMainSidebar from "../utiltis/IMG/HUE.png"; // Adjust the path as necessary
import HUELogoDarkSidebar from "../utiltis/IMG/Logo-dark.png"; // Adjust the path as necessary

import { links, links_Stu } from "./utiltisContact/NavLinksData";
// import { useStateContext } from '../contexts/ContextProvider';
import { useStateContext } from "../context/ContextProvider";
import InputForm from "../components/Input";

export const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize, currentcolor } =
    useStateContext();
  const { IsAdmin, DBUser, currentMode } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };
  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2 ease-in	";
  const normalLink =
    "ease-in-out flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 ease-in	">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center ease-in">
            <Link
              to="/"
              onClick={() => { }}
              className="items-center gap-3 ml-[2px] mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <span className="w-[170px] ml-[45px]">
                <img
                  src={
                    currentMode === "Dark"
                      ? HUELogoDarkSidebar
                      : HUELogoMainSidebar
                  }
                  alt="HUE"
                />
              </span>
            </Link>
            {/* <TooltipComponent content="Close" position="BottomCenter">
              <button
                type="button"
                onClick={() =>
                  setActiveMenu((prevActiveMenue) => !prevActiveMenue)
                }
                className="hover:bg-light-gray text-xl rounded-xl mr-3 p-2 bg-[#e0c379]  mt-4 block text-white "
                style={{ backgroundColor: `${currentcolor}` }}
              >
                <RiCloseLine />
              </button>
            </TooltipComponent> */}
          </div>
          {IsAdmin && <InputForm />}
          <div className="mt-10">
          {IsAdmin && (
  <>
    {links.map((item) => (
      <div key={item.title}>
        {/* Always show the CUSTOMIZATION section */}
        {item.title === "CUSTOMIZATION" && (
          <>
            <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
              {item.title}
            </p>
            {item.links.map((link) => (
              <NavLink
                to={`./${link.path}`}
                key={link.name}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentcolor : "",
                  pointerEvents: "auto",
                  opacity: 1,
                })}
                className={({ isActive }) =>
                  isActive
                    ? `${activeLink}`
                    : `${normalLink}`
                }
              >
                {link.icon}
                <span className="capitalize">{link.name}</span>
              </NavLink>
            ))}
          </>
        )}
        {/* Conditionally show other sections based on IsAdmin and DBUser */}
        {item.title !== "CUSTOMIZATION" && DBUser && (
          <>
            <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
              {item.title}
            </p>
            {item.links.map((link) => (
              <NavLink
                to={`./${link.path}`}
                key={link.name}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentcolor : "",
                  pointerEvents: "auto",
                  opacity: DBUser ? 1 : 0.5,
                })}
                className={({ isActive }) =>
                  isActive
                    ? `${activeLink} ${DBUser ? "" : "disabled-link"}`
                    : `${normalLink} ${DBUser ? "" : "disabled-link"}`
                }
                aria-disabled={!DBUser}
              >
                {link.icon}
                <span className="capitalize">{link.name}</span>
              </NavLink>
            ))}
          </>
        )}
      </div>
    ))}
  </>
)}

          

            {!IsAdmin &&
              links_Stu.map((item) => (
                <div key={item.title}>
                  {/* <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                    {item.title}
                  </p> */}
                  {item.links.map((link) => (
                    <NavLink
                      to={`./${link.path}`}
                      key={link.name}
                      onClick={handleCloseSideBar}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? currentcolor : "",
                      })}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      {link.icon}
                      <span className="capitalize">{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};
export default Sidebar;

import { useEffect, useState } from "react";
import CurrentAcadYear from "../components/Current/CurrentAcadYear";
import CurrentSemester from "../components/Current/CurrentSemester";
import UpdateStudent from "../components/Current/UpdateStudent";
import CurrentAcadYearBlock from "../components/Current/CurrentAcadYearBlock";
import CurrentSemesterBlock from "../components/Current/CurrentSemesterBlock";
import { useStateContext } from "../context/ContextProvider";
import { useNavigate } from "react-router";

export const Customization = () => {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const { DBUser } = useStateContext();
  const navigate = useNavigate();

;
  return (
    <div className=" drop-shadow-xl flex flex-col items-center">
      <p className="text-center m-3 text-5xl dark:text-white">Customization</p>
      {/* Check box to updete */}
      {/* <p className="text-center m-6 text-3xl dark:text-white">Customization</p> */}
      <div className="w-full md:w-4/5 lg:w-3/5 flex justify-center my-7">
        <div className="pb-6 p-7 bg-gray-50 rounded-lg dark:bg-gray-900 flex flex-col lg:flex-row justify-center gap-7">
          <UpdateStudent />
        </div>
      </div>
      {/* Current  */}
      <p className="text-center m-6 text-3xl dark:text-white">Current</p>
      <div className="w-full md:w-4/5 lg:w-3/5 flex justify-center mb-7">
        <div className="p-7 bg-gray-50 rounded-b-lg dark:bg-gray-900 flex flex-col lg:flex-row justify-center gap-7">
          <CurrentAcadYear />
          <CurrentSemester />
        </div>
        <div></div>
      </div>
      {/* Blocked */}
      <p className="text-center m-6 text-3xl dark:text-white">Block Time</p>
      <div className="w-full md:w-4/5 lg:w-3/5 flex justify-center mb-7">
        <div className="p-7 bg-gray-50 rounded-b-lg dark:bg-gray-900 flex flex-col lg:flex-row justify-center gap-7">
          <CurrentAcadYearBlock />
          <CurrentSemesterBlock />
        </div>
        <div></div>
      </div>
    </div>
  );
};
export default Customization;

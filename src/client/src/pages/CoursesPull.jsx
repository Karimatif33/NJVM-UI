import React, { useEffect, useState } from "react";
import PullTotalData from "../components/CoursePulling/Pull-TotalData";
import PullTotalSemesters from "../components/CoursePulling/Pull-TotalSemesters";
import PullTotalTranscript from "../components/CoursePulling/Pull-TotalTranscript";
import PullCurrentTranscript from "../components/CoursePulling/Pull-CurrentTranscript";
import PullCurrentSemesters from "../components/CoursePulling/Pull-CurrentSemesters";
import Accordion from "../components/AccordionCode";
import CurrentAcadYear from "../components/Current/CurrentAcadYear";
import CurrentSemester from "../components/Current/CurrentSemester";
import UpdateStudent from "../components/Current/UpdateStudent";
import { useStateContext } from "../context/ContextProvider";
import { useNavigate } from "react-router";

export const CoursesPull = () => {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const { DBUser } = useStateContext();
  const navigate = useNavigate();


  const handleToggle = () => {
    const accordion = document.getElementById("accordion");
    if (accordion.open) {
      setWidth(accordion.offsetWidth);
      setHeight(accordion.offsetHeight);
    } else {
      setWidth(null);
      setHeight(null);
    }
  };
  return (
    <div className="mt-[100px] drop-shadow-xl ">
      <p className="text-center m-6 text-3xl dark:text-white">
        Pulling Data By course
      </p>
      {/* <div className="flex justify-center items-center h-screen"> */}
      <div className="flex justify-center items-center">

  <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 pr-[150px] pl-[150px] pt-[30px] pb-[30px] rounded-2xl md:w-1280">
    {/* CurrentAcadYear component */}
    <div className="m-3 flex justify-center gap-7">
    {/* <details
        id="accordion"
        className="border border-gray-300 rounded-lg mb-4"
        onToggle={handleToggle}
      >
        <summary className="cursor-pointer bg-gray-200 p-4 rounded-t-lg rounded-b-lg dark:bg-gray-700 min-w-[500px]">
          Curuent Active
        </summary>
        <div className="p-7 bg-gray-50 rounded-b-lg dark:bg-gray-900  flex justify-center gap-7">
        <CurrentAcadYear />
      <CurrentSemester />
        </div>
        <div className="pb-6 bg-gray-50 rounded-b-lg dark:bg-gray-900  flex justify-center gap-7">
      <UpdateStudent />
      </div>
      </details> */}

    </div>
    <div className="flex justify-between">
      <div className="flex gap-3 flex-wrap justify-center text-center">
        {/* Other components */}
        <div>
          <PullTotalData />
        </div>
        <div>
          <PullTotalSemesters />
        </div>
        <div>
          <PullTotalTranscript />
        </div>
        <div>
          <PullCurrentSemesters />
        </div>
        <div>
          <PullCurrentTranscript />
        </div>
      </div>
    </div>
    <br />
    <Accordion />
  </div>
</div>

    </div>
  );
};
export default CoursesPull;

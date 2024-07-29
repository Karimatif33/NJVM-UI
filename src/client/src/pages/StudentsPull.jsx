import React, { useEffect } from 'react'
import  PullTotalSemesters  from "../components/StudentPulling/Pull-TotalSemesters";
import  PullTotalTranscript  from "../components/StudentPulling/PullTotalTranscript";
import Accordion from '../components/AccordionCode';
import { useNavigate } from 'react-router';
import { useStateContext } from '../context/ContextProvider';

export const StudentsPull = () => {
  const navigate = useNavigate();
  const { DBUser } = useStateContext();


  return (
    <div className="mt-[100px] drop-shadow-xl ">
    <p  className="text-center m-6 text-3xl dark:text-white">Pulling Data By Student</p>
    <div className="flex gap-10 flex-wrap justify-center">
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 pr-[150px] pl-[150px] pt-[30px] pb-[30px] rounded-2xl md:w-1280  ">
      <div className="flex justify-between">
        <div className="flex items-center gap-11 flex-wrap text-center">
  
    <PullTotalSemesters />
    <PullTotalTranscript />

  
    </div>
   </div>
 </div>
</div>
    </div>

  )
 }
export default StudentsPull;
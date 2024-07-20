import React from "react";
import  TotalStuff  from "../components/Total/TotalStaff";
import  Totallevels  from "../components/Total/TotalLevels";
import  TotalCourses  from "../components/Total/TotalCourses";
import  TotalFaculties  from "../components/Total/TotalFaculties";
import  TotalGrades  from "../components/Total/TotalGrades";
import  TotalSemesters  from "../components/Total/TotalSemesters";
import  TotalAcadYears  from "../components/Total/TotalAcadYears";
import  TotalStudents  from "../components/Total/TotalStudents";
import  TotalSubjects  from "../components/Total/TotalSubjects";
import Accordion from "../components/AccordionCode";


export const Total = () => {
  return (
    // <div className='flex flex-wrap gap-5 m-5 mt-20'>
    //  {/* <PullTotalData /> */}
    //  <TotalStuff />
    //  <Totallevels />
 
    // </div>

    <div className="mt-[100px] drop-shadow-xl mb-9">
 <p  className="text-center m-6 text-3xl dark:text-white">Total Data Pulling</p>
 <div className="flex gap-3 flex-wrap justify-center ">
 <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg mb-3 mt-3 p-4 rounded-2xl md:w-780  ">
   <div className="flex justify-between">
     <div className="flex items-center gap-3 flex-wrap justify-center">
     <TotalStudents />
       <TotalStuff />
     <Totallevels />
     <TotalSemesters />
     <TotalAcadYears />
     <TotalGrades />
     <TotalFaculties />
     <TotalCourses />
     <TotalSubjects />



     </div>
   </div>

 </div>
</div>
    </div>
   )
 }
export default Total;

import React, { useEffect, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import { BsCurrencyDollar } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { IoIosMore } from "react-icons/io";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { Stacked, Pie, Button, LineChart, SparkLine } from "../components";
import { IoIosTime } from "react-icons/io";
import { MdMoreTime } from "react-icons/md";
import { IoIosTimer } from "react-icons/io";
import { FaChartLine } from "react-icons/fa6";

import {
  medicalproBranding,
  recentTransactions,
  weeklyStats,
  dropdownData,
  SparklineAreaData,
  ecomPieChartData,
} from "../data/dummy";
import { EduData } from "../components/utiltisContact/DashboardData";
function Dashboard() {
  const { setUser } = useStateContext();
  const [students, setStudents] = useState([]);
const stuId = 17243
  useEffect(() => {
    // Fetch data here
    const fetchData = async () => {
      try {
        const response = await fetch(
         ` https://njmc.horus.edu.eg/api/hue/portal/v1/uiTotalsData/${setUser}`
        );
        const data = await response.json();
        setStudents(data);
        console.log(response, data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  return (
    <div className="mt-12">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-[36rem] p-6 pt-9 m-3 bg-hero-pattern bg-no-repat bg-cover bg-center hover:drop-shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              {students.map((item) => (
                <div key={item.id}>
                  <p className="font-bold text-gray-400">
                    Name :{" "}
                    <span className="font-bold text-black">
                      {item.student_name} 
                    </span>
                  </p>
                  <p className="font-bold text-gray-400">
                    Level :{" "}
                    <span className="font-bold text-black">{item.levelname}</span>
                  </p>
                  {/* Add more fields based on your data structure */}
                  {/* Example: */}
                  <p className="font-bold text-gray-400">
                    Course :{" "}
                    <span className="font-bold text-black">
                      {item.Course }
                    </span>
                  </p>
                  <p className="font-bold text-gray-400">
                    Advisor :{" "}
                    <span className="font-bold text-black">
                      {item.staff_name }
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {students.map((item) => (
            <div
              key={item.title}
              className=" bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl flex m-3 flex-wrap justify-center gap-5 items-center hover:drop-shadow-xl cursor-pointer"
            >
              <button
                type="button"
                className="flex flex-wrap text-[#03C9D7] red-600 bg-[#E5FAFB] justify-center gap-1 items-center text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                <FaChartLine />
                <p className="">
                  <span> : </span>
                  <span className="text-xl font-bold">{item.gpa}</span>
                </p>
              </button>

              <p className="text-xl text-gray-400 mt-1">Current GPA</p>
            </div>
          ))}
          {students.map((item) => (
            <div
              key={item.title}
              className=" bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl flex m-3 flex-wrap justify-center gap-5 items-center hover:drop-shadow-xl cursor-pointer"
            >
              <button
                type="button"
                className="flex flex-wrap text-yellow-900	 green-600 bg-yellow-300 ustify-center gap-1 items-center text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                <IoIosTimer />
                <p className="">
                  <span> : </span>
                  <span className="text-xl font-bold">{item.hours}</span>
                </p>
              </button>

              <p className="text-xl text-gray-400 mt-1">Requested Hours</p>
            </div>
          ))}{" "}
          {students.map((item) => (
            <div
              key={item.title}
              className=" bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl flex m-3 flex-wrap justify-center gap-5 items-center hover:drop-shadow-xl cursor-pointer"
            >
              <button
                type="button"
                className="flex flex-wrap text-orange-800 green-600 bg-orange-300	justify-center gap-1 items-center text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
               <IoIosTime />
                <p className="">
                  <span> : </span>
                  <span className="text-xl font-bold">{item.gpa}</span>
                </p>
              </button>

              <p className="text-xl text-gray-400 mt-1">Earned Hours</p>
            </div>
          ))}{" "}
          {students.map((item) => (
            <div
              key={item.title}
              className=" bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl flex m-3 flex-wrap justify-center gap-5 items-center hover:drop-shadow-xl cursor-pointer"
            >
              <button
                type="button"
                className="flex flex-wrap text-green-700	 red-600 bg-green-300 justify-center gap-1 items-center text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                <FaChartLine />
                <p className="">
                  <span> : </span>
                  <span className="text-xl font-bold">{item.gpa}</span>
                </p>
              </button>

              <p className="text-xl text-gray-400 mt-1">Needed Hours</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Progrees</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoDotFill />
                </span>
                <span>Progrees</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoDotFill />
                </span>
                <span>Progrees</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

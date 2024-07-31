import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../context/ContextProvider";
// import { Stacked, Pie, Button, LineChart, SparkLine } from "../components";
import { IoIosTime } from "react-icons/io";
import { IoIosTimer } from "react-icons/io";
import { FaChartLine } from "react-icons/fa6";
import LineChart from "../components/Charts/LineChart";
import Pie from "../components/Charts/Pie";
import { useNavigate } from "react-router";
function Dashboard() {
  const [students, setStudents] = useState([]);
  const { user, setDBUser, setUser, DBUser, StuName, setStuName, setCurrCourseId, setIsAdmin } =
    useStateContext();
  const [showComponent, setShowComponent] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/uiTotalsData/${user}`
        );
        const data = response.data; // Axios already parses the response to JSON
        setStudents(data);

        // Check if the array has at least one item
        if (data.length > 0) {
          const firstItem = data[0];
          // Access properties from the first item
          const userId = firstItem.id;
          const courseName = firstItem.Course; // Replace 'Course' with the actual property name
          const EngName = firstItem.student_name;
          const CourseId = firstItem.course_id;
          const role = firstItem.IsAdmin;
          // Log the values
          console.log("UserID:", userId);
          console.log("Course Name:", courseName);
          console.log("EngName:", EngName);
          console.log("CourseId:", CourseId)
          console.log("Role:", role);
          ;
          setCurrCourseId(CourseId);
          // setStuName(EngName);
          setDBUser(userId);
          localStorage.setItem("userId", userId);
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

    fetchData();
  }, [user, setDBUser, setCurrCourseId, setStuName]);

  useEffect(() => {
    // Set dbuser based on the first element in the students array
    if (students.length > 0) {
      setDBUser(students[0].id);
    }
  }, [students]);
  // The empty dependency array ensures that this effect runs once when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (user === null) {
      navigate("/ssodemo");
    }
  }, [user, navigate]);

  return (
    <>
      {/* {students === null || students.length === 0 ? (
             <p className="text-gray-900 bg-white rounded-xl text-center shadow-md p-4 font-semibold text-lg max-w-[50vw] m-auto mt-[100px]">
             Please Login
           </p>// Render spinner while data is being fetched
      ) : ( */}
      <div className="mt-12">
        <div className="flex flex-wrap lg:flex-nowrap justify-center ">
          {/* <div className= "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-[36rem] p-6 pt-9 m-3 bg-hero-pattern bg-no-repat bg-cover bg-center drop-shadow-xl hover:drop-shadow-2xl"> */}
          <div className="DashboardCard bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-[11.3rem] rounded-xl w-full lg:w-[36rem] p-6 pt-9 m-3  drop-shadow-xl hover:drop-shadow-2xl   bg-eye-horus bg-no-repat  bg-center">
            <div className="flex justify-between items-center ">
              <div>
                {students.map((item) => (
                  <div key={item.id}>
                    <p className="font-bold text-black-400 dark:text-grat-500">
                      Name :{" "}
                      <span className="font-bold text-black dark:text-gray-300">
                        {item.student_name}
                      </span>
                    </p>
                    <p className="font-bold text-black-400 dark:text-grat-500">
                      Level :{" "}
                      <span className="font-bold text-black dark:text-gray-300">
                        {item.levelname}
                      </span>
                    </p>
                    {/* Add more fields based on your data structure */}
                    {/* Example: */}
                    <p className="font-bold text-black-400 dark:text-grat-500">
                      Course :{" "}
                      <span className="font-bold text-black dark:text-gray-300">
                        {item.Course}
                      </span>
                    </p>
                    <p className="font-bold text-black-400 dark:text-grat-500">
                      Advisor :{" "}
                      <span className="font-bold text-black dark:text-gray-300">
                        {item.staff_name}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex m-3 flex-wrap justify-center  items-center">
            {students.map((item) => (
              <div
                key={item.title}
                className="minwidcard bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl flex m-3 flex-wrap justify-center gap-5 items-center drop-shadow-xl hover:drop-shadow-2xl cursor-pointer"
              >
                <button
                  type="button"
                  className="flex flex-wrap text-[#023047] red-600 bg-[#219ebc] justify-center gap-1 items-center text-2xl opacity-0.9 rounded-full p-4 drop-shadow-xl hover:drop-shadow-2xl"
                >
                  <FaChartLine />
                  <p className="">
                    <span> : </span>
                    {item.blockreason !== "" ? "-" : item.gpa}
                  </p>
                </button>

                <p className="text-xl text-gray-400 mt-1">Current GPA</p>
              </div>
            ))}
            {students.map((item) => (
              <div
                key={item.title}
                className="minwidcard bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl flex m-3 flex-wrap justify-center gap-5 items-center drop-shadow-xl hover:drop-shadow-2xl cursor-pointer"
              >
                <button
                  type="button"
                  className="flex flex-wrap text-orange-800 green-600 bg-[#fb8500]	justify-center gap-1 items-center text-2xl opacity-0.9 rounded-full p-4 drop-shadow-xl hover:drop-shadow-2xl"
                >
                  <IoIosTime />
                  <p className="">
                    <span> : </span>
                    <span className="text-xl font-bold">{item.blockreason !== "" ? "-" : item.hours}</span>
                  </p>
                </button>

                <p className="text-xl text-gray-400 mt-1">Earned Hours</p>
              </div>
            ))}{" "}
            {students.map((item) => (
              <div
                key={item.title}
                className="minwidcard bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl flex m-3 flex-wrap justify-center gap-5 items-center drop-shadow-xl hover:drop-shadow-2xl cursor-pointer"
              >
                <button
                  type="button"
                  className="flex flex-wrap text-yellow-900	 green-600 bg-[#ffb703] ustify-center gap-1 items-center text-2xl opacity-0.9 rounded-full p-4 drop-shadow-xl hover:drop-shadow-2xl"
                >
                  <IoIosTimer />
                  <p className="">
                    <span> : </span>
                    <span className="text-xl font-bold">
                      {item.credithours}
                    </span>
                  </p>
                </button>

                <p className="text-xl text-gray-400 mt-1"> Requsted Hours</p>
              </div>
            ))}{" "}
            {students.map((item) => (
              <div
                key={item.title}
                className="minwidcard bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl flex m-3 flex-wrap justify-center gap-5 items-center drop-shadow-xl hover:drop-shadow-2xl cursor-pointer"
              >
                <button
                  type="button"
                  className="flex flex-wrap text-green-700	 red-600 bg-green-300 justify-center gap-1 items-center text-2xl opacity-0.9 rounded-full p-4 drop-shadow-xl hover:drop-shadow-2xl"
                >
                  <FaChartLine />
                  <p className="">
                    <span> : </span>
                    <span className="text-xl font-bold">
                    {item.blockreason !== "" ? "-" : item.neededHours}
                    </span>
                  </p>
                </button>

                <p className="text-xl text-gray-400 mt-1">Needed Hours</p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="flex gap-10 flex-wrap justify-center">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780">
            <div className="flex justify-between">
              <p className="font-semibold text-xl">EH Progress</p>
            </div> */}
            {/* <div>
              <Stacked width="550px" height="360px" />
            </div> */}
                  <div className="flex flex-col gap-[6.5rem] flex-wrap justify-center p-4">
{DBUser ? (<div className="mt-10 flex flex-col md:flex-row gap-[8.5rem] flex-wrap justify-center chartssGap">
          <LineChart />

          <Pie />
      </div>) : <></>}
      
    </div>
          </div>
        {/* </div>
      </div> */}
      {/* )} */}
    </>
  );
}

export default Dashboard;

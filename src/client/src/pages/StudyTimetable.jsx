import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const StudyTimetable = () => {
  const [data, setData] = useState([]);
  const { DBUser, currentcolor } = useStateContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("DBUser in useEffect:", DBUser); // Log DBUser here

    const fetchData = async () => {
      try {
        if (DBUser !== undefined) {
          console.log("Fetching data for DBUser:", DBUser); // Log DBUser before the fetch
          const response = await fetch(
            `https://njmc.horus.edu.eg/api/hue/portal/v1/StudyTimetable&student_id=${DBUser}`
          );
          const result = await response.json();

          if (Array.isArray(result)) {
            setData(result);
          } else {
            console.error("API response is not an array:", result);
          }
        } else {
          console.error("DBUser is undefined");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [DBUser]);


  useEffect(() => {
    if (DBUser === null) {
      navigate("/dashboard");
    }
  }, [DBUser, navigate]);

  
  const organizedData = Array.isArray(data)
    ? data.reduce((acc, item) => {
        if (!acc[item.day]) {
          acc[item.day] = [];
        }
        acc[item.day].push(item);
        return acc;
      }, {})
    : {};
  const getTypeStyle = (type) => {
    switch (type) {
      case "Lab":
        return "bg-[#f2766d53] opacity-0.3 text-center";
      case "Lecture":
        return "bg-[#2fee582f] opacity-0.3 text-center";
      case "Section":
        return "bg-[#e2fd4a58] opacity-0.3 text-center";
      default:
        return "";
    }
  };
  return (
<div className="mt-8 mx-auto max-w-5xl mb-8">
  {loading ? (
    <Spinner currentcolor={currentcolor} />
  ) : (
    <div className="overflow-x-auto shadow-md sm:rounded-lg StudyTimetable">
      <table className="w-full text-sm text-left text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <thead className="text-xs text-white uppercase bg-[#b88b1a] dark:bg-amber-700 dark:text-gray-100" style={{ backgroundColor: `${currentcolor}` }}>
          <tr>
            <th scope="col" className="px-6 py-3 font-semibold">Subject</th>
            <th scope="col" className="px-6 py-3 font-semibold">From - To</th>
            <th scope="col" className="px-6 py-3 font-semibold">Type</th>
            <th scope="col" className="px-6 py-3 font-semibold">Group</th>
            <th scope="col" className="px-6 py-3 font-semibold">Place</th>
            <th scope="col" className="px-6 py-3 font-semibold">Lecturer</th>
          </tr>
        </thead>
        {Object.entries(organizedData).map(([day, dayData]) => (
          <tbody key={day} className="dark:text-white">
            <tr>
              <td colSpan="6" className="px-6 py-4 font-bold">
                <h2
                  style={{ backgroundColor: `${currentcolor}` }}
                  className="my-4 text-center text-white bg-[#b88b1a] cursor-pointer text-lg opacity-0.9 rounded-full p-2 hover:drop-shadow-xl max-w-[150px] mx-auto"
                >
                  {day}
                </h2>
              </td>
            </tr>
            {dayData.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-gray-100 dark:bg-gray-700 border-y-2	dark:border-gray-600 border-gray-200"
                    : "bg-white dark:bg-gray-800 border-y-2	dark:border-gray-600 border-gray-200"
                }`}
              >
                <td className="px-6 py-4 font-bold">{item.subject}</td>
                <td className="px-6 py-4 font-bold">{`${item.from} - ${item.to}`}</td>
                <td
                  className={`px-6 py-4 font-bold opacity-0.9 text-center md:mt-4 sm:mt-7 ${getTypeStyle(
                    item.type
                  )}`}
                >
                  {item.type}
                </td>
                {/* <td
                  className={`px-6 py-4 font-bold opacity-0.9 text-center md:mt-4 sm:mt-7`}
                >
                  {item.type}
                </td> */}
                <td className="px-6 py-4 font-bold">{item.group}</td>
                <td className="px-6 py-4 font-bold">{item.place}</td>
                <td className="px-6 py-4">
                  {item.faculty_ids.map((facultyName, index) => (
                    <div
                      key={index}
                      className="mb-1 text-black font-bold opacity-0.9 rounded-2xl bg-gray-300 text-center"
                    >
                      {facultyName}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )}
</div>
  )
};
export default StudyTimetable;

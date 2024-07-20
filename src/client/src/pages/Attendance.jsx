import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router";
// 7231681
// 7231335
const Attendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { DBUser, currentcolor } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (DBUser !== undefined) {
          const response = await fetch(
            `https://njmc.horus.edu.eg/api/hue/portal/v1/Attendance&studentID=${DBUser}`
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

  
  const getWarningGrid = (percentage) => {
    if (percentage === 0) {
      return null;
    }

    const num = Math.min(3, Math.max(1, Math.round(percentage)));
    const grid = Array.from({ length: 3 }, (_, index) => (
      <div
        key={index}
        className={`text-white font-bold text-center p-2 ${
          index + 1 <= num ? `bg-red-600 ` : `bg-gray-300`
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    ));
    return <div className="grid grid-cols-3 gap-0">{grid}</div>;
  };

  return (
    <div className="mt-8 mx-auto mb-8 mr-5 ml-10 flex flex-wrap gap-9 AbccSheet">
      {loading ? (
        <Spinner currentcolor={currentcolor} />
      ) : data && data.length > 0 ? (
        data.map((item) => (
          <div
            key={item?.id}
            className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-default"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {item?.subject}
            </h5>
            <p className="font-normal  text-orange-700 green-600 bg-orange-200 items-center text-xl opacity-0.9 rounded-full p-1 hover:drop-shadow-2xl max-w-[100px] text-center dark:text-black">{` ${
              item?.count || 0
            } days`}</p>
            <ul className="list-disc pl-5 mt-2">
              {item?.absencedays?.map((absenceDay, index) => (
                <li
                  key={index}
                  className="font-normal text-red-400 dark:text-red-400"
                >
                  {absenceDay}
                </li>
              ))}
            </ul>
            <p className="font-normal text-gray-700 dark:text-gray-400 my-3">
              {getWarningGrid(item?.percentage)}
            </p>
            <p className="font-normal text-orange-700 dark:text-gray-100 text-center">{` Sessions : ${
              item?.no_of_absence || "N/A"
            }`}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-900 bg-white rounded-xl text-center shadow-md p-4 font-semibold text-lg max-w-[60vw] m-auto mt-[100px]">
          {data && data.message
            ? data.message
            : "No attendance data available."}
        </p>
      )}
    </div>
  );
};

export default Attendance;

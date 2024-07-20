import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router";

const ExamTimetable = () => {
  const [data, setData] = useState([]);
  const { DBUser, currentcolor } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (DBUser) {
          const response = await fetch(
            `https://njmc.horus.edu.eg/api/hue/portal/v1/ExamTimetable&student_id=${DBUser}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const result = await response.json();
          setData(result);
        } else {
          throw new Error("DBUser is undefined");
        }
      } catch (error) {
        setError(error.message);
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

  // Organize data by days
  const organizedData = Array.isArray(data)
    ? data.reduce((acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
      }, {})
    : {};

  return (
    <div className="mt-8 mx-auto max-w-5xl mb-8">
      {loading ? (
        <Spinner currentcolor={currentcolor} />
      ) : Object.keys(organizedData).length === 0 ? (
        <p className="text-gray-900 bg-white rounded-xl text-center shadow-md p-4 font-semibold text-lg max-w-[50vw] m-auto mt-[100px]">
          Thare is no exams
        </p>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg StudyTimetable">
          {Object.entries(organizedData)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB)) // Sort entries by date
            .map(([date, dayData]) => (
              <div key={date} className="">
                <h2
                  style={{ backgroundColor: `${currentcolor}` }}
                  className="font-bold my-4 text-center text-white bg-[#b88b1a] cursor-pointer text-lg opacity-0.9 rounded-full p-2 hover:drop-shadow-xl max-w-[150px] mx-auto"
                >
                  {date}
                </h2>
                <table className="w-full text-sm text-left text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg overflow-hidden ">
                  <thead className="text-xs text-white uppercase bg-[#b88b1a] dark:bg-amber-700 dark:text-gray-400 ">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 font-semibold text-center"
                      >
                        Subject
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 font-semibold text-center"
                      >
                        Day
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3  font-semibold text-center"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 font-semibold text-center"
                      >
                        From - To
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 font-semibold text-center"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 font-semibold text-center"
                      >
                        SeatNo.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 font-semibold text-center"
                      >
                        Place
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayData &&
                      dayData.map((item, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0
                              ? "bg-gray-100 dark:bg-gray-700"
                              : "bg-white dark:bg-gray-800 "
                          }`}
                        >
                          <td className="px-6 py-4 font-bold text-center">
                            {item.subject}
                          </td>
                          <td className="px-6 py-4 font-bold text-center">
                            {item.day}
                          </td>

                          <td className={`px-6 py-4 font-bold text-center`}>
                            {item.date}
                          </td>
                          <td className="px-6 py-4 font-bold text-center">{`${item.from} - ${item.to}`}</td>
                          <td className="px-6 py-4 font-bold text-center">
                            {item.type}
                          </td>
                          <td className="px-6 py-4 font-bold text-center">
                            {item.seatno}
                          </td>
                          <td className="px-6 py-4 font-bold text-center">
                            {item.place}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ExamTimetable;

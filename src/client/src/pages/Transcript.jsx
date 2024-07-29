import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router";

const Transcript = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { DBUser, currentcolor } = useStateContext();
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [subjectsData, setSubjectsData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  // 2221545
  // 2181094
  // useEffect(() => {

  // }, [DBUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (DBUser !== undefined) {
          const response = await fetch(
            `https://njmc.horus.edu.eg/api/hue/portal/v1/Transcript/${DBUser}`
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
      }
    };

    
    const fetchFirstApi = async () => {
      try {
        const response = await fetch(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/current`
        );
        const result = await response.json();
        const idCurUpdateStudent = result.UpdateStudent;
        const isCheckedValue = idCurUpdateStudent === true ? true : false;
        if (isCheckedValue === true) {
          // If the value from the first API is true, fetch the next two APIs
          await Promise.all([fetchSecondApi(), fetchThirdApi()]);
        } else {
          console.log("Value is false, skipping next APIs");
          fetchData();
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching first API:", error);
      }
    };

    const fetchSecondApi = async () => {
      try {
        // Fetch second API
        const response = await fetch(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/CurrentSemesters&student_id=${DBUser}`
        );
        const result = await response.json();
        console.log(result, "fetchSecondApi");
      } catch (error) {
        console.error("Error fetching second API:", error);
      }
    };

    const fetchThirdApi = async () => {
      try {
        // Fetch third API
        const response = await fetch(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/CurrentTranscript&student_id=${DBUser}`
        );
        const result = await response.json();
        console.log(result, "fetchThirdApi");
      } catch (error) {
        console.error("Error fetching third API:", error);
      } finally {
        setLoading(false);
        fetchData(); // Call fetchData after fetchThirdApi completes
      }
    };

    fetchFirstApi();
  }, [DBUser]);
  useEffect(() => {
    if (DBUser === null) {
      navigate("/dashboard");
    }
  }, [DBUser, navigate]);

  const extractAcademicYear = (academicYear) => {
    return academicYear.replace("Academic Year: ", "");
  };
  const extractGradeP = (PP) => {
    return PP.replace(/PP/g, "P")
      .replace(/NPNP/g, "NP")
      .replace(/PCPC/g, "PC")
      .replace(/FCFC/g, "FC");
  };
  function removeSpecialCharacters(inputString) {
    // Regular expression to match non-English characters
    const regex = /[^a-zA-Z0-9 \s]/g;
    // Replace non-English characters with an empty string
    return inputString.replace(regex, "");
  }
  function extractGrade(inputString) {
    // Split the string based on the "|" character
    const parts = inputString.split("|");

    // Get the second part of the split string, which contains "C+"
    const desiredPart = parts[1];

    return desiredPart;
  }
  const groupDataByAcademicYear = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      if (!groupedData[item.AcadYearName]) {
        groupedData[item.AcadYearName] = [];
      }
      groupedData[item.AcadYearName].push(item);
    });
    return groupedData;
  };

  const handleCardClick = (semester) => {
    setSelectedSemester(semester);
    fetchSubjectsData(semester.subjects);
  };

  const handleCloseModal = () => {
    setSelectedSemester(null);
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click occurred outside of the popup
      if (selectedSemester && !event.target.closest(".bg-white")) {
        setSelectedSemester(null);
      }
    };

    // Add event listener to the document
    document.addEventListener("click", handleOutsideClick);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [selectedSemester]);

  const fetchSubjectsData = async (subjects) => {
    const promises = subjects.map(async (subject) => {
      try {
        const response = await fetch(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/Transcript/${DBUser}`
        );
        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error fetching subject data:", error);
        return null;
      }
    });

    const subjectsData = await Promise.all(promises);
    setSubjectsData(subjectsData);
  };
  if (loading) {
    return <Spinner currentcolor={currentcolor} />;
  }

  return (
    <div className="mt-8 mx-auto mb-8 mr-5 ml-10 flex flex-wrap gap-9 transCard">
      {data && data.length > 0 ? (
        Object.entries(groupDataByAcademicYear(data))
          .sort(([academicYearA], [academicYearB]) => {
            const yearA = parseInt(academicYearA.split(" ")[2]);
            const yearB = parseInt(academicYearB.split(" ")[2]);
            return yearB - yearA;
          })
          .map(([academicYear, semesters]) => (
            <div key={academicYear}>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                {academicYear}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ">
                {semesters.map((semester) => (
                  <div
                    key={semester?.FKid}
                    className={`max-w-[360px] min-w-[340px] p-9 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer relative ${
                      semester.blocked ? 'dark:opacity-80 pointer-events-none opacity-80 dark:bg-gray-800' : ''
                    }`}
                    onClick={() => {
                      if (!semester.blocked) {
                        handleCardClick(semester);
                      }
                    }
                    }      
                                >
                    <h5 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {removeSpecialCharacters(semester?.SemesterName)}
                    </h5>
  
                    <div className="flex flex-nowrap gap-2">
                      <h2 className="text-lg md:text-xl mb-2 md:mb-4 bg-indigo-100 text-indigo-800 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300 max-w-[140px]">
                        Subjects: {semester.subjects.length}
                      </h2>
                      <h5 className="mb-2 text-sm font-extrabold text-gray-900 dark:text-white p-2">
                        {extractAcademicYear(semester?.AcadYearName)}
                      </h5>
                    </div>
                    <hr />
                    <br />
                    <div className="flex flex-nowrap gap-2">
                      <p className="bg-yellow-100 text-yellow-800 text-sm font-bold me-1 px-1 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                        CGPA:{" "}
                        {semester.currentgpa ? semester.currentgpa.toFixed(2) : "-"}{" "}
                      </p>
                      <p className="bg-blue-100 text-blue-800 text-sm font-bold me-1 px-1 py-0.5 rounded dark:bg-gray-700 dark:text-blue-300 border border-blue-300">
                        SGPA:{" "}
                        {semester.semestergpa ? semester.semestergpa.toFixed(2) : "-"}
                      </p>
                      <p className="bg-green-100 text-green-800 text-sm font-bold me-1 px-1 py-0.5 rounded dark:bg-gray-700 dark:text-green-300 border border-green-300">
                        E.Hours: {semester.semesterhr || "-"}
                      </p>
                    </div>
                    {semester.blocked && (
                      <p className="bg-red-100 text-red-800 text-sm font-bold px-1 py-0.5 rounded dark:bg-gray-700 dark:text-red-300 border border-red-300 mt-2">
                        Blocked Reason: {semester.blockReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
      ) : (
        
          
            <p className="text-gray-900 bg-white rounded-xl text-center shadow-md p-4 font-semibold text-lg max-w-[50vw] m-auto mt-[100px]">
            No Transcript data available for you
          </p>
           
           
        
      )}
  
      {selectedSemester && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center dark:text-white margin30Px">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-5xl p-6 md:p-10 mt-10 relative">
            <div className="flex gap-4 flex-wrap">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                {removeSpecialCharacters(selectedSemester.SemesterName)}
              </h2>
              <h2 className="text-lg md:text-xl mb-2 md:mb-4 bg-indigo-100 text-indigo-800 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300 max-w-[140px]">
                Subjects: {selectedSemester.subjects.length}
              </h2>
            </div>
  
            <div className="flex flex-nowrap gap-2">
              <p className="bg-yellow-100 text-yellow-800 text-sm font-bold me-1 px-1 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                CGPA:{" "}
                {typeof selectedSemester?.currentgpa === "number"
                  ? selectedSemester.currentgpa.toFixed(2)
                  : "-"}{" "}
              </p>
              <p className="bg-blue-100 text-blue-800 text-sm font-bold me-1 px-1 py-0.5 rounded dark:bg-gray-700 dark:text-blue-300 border border-blue-300">
                SGPA:{" "}
                {typeof selectedSemester?.semestergpa === "number"
                  ? selectedSemester.semestergpa.toFixed(2)
                  : "-"}{" "}
              </p>
              <p className="bg-green-100 text-green-800 text-sm font-bold me-1 px-1 py-0.5 rounded dark:bg-gray-700 dark:text-green-300 border border-green-300">
                E.Hours: {selectedSemester?.semesterhr || "-"}
              </p>
            </div>
            <div
              className={`${
                selectedSemester.subjects.length > 5 ? "overflow-y-auto" : ""
              } overflow-x-auto`}
            >
              <table className="w-full table-auto font-semibold">
                <thead>
                  <tr>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-base md:text-lg font-semibold">
                      Code
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-base md:text-lg font-semibold">
                      Subject Name
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-base md:text-lg font-semibold">
                      Credit
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-base md:text-lg font-semibold">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSemester.subjects.map((subject, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-gray-100 dark:bg-gray-700 text-center"
                          : "bg-white dark:bg-gray-800 text-center"
                      }`}
                    >
                      <td className="px-3 md:px-4 py-2 md:py-3 text-base md:text-lg">
                        {subject.subject_code || "-"}
                      </td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-base md:text-lg">
                        {subject.subject_name || "-"}
                      </td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-base md:text-lg">
                        {subject.credithours || "-"}
                      </td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-base md:text-lg">
                        {subject.grade
                          ? extractGradeP(extractGrade(subject.grade)) || "-"
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="absolute top-2 right-2 mt-3 mr-3 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-4 py-2 text-center"
              onClick={handleCloseModal}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Transcript;

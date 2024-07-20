import React, { useEffect, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router";
// 3161053
// 5191484
function Progress() {
  const { CurrCourseId, DBUser, currentcolor } = useStateContext();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transcriptData, setTranscriptData] = useState({});
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/Progress/${CurrCourseId}`
        );
        const data = await response.json();
        setProgressData(data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    const fetchTranscriptData = async () => {
      try {
        const response = await fetch(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/Transcript/${DBUser}`
        );
        const data = await response.json();
        setTranscriptData(data);
      } catch (error) {
        console.error("Error fetching transcript data:", error);
      }
    };

    fetchProgressData();
    fetchTranscriptData();
  }, []);
  useEffect(() => {
    if (DBUser === null) {
      navigate("/dashboard");
    }
  }, [DBUser, navigate]);
  const subjectsWithAcademicYears = [];

  if (typeof transcriptData === "object" && transcriptData !== null) {
    // Check if transcriptData is an array
    if (Array.isArray(transcriptData)) {
      // Iterate over each item in the array
      transcriptData.forEach((transcript) => {
        processTranscript(transcript);
      });
    } else {
      // If transcriptData is not an array, assume it's a single object
      processTranscript(transcriptData);
    }
  }

  function processTranscript(transcript) {
    // Check if the transcript has the necessary properties
    if (transcript.subjects && Array.isArray(transcript.subjects)) {
      // Iterate over each subject in the subjects array
      transcript.subjects.forEach((subject) => {
        const existingSubjectIndex = subjectsWithAcademicYears.findIndex(
          (item) => item.subjectName === subject.subject_name
        );
        const academicYear = transcript.AcadYearName;
        const semester = transcript.SemesterName;

        const subjectInfo = {
          subjectName: subject.subject_name,
          academicYears: [{ semester, year: academicYear }],
          grade: [], // Initialize an empty array to store grades
          taken: `${semester} - ${academicYear} `, // Combine academic year and semester
        };

        if (subject.grade) {
          // If subject has a grade, add it to the grades array
          if (!Array.isArray(subjectInfo.grade)) {
            subjectInfo.grade = [];
          }
          subjectInfo.grade.push(subject.grade);
        }

        if (existingSubjectIndex !== -1) {
          // Subject already exists in the array, update the academicYears array
          subjectsWithAcademicYears[existingSubjectIndex].academicYears.push({
            semester,
            year: academicYear,
          });
          // Add grade to the existing subject's grades array
          if (subject.grade) {
            if (
              !Array.isArray(
                subjectsWithAcademicYears[existingSubjectIndex].grade
              )
            ) {
              subjectsWithAcademicYears[existingSubjectIndex].grade = [];
            }
            subjectsWithAcademicYears[existingSubjectIndex].grade.push(
              subject.grade
            );
          }
        } else {
          // Subject doesn't exist in the array, add it
          subjectsWithAcademicYears.push(subjectInfo);
        }
      });
    }
  }

  // Sort the academic years and semesters
  subjectsWithAcademicYears.forEach((subject) => {
    subject.academicYears.sort((a, b) => {
      // Split the academic year strings to extract the end year
      const endYearA = parseInt(a.year.split("-")[1]);
      const endYearB = parseInt(b.year.split("-")[1]);
      // If end years are equal, compare semesters
      if (endYearA === endYearB) {
        const semesterA = a.semester.toLowerCase();
        const semesterB = b.semester.toLowerCase();
        if (semesterA === semesterB) {
          return 0;
        }
        return semesterA < semesterB ? -1 : 1;
      }
      // Compare end years
      return endYearA - endYearB;
    });
  });

  // Get the last (latest) academic year with semester
  const sortedByAcademicYear = subjectsWithAcademicYears.map((subject) => {
    const modifiedGrade = subject.grade; // Modify the grade using the extractGradeP function
    const latestAcademicYear = subject.academicYears[subject.academicYears.length - 1];
    // console.log(latestAcademicYear);
    // Add a comma before each item in the modified grade array
    const modifiedGradeWithComma = modifiedGrade.map((gradeItem) => `${gradeItem}`);

    return {
      subjectName: subject.subjectName,
      academicYears: subject.academicYears,
      grade: modifiedGradeWithComma, // Replace the grade property with the modified grade
      taken: latestAcademicYear ? `${latestAcademicYear.semester} - ${latestAcademicYear.year}` : "",
    };
  });
  
  // console.log(sortedByAcademicYear);
  

  const subjectsAndGrades = [];

  if (typeof transcriptData === "object" && transcriptData !== null) {
    // Iterate over the properties of the object
    for (const key in transcriptData) {
      if (Object.hasOwnProperty.call(transcriptData, key)) {
        const transcript = transcriptData[key];
        const academicYears = Array.isArray(transcript.AcadYearName)
          ? transcript.AcadYearName
          : [transcript.AcadYearName];
        const sortedAcademicYears = academicYears.sort((b, a) => {
          const endYearA = parseInt(a.split("-")[1]);
          const endYearB = parseInt(b.split("-")[1]);
          return endYearA - endYearB;
        });
        // console.log([transcript.AcadYearName]);
        // Get the latest academic year
        const latestAcademicYear =
          sortedAcademicYears[sortedAcademicYears.length - 1];

        if (transcript.subjects && Array.isArray(transcript.subjects)) {
          // Iterate over each subject in the subjects array
          transcript.subjects.forEach((subject) => {
            const existingSubjectIndex = subjectsAndGrades.findIndex(
              (item) => item.subjectName === subject.subject_name
            );
            const grade = subject.grade;
            const semester = transcript.SemesterName;

            const subjectAndGrade = {
              subjectName: subject.subject_name,
              grade: grade,
              taken: latestAcademicYear,
              semester: semester,
            };
            // console.log(grade, 'grade');
            // console.log(subjectAndGrade, 'subjectAndGrade');
            // subjectsAndGrades.push(subjectAndGrade)
            if (existingSubjectIndex !== -1) {
              // Subject already exists in the array, update the grade
              if (grade !== "") {
                if (
                  !Array.isArray(subjectsAndGrades[existingSubjectIndex].grade)
                ) {
                  subjectsAndGrades[existingSubjectIndex].grade = [
                    subjectsAndGrades[existingSubjectIndex].grade,
                  ];
                }
                subjectsAndGrades[existingSubjectIndex].grade.push(grade);
              }
            } else {
              // Subject doesn't exist in the array, add it
              subjectsAndGrades.push(subjectAndGrade);
            }
          });
        }
      }
    }
  }
  const extractGradeP = (PP) => {
    return PP.replace(/PP/g, ", P")
    .replace(/[^A-Za-z0-9+\-,]/g, "")
      .replace(/NPNP/g, "NP")
      .replace(/PCPC/g, "PC")
      .replace(/FCFC/g, "FC")
      .replace(/FRFR/g, "FR")
      .replace(/PP/g, "P")
      .replace(/\+([A-Z])\+/g, "$1+") 
      .replace(/\-([A-Z])\-/g, "$1-") 
      .replace(/\bAb\b/g, "Abs")

  };
  const extractsemester = (PP) => {
    return PP.replace(/[^A-Za-z0-9+\-]/g, "").replace(/AcademicYear/g, "");
  };
  const getGradeAndStatus = (subjectName) => {
    // Initialize default grade and status
    let grade = "";
    let status = "";

    // Check if subjectsAndGrades is an array
    if (Array.isArray(sortedByAcademicYear)) {
      // Iterate over each item in subjectsAndGrades
      for (const item of sortedByAcademicYear) {
        // Check if the current item's subjectName matches the input subjectName
        if (item.subjectName === subjectName) {
          // Check if grade is an array and convert it to a string with comma separated values
          if (Array.isArray(item.grade)) {
            grade = item.grade.join(" , ");
          } else {
            grade = item.grade || "";
          }
          if (!grade.match(/[BCADP]/)) {
            status = "";
          } else {
            status = item.taken || "";
          }
          // No need to continue iteration if we've found a match
          break;
        }
      }
    }

    // Return grade and status
    return { grade, status };
  };



  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!progressData) {
    return <Spinner currentcolor={currentcolor} />;
  }
  return (
    <div className="mt-8 mx-auto max-w-6xl mb-8 margin100Px">
    <div className="py-4 dark:bg-gray-800 mx-auto my-4 ">
      <h2 className="text-lg font-bold mb-4 text-center dark:text-white">
        Progress 
      </h2>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full table-auto border-collapse shadow-md dark:border-gray-700 dark:text-white ">
          <thead className="text-xs text-white uppercase bg-[#b88b1a] dark:bg-amber-700 dark:text-gray-100" style={{ backgroundColor: `${currentcolor}` }}>
            <tr>
              <th className="w-1/8 px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
                Code
              </th>
              <th className="w-2/8 px-4 py-3 text-center sm:w-1/4 md:w-2/8 lg:w-2/8">
                Subject
              </th>
              <th className="w-1/8 px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
                Level
              </th>
              <th className="w-1/8 px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
                CH
              </th>
              <th className="w-2/8 px-4 py-3 text-center sm:w-1/4 md:w-2/8 lg:w-2/8">
                Pre Req
              </th>
              <th className="w-1/8 px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
                Type
              </th>
              <th className="w-1/8 px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
                Done
              </th>
              <th className="w-1/8 px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
                Grade
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
  {progressData
    .slice() // Create a shallow copy of the array to avoid mutating the original
    .sort((a, b) => a.level - b.level) // Sort the array by the 'level' property
    .map((item, index) => (
      <tr
        key={index}
        className={
          index % 2 === 0
            ? "bg-gray-100 dark:bg-gray-800"
            : "bg-white dark:bg-gray-700"
        }
      >
        <td className="px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
          {item.code}
        </td>
        <td className="px-4 py-3 text-center sm:w-1/4 md:w-1/4 lg:w-2/8">
          {item.name}
        </td>
        <td className="px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
          {item.level}
        </td>
        <td className="px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
          {item.credithours}
        </td>
        <td className="px-4 py-3 text-center sm:w-1/4 md:w-1/4 lg:w-2/8">
          {item.prerequisitesName.map((prerequisite, index) => (
            <div key={index}>{prerequisite}</div>
          ))}{" "}
        </td>
        <td className="px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
          {item.type}
        </td>
        <td className="px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
          {extractsemester(getGradeAndStatus(item.name).status)}
        </td>
        <td className="px-4 py-3 text-center sm:w-1/6 md:w-1/6 lg:w-1/6">
          {extractGradeP(getGradeAndStatus(item.name).grade)}
        </td>{" "}
      </tr>
    ))}
</tbody>

        </table>
      </div>
    </div>
    </div>
  );
}

export default Progress;

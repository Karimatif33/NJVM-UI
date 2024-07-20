const axios = require('axios'); // Import Axios for making HTTP requests
const { pool } = require("../../db/dbConnect");
const { fetchAndStoreBlockReasons } = require('../../controller/StudentCheckBlockCtr');
async function fetchStudentByCode(id) {
  const query = `
    SELECT 
      StudentSemesters.students.studentid, 
      StudentSemesters.students.id, 
      StudentSemesters.students.courseid,
      StudentSemesters.students.acadyear, 
      StudentSemesters.students.semester, 
      StudentSemesters.students.semestergpa,
      StudentSemesters.students.semesterhr,
      StudentSemesters.students.currentgpa,
      StudentSemesters.students.finalgrade,
      StudentSemesters.students.blocked,
      AcadYearData.acadyeardata.name AS acad_year_name,
      SemesterData.semesterdata.name AS SemesterName,
      StudentTranscript.students.fk AS f_k,
      StudentTranscript.students.subjectid,
      StudentTranscript.students.grade,
      GradesData.gradesdata.name As grade_name,
      CourseSubjects.subjects.name AS subject_name,
      CourseSubjects.subjects.code AS subject_code,
      CourseSubjects.subjects.credithours AS credithours
    FROM StudentSemesters.students
    LEFT JOIN CourseData.courses ON StudentSemesters.students.courseid = CourseData.courses.id
    LEFT JOIN AcadYearData.acadyeardata ON StudentSemesters.students.acadyear = AcadYearData.acadyeardata.id
    LEFT JOIN SemesterData.semesterdata ON StudentSemesters.students.semester = SemesterData.semesterdata.id
    LEFT JOIN StudentTranscript.students ON StudentSemesters.students.id = StudentTranscript.students.fk
    LEFT JOIN CourseSubjects.subjects ON StudentTranscript.students.subjectid = CourseSubjects.subjects.id
    LEFT JOIN GradesData.gradesdata ON  StudentTranscript.students.grade = GradesData.gradesdata.id
    WHERE StudentSemesters.students.studentid = $1;
  `;

  const queryBlockTime = `
  SELECT av.selectedacadyearvalue, av.selectedacadyearName, ot.selectedSemesterValue, ot.selectedSemesterName
  FROM Acad_year.BlockTime AS av
  INNER JOIN Cur_Semester.BlockTime AS ot ON av.id = ot.id;
`;

  const client = await pool.connect();
  const result = await client.query(queryBlockTime);
  const selectedacadyearvalue = result.rows[0].selectedacadyearvalue; // Access the value of the id column from the first row
  const selectedsemestervalue = result.rows[0].selectedsemestervalue; // Access the value of the id column from the first row

  // console.log(selectedacadyearvalue, selectedsemestervalue);
  try {
    let blockReason = "";

    if (id === null || isNaN(id)) {
      id = 0;
    } else {
      id = parseInt(id);
      // console.log("Fetching data for id:", id);
      // console.log("test tran", id)
      try {
        // console.log("Fetching block reason for student id:", id);
        // const blockReasonResponse = await axios.get(`https://njmc.horus.edu.eg/api/hue/portal/v1/StudentCheckBlock?student_id=${id}`);
        // console.log("Block reason response:", blockReasonResponse.data); // Log the response data
    
        // if (Array.isArray(blockReasonResponse.data) && blockReasonResponse.data.length > 0) {
        //     blockReason = blockReasonResponse.data[0].blockreason || "";
        // }
    } catch (error) {
        // console.error("Error fetching block reason:", error.message);
    }
    
    }

    const result = await client.query(query, [id]);
    const uniqueData = [];
    const uniqueFKIDs = new Set();

    result.rows.forEach((row) => {
      const FKid = row.id;
      const AcadYear = row.acadyear
      const semester = row.semester
      const blockReasonForFKid = (AcadYear === selectedacadyearvalue && semester === selectedsemestervalue) ? blockReason : "";

      if (!uniqueFKIDs.has(FKid)) {
        uniqueFKIDs.add(FKid);
        const subjects = result.rows
          .filter((r) => r.f_k === row.f_k)
          .map((r) => ({ subject_name: r.subject_name, grade: r.grade_name, subject_code: r.subject_code, credithours: r.credithours }));

        // Prepare semester data
        const semesterData = {
          StuId: row.studentid,
          FKid: FKid,
          course: row.courseid,
          AcadYearName: row.acad_year_name,
          AcadYear: AcadYear,
          semester: semester,
          SemesterName: row.semestername,
          semestergpa: blockReasonForFKid !== "" ? "" : row.semestergpa,
          semesterhr: blockReasonForFKid !== "" ? "" : row.semesterhr,
          currentgpa: blockReasonForFKid !== "" ? "" : row.currentgpa,
          finalgrade: blockReasonForFKid !== "" ? "" : row.finalgrade,
          blocked: blockReasonForFKid !== "" ? true : false, // Set to true if blockReasonForFKid is not empty
          blockReason: blockReasonForFKid, // Use blockReasonForFKid instead of blockReason
          subjects: blockReasonForFKid !== "" ? [] : subjects,
        };

        uniqueData.push(semesterData);
        // console.log(semesterData)
      }
    });

    client.release();
    // console.log("client release");;

    return uniqueData;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
}

module.exports = { fetchStudentByCode };

const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
require("dotenv").config();
exports.fetshingCurrentSemestersCourse = AsyncHandler(async (req, res) => {
  const client = await connect();

  const query = `
      SELECT av.selectedacadyearvalue, av.selectedacadyearName, ot.selectedSemesterValue, ot.selectedSemesterrName
      FROM Acad_year.Acad_year_Value AS av
      INNER JOIN Cur_Semester.Semester AS ot ON av.id = ot.id;
    `;

  const result = await client.query(query);
  const selectedacadyearvalue = result.rows[0].selectedacadyearvalue; // Access the value of the id column from the first row
  const selectedsemestervalue = result.rows[0].selectedsemestervalue; // Access the value of the id column from the first row

  console.log("ID value:", selectedsemestervalue);


  let courseId = req.params.courseId;
  if (courseId === null || isNaN(courseId)) {
    courseId = 0;
  } else {
    courseId = parseInt(courseId);
  }
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUECurrentSemesters?index=StudentCurrentSemesters&course_id=${courseId}&curr_academic_year=${selectedacadyearvalue}&curr_semester=${selectedsemestervalue}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from API. Status: ${response.status}`
      );
    }
    const apiData = await response.json();

    const students = apiData.students;

    // Connect to the database
    const SchemaAndTable = "StudentSemesters.students";

    try {
      for (const item of students) {
        const IDValue = item.ID;
        const StudentIDValue = item.StudentID;
        const CourseIDValue = item.CourseID;
        const AcadYearValue = item.AcadYear;
        const SemesterValue = item.Semester;
        const SemesterGPAValue =
          typeof item.SemesterGPA === "number"
            ? Number(item.SemesterGPA.toFixed(2))
            : null;
        const SemesterHRValue = item.SemesterHR || null;
        const CurrentGPAValue =
          typeof item.CurrentGPA === "number"
            ? Number(item.CurrentGPA.toFixed(2))
            : null;

        const final_gradeValue = item.final_grade;
        const blockedValue = item.blocked;

        // console.log(nameValue, IDValue);

        const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, StudentID, CourseID, AcadYear, Semester, SemesterHR, SemesterGPA,  CurrentGPA, FinalGrade, Blocked) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (ID) DO UPDATE
        SET 
        StudentID = $2,
        CourseID = $3,
        AcadYear = $4,
        Semester = $5,
        SemesterHR = $6,
        SemesterGPA = $7,
        CurrentGPA = $8,
        FinalGrade = $9,
        Blocked = $10;
      `;

        await client.query(insertQuery, [
          IDValue,
          StudentIDValue,
          CourseIDValue,
          AcadYearValue,
          SemesterValue,
          SemesterHRValue,
          SemesterGPAValue,
          CurrentGPAValue,
          final_gradeValue,
          blockedValue,
        ]);
        console.log("Data inserted into the database successfully");
      }

      // Select data based on the provided StuId
      //     const selectQuery = `
      //   SELECT StudentSemesters.students.*
      //   FROM StudentSemesters.students
      //   WHERE StudentSemesters.students.StudentID = $1;
      // `;

      //     const result = await client.query(selectQuery, [StuId]);
      const selectQuery = "SELECT * FROM StudentSemesters.students";
      const result = await client.query(selectQuery);
      res.json(result.rows);
      client.release();
      return { status: "success" };
    } catch (error) {
      console.error(`Error fetching data from ${apiUrl}:`, error.message);
      return { status: "fail", error: `Error fetching data from ${apiUrl}` };
    }
  } finally {
    // console.log("client release");;
  }
});

const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/StudentTranscriptSchema");
require("dotenv").config();
exports.fetshingStudentTranscript = AsyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUETranscript?index=StudentTranscript&course_id=${courseId}`;

  try {
    // Call the function to create schema and table before fetching data
    await createSchemaAndTable();
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from API. Status: ${response.status}`
      );
    }
    const apiData = await response.json();

    const students = apiData.students;

    // Connect to the database
    const client = await connect();
    const SchemaAndTable = "StudentTranscript.students";
    const deleteAllByStuIdQuery = `
    DELETE FROM ${SchemaAndTable}
    WHERE courseid = $1;
  `;
    await client.query(deleteAllByStuIdQuery, [courseId]);
    function createIncrementFunction() {
      let count = 0;

      return function () {
        count++;
        return count;
      };
    }

    const increment = createIncrementFunction();
    try {
      for (const item of students) {
        const IDValue = increment();
        const StudentIDValue = item.StudentID;
        const SubjectIDValue = item.SubjectID;
        const CourseIDValue = item.CourseID;
        const SubjectCHValue = item.SubjectCH;
        const AcadYearValue = item.AcadYear;
        const SemesterValue = item.Semester;
        const GradeValue = item.Grade;
        const hidegradeValue = item.hidegrade;
        const FKValue = item.FK;

        // console.log(nameValue, IDValue);

        // Insert data into the database (replace 'Levels' with your actual table name)
        const insertQuery = `
          INSERT INTO ${SchemaAndTable} (ID, StudentID, SubjectID, CourseID, SubjectCH, AcadYear, Semester, Grade, hidegrade, FK) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (ID) DO UPDATE
          SET 
          StudentID = $2,
          SubjectID = $3,
          CourseID = $4,
          SubjectCH = $5,
          AcadYear = $6,
          Semester = $7,
          Grade = $8,
          hidegrade = $9,
          FK = $10;
      `;

        await client.query(insertQuery, [
          IDValue,
          StudentIDValue,
          SubjectIDValue,
          CourseIDValue,
          SubjectCHValue,
          AcadYearValue,
          SemesterValue,
          GradeValue,
          hidegradeValue,
          FKValue,
        ]);
        console.log("Data inserted into the database successfully");
      }

      // Select all data from the 'levels' table
      const selectQuery = "SELECT * FROM StudentTranscript.students";
      const result = await client.query(selectQuery);

      // Return the retrieved data as JSON
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

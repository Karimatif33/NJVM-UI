const { connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
require("dotenv").config();
exports.fetshingCurrentTranscriptCourse = AsyncHandler(async (req, res) => {
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

  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUECurrentTranscript?index=StudentCurrentTranscript&course_id=${courseId}&curr_academic_year=${selectedacadyearvalue}&curr_semester=${selectedsemestervalue}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from API. Status: ${response.status}`
      );
    }

    const apiData = await response.json();
    const students = apiData.students;

    function createRandomNumberFunction() {
      return function () {
        // Generate a random number between 1000000 and 9999999
        return Math.floor(Math.random() * 100000000);
      };
    }
    const increment = createRandomNumberFunction();

    const SchemaAndTable = "StudentTranscript.students";

    try {
      // Array to store all deletion promises
      const deletionPromises = [];

      for (const item of students) {
        const FKValue = item.FK;

        try {
          const deleteAllByStuIdQuery = `
        DELETE FROM ${SchemaAndTable}
        WHERE fk = $1;
      `;
          // Create a promise for each deletion operation and add it to the array
          const deletePromise = client.query(deleteAllByStuIdQuery, [FKValue]);
          deletionPromises.push(deletePromise);
          console.log("Deleting existing records for student:", FKValue);
        } catch (err) {
          console.log("Error deleting existing records:", err);
          // Continue to the next iteration if an error occurs during deletion
          continue;
        }
      }

      // Wait for all deletion promises to resolve before proceeding with insertions
      await Promise.all(deletionPromises);

      console.log("All existing records deleted successfully");

      for (const item of students) {
        const IDValue = increment();
        const StudentIDValue = item.StudentID;
        const SubjectIDValue = item.SubjectID;
        const CourseIDValue = item.CourseID;
        const SubjectCHValue = item.SubjectCH;
        const AcadYearValue = item.AcadYear;
        const SemesterValue = item.Semester;
        const GradeValue = item.Grade === null ? null : item.Grade;
        const hidegradeValue = item.hidegrade;
        const FKValue = item.FK;

        // Insert data into the database
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

        console.log(
          "Data inserted into the database successfully for student:",
          FKValue
        );
      }

      // Commit the transaction after all data is inserted

      // Select data based on the provided StuId
      const selectQuery = `
        SELECT StudentTranscript.students.*
        FROM StudentTranscript.students
        WHERE StudentTranscript.students.courseid = $1;
      `;

      const result = await client.query(selectQuery, [courseId]);
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

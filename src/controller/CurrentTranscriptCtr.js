const { connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
require("dotenv").config();

exports.fetshingCurrentTranscript = AsyncHandler(async (req, res) => {
  const client = await connect();

  const query = `
    SELECT av.selectedacadyearvalue, av.selectedacadyearName, ot.selectedSemesterValue, ot.selectedSemesterrName
    FROM Acad_year.Acad_year_Value AS av
    INNER JOIN Cur_Semester.Semester AS ot ON av.id = ot.id;
  `;

  const result = await client.query(query);
  const selectedacadyearvalue = result.rows[0].selectedacadyearvalue;
  const selectedsemestervalue = result.rows[0].selectedsemestervalue;

  console.log("ID value:", selectedsemestervalue);

  const StuId = req.params.StuId;
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUECurrentTranscript?index=StudentCurrentTranscript&student_id=${StuId}&curr_academic_year=${selectedacadyearvalue}&curr_semester=${selectedsemestervalue}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch data from API. Status: ${response.status}. Error: ${errorText}`);
      return res.status(response.status).json({ error: `Failed to fetch data from API. Status: ${response.status}. Error: ${errorText}` });
    }

    const apiData = await response.json();
    const students = apiData.students;

    function createRandomNumberFunction() {
      return function () {
        return Math.floor(Math.random() * 100000000);
      };
    }
    const increment = createRandomNumberFunction();
    const SchemaAndTable = "StudentTranscript.students";
    const deleteAllByStuIdQuery = `
      DELETE FROM ${SchemaAndTable}
      WHERE StudentID = $1;
    `;
    await client.query(deleteAllByStuIdQuery, [StuId]);

    try {
      for (const item of students) {
        const IDValue = increment();
        const StudentIDValue = item.StudentID;
        const SubjectIDValue = item.SubjectID;
        const CourseIDValue = item.CourseID;
        const SubjectCHValue = item.SubjectCH;
        const AcadYearValue = item.AcadYear;
        const SemesterValue = item.Semester;
        const GradeValue = item.Grade === false ? null : item.Grade;
        const hidegradeValue = item.hidegrade;
        const FKValue = item.FK;

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

      const selectQuery = `
        SELECT StudentTranscript.students.*
        FROM StudentTranscript.students
        WHERE StudentTranscript.students.StudentID = $1;
      `;

      const result = await client.query(selectQuery, [StuId]);
      res.json(result.rows);
      client.release();
      return { status: "success" };
    } catch (error) {
      console.error(`Error inserting/updating data:`, error.message);
      res.status(500).json({ error: `Error inserting/updating data: ${error.message}` });
    }
  } catch (error) {
    console.error(`Error fetching data from ${apiUrl}:`, error.message);
    res.status(500).json({ error: `Error fetching data from ${apiUrl}: ${error.message}` });
  } finally {
    if (client) {
      client.release();
    }
  }
});

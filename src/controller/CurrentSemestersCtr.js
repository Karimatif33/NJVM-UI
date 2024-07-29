const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
require("dotenv").config();

exports.fetshingCurrentSemesters = AsyncHandler(async (req, res) => {
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
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUECurrentSemesters?index=StudentCurrentSemesters&student_id=${StuId}&curr_academic_year=${selectedacadyearvalue}&curr_semester=${selectedsemestervalue}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      // Log the error and send an error response
      const errorText = await response.text();
      console.error(`Failed to fetch data from API. Status: ${response.status}. Error: ${errorText}`);
      return res.status(response.status).json({ error: `Failed to fetch data from API. Status: ${response.status}. Error: ${errorText}` });
    }
    const apiData = await response.json();
    const students = apiData.students;

    const SchemaAndTable = "StudentSemesters.students";

    const deleteAllByStuIdQuery = `
      DELETE FROM ${SchemaAndTable}
      WHERE StudentID = $1;
    `;
    await client.query(deleteAllByStuIdQuery, [StuId]);

    try {
      for (const item of students) {
        const IDValue = item.ID;
        const StudentIDValue = item.StudentID;
        const CourseIDValue = item.CourseID;
        const AcadYearValue = item.AcadYear;
        const SemesterValue = item.Semester;
        const SemesterGPAValue = item.SemesterGPA !== null && item.SemesterGPA !== false ? item.SemesterGPA : 0;
        const SemesterHRValue = item.SemesterHR !== null && item.SemesterHR !== false ? item.SemesterHR : 0;
        const CurrentGPAValue = typeof item.CurrentGPA === 'number' ? Number(item.CurrentGPA.toFixed(2)) : null;
        const final_gradeValue = item.final_grade;
        const blockedValue = item.blocked;

        const insertQuery = `
          INSERT INTO ${SchemaAndTable} (ID, StudentID, CourseID, AcadYear, Semester, SemesterGPA, SemesterHR, CurrentGPA, FinalGrade, Blocked) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (ID) DO UPDATE
          SET 
            StudentID = $2,
            CourseID = $3,
            AcadYear = $4,
            Semester = $5,
            SemesterGPA = $7,
            SemesterHR = $6,
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
          SemesterGPAValue,
          SemesterHRValue,
          CurrentGPAValue,
          final_gradeValue,
          blockedValue,
        ]);
        console.log("Data inserted into the database successfully");
      }

      const selectQuery = `
        SELECT StudentSemesters.students.*
        FROM StudentSemesters.students
        WHERE StudentSemesters.students.StudentID = $1;
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

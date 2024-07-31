const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/StudentDataSchema");
const axios = require('axios');
require("dotenv").config();
exports.fetshingStudentData = AsyncHandler(async (req, res) => {
  const apiUrl = `https://oerp.horus.edu.eg/WSNJ/HUEdata?index=StudentData`;

  try {
    // Call the function to create schema and table before fetching data
    await createSchemaAndTable();

    const response = await axios.get(apiUrl, { timeout: 300000 }); // 300 seconds (5 minutes)
    const apiData = response.data;
    const students = apiData.students;

    // Connect to the database
    const client = await connect();
    const SchemaAndTable = "StudentData.students";

    // if (!response.ok) {
    //   throw new Error(
    //     `Failed to fetch data from API. Status: ${response.status}`
    //   );
    // }


    try {
      for (const item of students) {
        const IDValue = item.ID;
        const enNameValue = item.enName;
        const CodeValue = item.Code;
        const NationalIDValue = item.NationalID;
        const FacultyIDValue = item.FacultyID;
        const CourseIDValue = item.CourseID;
        const StuNameValue = item.enName;
        const IsAdmin = false

        // console.log(nameValue, IDValue);

        // Insert data into the database (replace 'Levels' with your actual table name)
        const insertQuery = `
          INSERT INTO ${SchemaAndTable} (ID, enName, Code, NationalID, FacultyID, CourseID, StuName, IsAdmin) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (ID) DO UPDATE
          SET 
          enName = $2,
          Code = $3,
          NationalID = $4,
          FacultyID = $5,
          CourseID = $6,
          StuName = $7,
          IsAdmin = $8
      `;

        await client.query(insertQuery, [
          IDValue,
          enNameValue,
          CodeValue,
          NationalIDValue,
          FacultyIDValue,
          CourseIDValue,
          StuNameValue,
          IsAdmin,
        ]);
        console.log("Data inserted into the database successfully");
      }

      // Select all data from the 'levels' table
      const selectQuery = "SELECT * FROM StudentData.students";
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

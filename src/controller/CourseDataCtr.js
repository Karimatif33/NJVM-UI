const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/CourseDataSchema");
require("dotenv").config();
exports.fetshingCourseData = AsyncHandler(async (req, res) => {
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUEcourses?index=CourseData`;

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

    const courses = apiData.courses;

    // Connect to the database
    const client = await connect();
    const SchemaAndTable = "CourseData.courses";

    try {
      for (const item of courses) {
        const IDValue = item.ID;
        const nameValue = item.Name;
        const FacultyIDValue = item.FacultyID;
        const CreditHoursValue = item.CreditHours;
        const CoreHoursValue = item.CoreHours;
        const ElectiveHoursValue = item.ElectiveHours;
        const ProjectHoursValue = item.ProjectHours;
        const ParentIDValue = item.ParentID;

        // console.log(nameValue, IDValue);

        // Insert data into the database (replace 'Levels' with your actual table name)
        const insertQuery = `
          INSERT INTO ${SchemaAndTable} (ID, Name, FacultyID, CreditHours, CoreHours, ElectiveHours, ProjectHours, ParentID) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (ID) DO UPDATE
          SET 
              Name = $2,
              FacultyID = $3,
              CreditHours = $4,
              CoreHours = $5,
              ElectiveHours = $6,
              ProjectHours = $7,
              ParentID = $8;
      `;

        await client.query(insertQuery, [
          IDValue,
          nameValue,
          FacultyIDValue,
          CreditHoursValue,
          CoreHoursValue,
          ElectiveHoursValue,
          ProjectHoursValue,
          ParentIDValue,
        ]);
        console.log("Data inserted into the database successfully");
      }

      // Select all data from the 'levels' table
      const selectQuery = "SELECT * FROM CourseData.courses";
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

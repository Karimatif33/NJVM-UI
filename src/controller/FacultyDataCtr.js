const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/FacultyDataSchema");
require("dotenv").config();
exports.fetshingFacultyData = AsyncHandler(async (req, res) => {
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUEFaculty?index=FacultyData`;


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

    const facultydata = apiData.facultydata;

    // Connect to the database
    const client = await connect();
    const SchemaAndTable = 'FacultyData.facultydata'

    try {
      for (const item of facultydata) {
        const IDValue = item.ID;
        const nameValue = item.Name;
        // console.log(nameValue, IDValue);
        // Insert data into the database (replace 'Levels' with your actual table name)
        const insertQuery = `
          INSERT INTO ${SchemaAndTable} (ID, Name) 
          VALUES ($1, $2)
          ON CONFLICT (ID) DO UPDATE
          SET Name = $2;
        `;

        await client.query(insertQuery, [IDValue, nameValue]);
        console.log("Data inserted into the database successfully");
      }

      // Select all data from the 'levels' table
      const selectQuery = `SELECT * FROM FacultyData.facultydata`;
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

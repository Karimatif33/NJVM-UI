const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/SemesterDataSchema");
require("dotenv").config();
exports.fetshingSemesterData = AsyncHandler(async (req, res) => {
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUESemester?index=SemesterData`;
  const client = await connect();

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
    // console.log(apiData)
    const semesterdata = apiData.semesterdata;
    // Connect to the database
    const SchemaAndTable = "SemesterData.semesterdata";

    try {
      for (const item of semesterdata) {
        const IDValue = item.ID;
        const nameValue = item.Name;
        const ActiveValue = item.Active;
        console.log(nameValue, IDValue, ActiveValue);

        // Insert data into the database (replace 'Levels' with your actual table name)
        const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, Name, Active) 
        VALUES ($1, $2, $3)
        ON CONFLICT (ID) DO UPDATE
        SET 
            Name = $2,
            Active = $3
      `;

        await client.query(insertQuery, [IDValue, nameValue, ActiveValue]);
        console.log("Data inserted into the database successfully");
      }

      const selectQuery = "SELECT * FROM SemesterData.semesterdata";
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

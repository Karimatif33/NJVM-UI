const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/TotalsDataSchema");
require("dotenv").config();
exports.fetshingTotalsData = AsyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUETotals?index=TotalsData&course_id=${courseId}`;


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

    const totals_data = apiData.totals_data;

    // Connect to the database
    const client = await connect();
    const SchemaAndTable = "TotalData.totals_data";
    try {
      for (const item of totals_data) {
        // console.log("Processing data:", item);
        const IDValue = item.ID;
        const StuIdValue = item.ID;
        const gpaValue = item.gpa || null
        const hoursValue = parseFloat(item.hours);
        const levelValue = typeof item.level === "number" ? item.level : null;
        const advisorValue =
          typeof item.advisor === "number" ? item.advisor : null;
        const updatedAtValue = item.updatedAt;

        // Insert data into the database (replace 'Levels' with your actual table name)
        const insertQuery = `
          INSERT INTO ${SchemaAndTable} (ID, StuId, gpa, hours, level, advisor, updatedAt) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (ID) DO UPDATE
          SET 
          StuId = $2,
            gpa = $3,
            hours = $4,
            level = $5,
            advisor = $6,
            updatedAt = $7;
        `;

        await client.query(insertQuery, [
          IDValue,
          StuIdValue,
          gpaValue,
          hoursValue,
          levelValue,
          advisorValue,
          updatedAtValue,
        ]);
        console.log("Data inserted into the database successfully");
      }

      // Select all data from the 'levels' table
      // const selectQuery = "SELECT * FROM TotalData.totals_data";
      const selectQuery = `
      SELECT TotalData.totals_data.*, StaffData.Staff.name
      FROM TotalData.totals_data
      LEFT JOIN StaffData.Staff ON TotalData.totals_data.advisor = StaffData.Staff.id;
    `;
      const result = await client.query(selectQuery);
      // console.log('res',result)
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

  // } catch (error) {
  //   console.error("Error fetching data:", error.message);

  //   // Handle or respond to the error appropriately
  //   // If there is an error fetching from the API, return data from the database
  //   const selectQuery = "SELECT * FROM TotalData.totals_data";
  //   const result = await pool.query(selectQuery);
  //   res.json(result.rows);
  //   console.log("getting data from DB");
  // }
});



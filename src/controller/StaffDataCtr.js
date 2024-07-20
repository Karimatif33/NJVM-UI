const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/StaffDataSchema");

exports.fetshingStaffData = AsyncHandler(async (req, res) => {
  const apiUrl = "https://oerp.horus.edu.eg/WSNJ/HUEstaff?index=staffData";

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
    const staffdata = apiData.staffdata;
    // Connect to the database
    const client = await connect();
    const SchemaAndTable = "Staffdata.staff";

    try {
      for (const item of staffdata) {
        const IDValue = item.ID;
        const nameValue = item.Name;
        const typeValue = item.type;
        console.log(nameValue, IDValue, typeValue);

        // Insert data into the database (replace 'Levels' with your actual table name)
        const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, Name, Type) 
        VALUES ($1, $2, $3)
        ON CONFLICT (ID) DO UPDATE
        SET 
            Name = $2,
            Type = $3
      `;

        await client.query(insertQuery, [IDValue, nameValue, typeValue]);
        console.log("Data inserted into the database successfully");
      }

      // Select all data from the 'levels' table
      const selectQuery = "SELECT * FROM Staffdata.staff";
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
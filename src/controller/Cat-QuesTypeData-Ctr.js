const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/Cat-QuesTypeDataSchema");
require("dotenv").config();
exports.fetshingCatQuesTypeData = AsyncHandler(async (req, res) => {
  const apiUrl =
    `${process.env.HORUS_API_DOMAIN}/WSNJ/HUEQuesCat?index=QuesCatData`;

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
    const questype_data = apiData.questype_data;
    // Connect to the database
    const client = await connect();
    const SchemaAndTable = "questionnaire.ques_type_data";

    try {
      for (const item of questype_data) {
        const IDValue = item.id;
        const nameValue = item.name;
        const TypeValue = item.type;

        // Insert data into the database (replace 'Levels' with your actual table name)
        const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, Name, Type) 
        VALUES ($1, $2, $3)
        ON CONFLICT (ID) DO UPDATE
        SET 
            Name = $2,
            Type = $3
      `;

        await client.query(insertQuery, [IDValue, nameValue, TypeValue]);
        console.log("Data inserted into the database successfully");
      }

      // Select all data from the 'levels' table
      const selectQuery = "SELECT * FROM questionnaire.ques_type_data";
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

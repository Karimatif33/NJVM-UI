const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/QuestionsDataSchema");
require("dotenv").config();
exports.fetshingQuestionsData = AsyncHandler(async (req, res) => {
  const apiUrl =
    `${process.env.HORUS_API_DOMAIN}/WSNJ/HUEQuestions?index=QuestionsData`;

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
    const questions_data = apiData.questions_data;
    // Connect to the database
    const client = await connect();
    const SchemaAndTable = "questionnaire.ques_data";

    try {
      for (const item of questions_data) {
        const IDValue = item.id;
        const question_typeValue = item.question_type;
        const descriptionValue = item.description;

        // Insert data into the database (replace 'Levels' with your actual table name)
        const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, question_type, description) 
        VALUES ($1, $2, $3)
        ON CONFLICT (ID) DO UPDATE
        SET 
            question_type = $2,
            description = $3
      `;

        await client.query(insertQuery, [IDValue, question_typeValue, descriptionValue]);
        console.log("Data inserted into the database successfully");
      }

      // Select all data from the 'levels' table
      const selectQuery = "SELECT * FROM questionnaire.ques_data";
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

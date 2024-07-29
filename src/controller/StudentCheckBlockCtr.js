const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/StudentCheckBlockSchema");
require("dotenv").config();
exports.fetshingCheckBlock = AsyncHandler(async (req, res) => {
  let StuId = req.params.StuId;
  if (StuId === null || isNaN(StuId)) {
    StuId = 0;
  } else {
    StuId = parseInt(StuId);
  }
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUECheckBlock?index=StudentCheckBlock&student_id=${StuId}`;

  try {
    // Call the function to create schema and table before fetching data
    await createSchemaAndTable();
    // console.log('g')
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from API. Status: ${response.status}`
      );
    }
    const apiData = await response.json();
    // console.log(apiData)
    const Block = apiData.Block;
    // Connect to the database
    const client = await connect();
    const SchemaAndTable = "StudentCheckBlock.Block";

    const deleteAllByStuIdQuery = `
    DELETE FROM ${SchemaAndTable}
    WHERE Stu_ID = $1;
  `;
    await client.query(deleteAllByStuIdQuery, [StuId]);

    try {
      for (const item of Block) {
        const Stu_IDValue = StuId;
        const BlockReasonValue = item.BlockReason;

        const insertQuery = `
        INSERT INTO ${SchemaAndTable} (Stu_ID, BlockReason) 
        VALUES ($1, $2)
        ON CONFLICT (Stu_ID) DO UPDATE
        SET Stu_ID = $1,
        BlockReason = $2;
      `;

        await client.query(insertQuery, [Stu_IDValue, BlockReasonValue]);
        console.log("Data inserted into the database successfully");
      }

      // Select all data from the 'levels' table
      const selectQuery = `
      SELECT BlockReason
      FROM ${SchemaAndTable}
      WHERE Stu_ID = $1;
    `;

      const result = await client.query(selectQuery, [StuId]);

      // Return the retrieved data as JSON
      res.json(result.rows);
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Handle or respond to the error appropriately
    // If there is an error fetching from the API, return data from the database
    const selectQuery = `
  SELECT BlockReason
  FROM ${SchemaAndTable}
  WHERE Stu_ID = $1;
`;

    const result = await client.query(selectQuery, [StuId]);
    res.json(result.rows);
    console.log("getting data from DB");
  }
});

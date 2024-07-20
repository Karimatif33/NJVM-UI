const { connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const { createSchemaAndTable } = require("../model/CurSemesterValSchema");

exports.CurSemesterValCtr = AsyncHandler(async (req, res) => {
  const client = await connect();
  const { selectedSemesterValue, selectedSemesterrName } = req.body;
  const id = 1
  try {
    await createSchemaAndTable();
    const SchemaAndTable = "Cur_Semester.Semester"; // Adjust schema name as needed

    const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, selectedSemesterValue, selectedSemesterrName) 
        VALUES ($1, $2, $3)
        ON CONFLICT (ID) DO UPDATE
        SET 
        selectedSemesterValue = $2,
        selectedSemesterrName = $3
      `;

    await client.query(insertQuery, [id, selectedSemesterValue, selectedSemesterrName]);

    console.log("Data inserted successfully");
    res.json({
      message: "POST request received and data inserted successfully",
    });
  } catch (error) {
    console.error("Error inserting data", error);
    res
      .status(500)
      .json({
        error: "Error inserting data into database",
        details: error.message,
      });
  } finally {
    // Remember to release the client to the pool after use
    client.release();
  }
});

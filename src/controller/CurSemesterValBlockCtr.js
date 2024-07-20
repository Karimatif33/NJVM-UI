const { connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const { createSchemaAndTable } = require("../model/CurSemesterValBlockTimeSchema");

exports.CurSemesterValBlockCtr = AsyncHandler(async (req, res) => {
  const client = await connect();
  const { selectedSemesterValue, selectedSemesterName } = req.body;
  const id = 1
  try {
    await createSchemaAndTable();
    const SchemaAndTable = "Cur_Semester.BlockTime"; // Adjust schema name as needed

    const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, selectedSemesterValue, selectedSemesterName) 
        VALUES ($1, $2, $3)
        ON CONFLICT (ID) DO UPDATE
        SET 
        selectedSemesterValue = $2,
        selectedSemesterName = $3
      `;

    await client.query(insertQuery, [id, selectedSemesterValue, selectedSemesterName]);

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

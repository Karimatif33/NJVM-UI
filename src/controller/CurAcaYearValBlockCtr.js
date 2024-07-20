const { connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const { createSchemaAndTable } = require("../model/CurAcaYearValBlockTimeSchema");

exports.CurAcaYearValBlockCtr = AsyncHandler(async (req, res) => {
  const client = await connect();
  const { selectedAcadYearValue, selectedAcadYearName } = req.body;
  const id = 1
  try {
    await createSchemaAndTable();
    const SchemaAndTable = "Acad_year.BlockTime"; // Adjust schema name as needed

    const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, selectedAcadYearValue, selectedAcadYearName) 
        VALUES ($1, $2, $3)
        ON CONFLICT (ID) DO UPDATE
        SET 
        selectedAcadYearValue = $2,
        selectedAcadYearName = $3
      `;

    await client.query(insertQuery, [id, selectedAcadYearValue, selectedAcadYearName]);

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

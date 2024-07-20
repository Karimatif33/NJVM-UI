// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "AcadYearData";
const TableName = "acadyeardata";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${schemaName}.${TableName} (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Active boolean NOT NULL
  );
`;

const createSchemaAndTable = async () => {
  try {
    const client = await pool.connect();
    console.log("DB Connected Successfully");

    // Create the schema
    await client.query(createSchemaQuery);

    // Create the table within the schema
    await client.query(createTableQuery);

    console.log(
      `Check Schema '${schemaName}' and table ${TableName} successfully`
    );

    client.release();
  } catch (err) {
    console.error("Error:", err.message);
  }
};

module.exports = {
  pool,
  createSchemaAndTable,
};

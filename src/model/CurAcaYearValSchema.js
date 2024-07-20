// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "Acad_year";
const tableName = "Acad_year_Value";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${schemaName}.${tableName} (
    ID SERIAL PRIMARY KEY,
    selectedAcadYearValue INTEGER,
    selectedAcadYearName VARCHAR
  );
`;

const createSchemaAndTable = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to the database");

    // Create the schema
    await client.query(createSchemaQuery);

    // Create the table within the schema
    await client.query(createTableQuery);

    console.log(`Schema '${schemaName}' and table '${tableName}' created successfully`);

    client.release();
  } catch (err) {
    console.error("Error creating schema and table:", err.message);
  }
};

module.exports = {
  createSchemaAndTable,
};

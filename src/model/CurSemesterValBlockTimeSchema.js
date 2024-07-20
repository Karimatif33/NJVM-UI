// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "Cur_Semester";
const tableName = "BlockTime";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${schemaName}.${tableName} (
    ID SERIAL PRIMARY KEY,
    selectedSemesterValue INTEGER,
    selectedSemesterName VARCHAR
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

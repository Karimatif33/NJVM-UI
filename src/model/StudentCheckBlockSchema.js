// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "StudentCheckBlock";
const TableName = "Block";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${schemaName}.${TableName} (
    ID SERIAL PRIMARY KEY,
    Stu_ID INTEGER UNIQUE,
    BlockReason VARCHAR(500)
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

    // console.log(
    //   `Check Schema '${schemaName}' and table ${TableName} successfully`
    // );

    client.release();
  } catch (err) {
    console.error("Error:", err.message);
  }
};

module.exports = {
  pool,
  createSchemaAndTable,
};

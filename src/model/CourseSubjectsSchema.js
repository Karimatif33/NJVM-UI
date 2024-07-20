// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "CourseSubjects";
const TableName = "subjects";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${schemaName}.${TableName} (
        ID SERIAL PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Code VARCHAR(50) NOT NULL,
        CourseID INTEGER ,
        CreditHours INTEGER NOT NULL,
        Level VARCHAR(50) NOT NULL,
        Type VARCHAR(50) NOT NULL,
        Prerequisites INTEGER[] -- Assuming Prerequisites is an array of IDs
    );
`;

const createSchemaAndTable = async () => {
  let client;

  try {
    client = await pool.connect();
    console.log("DB Connected Successfully");

    await client.query(createSchemaQuery);
    await client.query(createTableQuery);

    console.log(
      `Check Schema '${schemaName}' and table ${TableName} successfully`
    );
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = {
  pool,
  createSchemaAndTable,
};

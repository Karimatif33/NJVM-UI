// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "StuFeesData";
const TableName = "invoices_data";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${schemaName}.${TableName} (
        ID SERIAL PRIMARY KEY,
        Stu_ID INTEGER,
        number VARCHAR(255),
        name VARCHAR(255),
        state VARCHAR(255),
        date_due VARCHAR(255),
        amount FLOAT,
        currency VARCHAR(255),
        no_unpaid_invoices_message VARCHAR(255),
        FeeMessage VARCHAR
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

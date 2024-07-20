// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "questionnaire";
const TableName = "ques_data";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${schemaName}.${TableName} (
    ID SERIAL PRIMARY KEY,
    question_type INTEGER,
    description VARCHAR,
    CONSTRAINT fk_question_type FOREIGN KEY (question_type) REFERENCES questionnaire.ques_Services_data(id)
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

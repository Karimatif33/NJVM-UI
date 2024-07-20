// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "StudyTimetable";
const TableName = "sessions";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${schemaName}.${TableName} (
      Stu_ID INTEGER,
        ID SERIAL PRIMARY KEY,
        Day VARCHAR(255),
        Type VARCHAR(255),
        Subject VARCHAR(255),
        Place VARCHAR(255),
        "from" VARCHAR(255),
        "to" VARCHAR(255),
        "group" VARCHAR(255),
        section INTEGER,
        faculty_ids VARCHAR(500)[] ,
        CONSTRAINT fk_stuednt FOREIGN KEY (Stu_ID) REFERENCES StudentData.students(id)
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

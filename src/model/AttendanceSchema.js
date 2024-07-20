// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "Attendance";
const TableName = "attendance_data";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${schemaName}.${TableName} (
        ID SERIAL UNIQUE,
        OerpID INTEGER UNIQUE,
        Stu_ID INTEGER,
        Subject VARCHAR,
        Count INTEGER,
        AbsenceDays VARCHAR[],
        Percentage INTEGER,
        NO_of_absence VARCHAR,
        AbcMessage VARCHAR,
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

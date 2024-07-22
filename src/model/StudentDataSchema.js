// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "StudentData";
const TableName = "students";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${schemaName}.${TableName} (
    ID SERIAL PRIMARY KEY,
    enName VARCHAR,
    StuName VARCHAR,
    Code INTEGER,
    NationalID VARCHAR(500),
    FacultyID INTEGER,
    CourseID INTEGER,
    IsAdmin BOOLEAN NOT NULL,
    CONSTRAINT fk_course FOREIGN KEY (CourseID) REFERENCES CourseData.courses(id),
    CONSTRAINT fk_acad_year FOREIGN KEY (FacultyID) REFERENCES FacultyData.facultydata(id)
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

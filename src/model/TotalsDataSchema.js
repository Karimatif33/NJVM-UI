// dbUtils.js
const { pool } = require("../db/dbConnect");

const schemaName = "TotalData";
const TableName = "totals_data";

const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${schemaName};`;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${schemaName}.${TableName} (
    ID SERIAL PRIMARY KEY,
    StuId INTEGER UNIQUE,
    gpa FLOAT,
    hours FLOAT,
    level INTEGER,
    advisor INTEGER,
    updatedAt VARCHAR(255),
    CONSTRAINT fk_leve_Total FOREIGN KEY (level) REFERENCES levels.levels(id),
    CONSTRAINT fk_advisor FOREIGN KEY (advisor) REFERENCES Staffdata.staff(id)
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

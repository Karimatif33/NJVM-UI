const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/StudyTimetableSchema");
const logger = require("../model/logger");
require("dotenv").config();

exports.fetshingStudyTimetable = AsyncHandler(async (req, res, next) => {
  let StuId = req.params.StuId;

  // Check if StuId is null or undefined, and set it to 0 if true
  if (StuId === null || StuId === undefined) {
    StuId = 0;
  } else {
    // Convert StuId to a number if it's a string or other type
    StuId = parseInt(StuId, 10);

    // Check if conversion failed and set to 0 if so
    if (isNaN(StuId)) {
      StuId = 0;
    }
  }

  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUEStudyTimetable?index=StudyTimetable&student_id=${StuId}`;

  try {
    // Call the function to create schema and table before fetching data
    await createSchemaAndTable();
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from API. Status: ${response.status}`
      );
    }

    const apiData = await response.json();
    const sessions_data = apiData.sessions_data;

    // Connect to the database
    const client = await connect();
    const SchemaAndTable = "StudyTimetable.sessions";

    try {
      const deleteAllByStuIdQuery = `
        DELETE FROM ${SchemaAndTable}
        WHERE Stu_ID = $1;
      `;
      await client.query(deleteAllByStuIdQuery, [StuId]);

      for (const item of sessions_data) {
        console.log(item);
        const IDValue = item.ID;
        const Stu_IDValue = StuId;
        const DayValue = item.Day;
        const TypeValue = item.Type;
        const SubjectValue = item.Subject;
        const PlaceValue = item.Place;
        const fromValue = item.from;
        const toValue = item.to;
        const groupValue = item.group;
        const sectionValue = item.section;
        const faculty_idsValue = item.faculty_ids || [];

        // Insert data into the database
        const insertQuery = `
          INSERT INTO ${SchemaAndTable} (ID, Day, Type, Subject, Place, "from", "to", "group", section, Stu_ID, faculty_ids) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (ID) DO UPDATE
          SET 
            Day = $2,
            Type = $3,
            Subject = $4,
            Place = $5,
            "from" = $6,
            "to" = $7,
            "group" = $8,
            section = $9,
            Stu_ID = $10,
            faculty_ids = $11
        `;

        await client.query(insertQuery, [
          IDValue,
          DayValue,
          TypeValue,
          SubjectValue,
          PlaceValue,
          fromValue,
          toValue,
          groupValue,
          sectionValue,
          Stu_IDValue,
          faculty_idsValue,
        ]);

        console.log("Data inserted into the database successfully");
      }

      const selectQuery = `
        SELECT *
        FROM StudyTimetable.sessions
        WHERE Stu_ID = $1;
      `;

      const result = await client.query(selectQuery, [StuId]);

      // Return the retrieved data as JSON
      res.json(result.rows);
    } catch (error) {
      logger.error(`Database query error: ${error.message}`);
      throw error;
    } finally {
      client.release();
      console.log("client release ");
    }
  } catch (error) {
    logger.error(`Error fetching data from ${apiUrl}: ${error.message}`);
    
    // If an error occurs, fetch data from the DB
    try {
      const client = await connect();
      const selectQuery = `
        SELECT *
        FROM StudyTimetable.sessions
        WHERE Stu_ID = $1;
      `;

      const result = await client.query(selectQuery, [StuId]);
      res.json(result.rows);
      console.log("Getting data from the DB due to an error");
      client.release();
      console.log("client release DB");
    } catch (dbError) {
      logger.error(`Error querying the database: ${dbError.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

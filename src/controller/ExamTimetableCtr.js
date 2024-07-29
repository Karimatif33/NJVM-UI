const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/ExamTimetableSchema");
const logger = require("../model/logger");
require("dotenv").config();

exports.fetshingExamTimetable = AsyncHandler(async (req, res, next) => {
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

  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUEExamTimetable?index=ExamTimetable&student_id=${StuId}`;

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
    const exams_data = apiData.exams_data;

    // Connect to the database
    const client = await connect();
    const SchemaAndTable = "ExamTimetable.exams_data";

    try {
      const deleteAllByStuIdQuery = `
        DELETE FROM ${SchemaAndTable}
        WHERE Stu_ID = $1;
      `;
      await client.query(deleteAllByStuIdQuery, [StuId]);

      for (const item of exams_data) {
        console.log(item);
        const IDValue = item.ID;
        const Stu_IDValue = StuId;
        const ExamValue = item.Exam;
        const DateValue = item.Date;
        
        // Get day from date
        const dateObject = new Date(DateValue);
        const daysOfWeek = [
          "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];
        const dayIndex = dateObject.getDay();
        const DayValue = daysOfWeek[dayIndex];
        
        const TypeValue = item.Type;
        const SubjectValue = item.Subject;
        const PlaceValue = item.Room;
        const fromValue = item.From;
        const toValue = item.To;
        const SeatNoValue = item.SeatNo;

        // Insert data into the database
        const insertQuery = `
          INSERT INTO ${SchemaAndTable} (ID, Day, Type, Subject, Place, "from", "to", Exam, Stu_ID, SeatNo, Date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (ID) DO UPDATE
          SET 
            Day = $2,
            Type = $3,
            Subject = $4,
            Place = $5,
            "from" = $6,
            "to" = $7,
            Exam = $8,
            Stu_ID = $9,
            SeatNo = $10,
            Date = $11
        `;

        await client.query(insertQuery, [
          IDValue,
          DayValue,
          TypeValue,
          SubjectValue,
          PlaceValue,
          fromValue,
          toValue,
          ExamValue,
          Stu_IDValue,
          SeatNoValue,
          DateValue,
        ]);

        console.log("Data inserted into the database successfully");
      }

      // Fetch the data from the database
      const selectQuery = `
        SELECT *
        FROM ${SchemaAndTable}
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
      console.log("Client connection released");
    }
  } catch (error) {
    logger.error(`Error fetching data from ${apiUrl}: ${error.message}`);

    // Handle errors by fetching data from the DB
    try {
      const client = await connect();
      const selectQuery = `
        SELECT *
        FROM ${SchemaAndTable}
        WHERE Stu_ID = $1;
      `;

      const result = await client.query(selectQuery, [StuId]);
      res.json(result.rows);
      console.log("Getting data from the DB due to an error");
      client.release();
      console.log("Client connection released after error");
    } catch (dbError) {
      logger.error(`Error querying the database: ${dbError.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

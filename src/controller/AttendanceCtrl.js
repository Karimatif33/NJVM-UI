const { connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/AttendanceSchema");
require("dotenv").config();

exports.fetshingAttendance = AsyncHandler(async (req, res) => {
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
  
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUEAttendance?index=Attendance&studentID=${StuId}`;

  let client;
  try {
    // Connect to the database
    client = await connect();

    // Call the function to create schema and table before fetching data
    await createSchemaAndTable();

    // Fetch data from the API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from API. Status: ${response.status}`);
    }

    const apiData = await response.json();
    const attendance_data = apiData.attendance_data;

    if (attendance_data === "There is no Absence") {
      console.log("API response:", attendance_data);

      // Insert the message into the database
      const insertNoAbsenceMessageQuery = `
        INSERT INTO Attendance.attendance_data (AbcMessage, OerpID)
        VALUES ($1, $2)
        ON CONFLICT (OerpID) DO UPDATE
        SET AbcMessage = $1;
      `;
      await client.query(insertNoAbsenceMessageQuery, [attendance_data, StuId]);

      // Respond with a JSON message
      return res.json({ message: "There is no Absence" });
    } else {
      const SchemaAndTable = "Attendance.attendance_data";

      // Delete existing records for the student
      const deleteAllByStuIdQuery = `
        DELETE FROM ${SchemaAndTable}
        WHERE Stu_ID = $1;
      `;
      await client.query(deleteAllByStuIdQuery, [StuId]);

      // Function to generate random number
      function createRandomNumberFunction() {
        return function () {
          return Math.floor(Math.random() * 1000000000);
        };
      }
      const increment = createRandomNumberFunction();

      try {
        for (const item of attendance_data) {
          const IDValue = increment();
          const Stu_IDValue = parseInt(StuId, 10) || 0; // Ensure Stu_ID is an integer
          const SubjectValue = item.Subject || null;
          const CountValue = parseInt(item.Count, 10) || 0; // Ensure Count is an integer
          const AbsenceDaysValue = parseInt(item.AbsenceDays, 10) || 0; // Ensure AbsenceDays is an integer
          const PercentageValue = parseFloat(item.Percentage) || 0; // Ensure Percentage is a float
          const NO_of_absenceValue = item.hasOwnProperty("NO of absence")
            ? parseInt(item["NO of absence"], 10) || null // Ensure NO_of_absence is an integer or null
            : null;

          // Insert data into the database
          const insertQuery = `
            INSERT INTO ${SchemaAndTable} (ID, Stu_ID, Subject, Count, AbsenceDays, Percentage, NO_of_absence)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (ID) DO NOTHING;
          `;
          await client.query(insertQuery, [
            IDValue,
            Stu_IDValue,
            SubjectValue,
            CountValue,
            AbsenceDaysValue,
            PercentageValue,
            NO_of_absenceValue,
          ]);

          console.log("Data inserted into the database successfully");
        }

        const selectQuery = `
          SELECT *
          FROM ${SchemaAndTable}
          WHERE Stu_ID = $1;
        `;

        const result = await client.query(selectQuery, [StuId]);

        return res.json(result.rows);
      } catch (error) {
        console.error("Error querying data:", error.message);
        // No need to release client here; it will be handled in the finally block
        throw error; // Propagate the error to be handled by the outer catch block
      }
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error.message);
    if (client) {
      try {
        const selectQuery = `
          SELECT *
          FROM Attendance.attendance_data
          WHERE Stu_ID = $1;
        `;
        console.log("Getting data from the DB due to an error");

        const result = await client.query(selectQuery, [StuId]);
        if (result.rows.length > 0) {
          const abcMessageValue = result.rows[0].abcmessage;
          if (abcMessageValue === "There is no Absence") {
            return res.json({ message: "There is no Absence" });
          } else {
            return res.json(result.rows);
          }
        } else {
          return res.json({ message: "No data found" });
        }
      } catch (dbError) {
        console.error(`Error querying the database: ${dbError.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } finally {
    if (client) {
      client.release();
      console.log("Client connection released");
    }
  }
});

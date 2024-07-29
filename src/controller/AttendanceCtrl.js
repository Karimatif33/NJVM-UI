const { connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/AttendanceSchema");
require("dotenv").config();
exports.fetshingAttendance = AsyncHandler(async (req, res) => {
  const StuId = req.params.StuId;
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUEAttendance?index=Attendance&studentID=${StuId}`;
  const client = await connect();

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

    const attendance_data = apiData.attendance_data;

    if (attendance_data === "There is no Absence") {
      console.log("API response:", attendance_data);
      // Insert the message into the database
      const insertNoAbsenceMessageQuery = `
      INSERT INTO Attendance.attendance_data (AbcMessage, OerpID)
      VALUES ($1, $2)
      ON CONFLICT (OerpID) DO UPDATE
      SET AbcMessage = $2;
    `;

      await client.query(insertNoAbsenceMessageQuery, [attendance_data, StuId]);

      // Respond with a JSON message
      return res.json({ message: "There is no Absence" });
    } else {

      const SchemaAndTable = "Attendance.attendance_data";

      const deleteAllByStuIdQuery = `
      DELETE FROM ${SchemaAndTable}
      WHERE Stu_ID = $1;
    `;
      await client.query(deleteAllByStuIdQuery, [StuId]);

      function createRandomNumberFunction() {
        return function () {
          // Generate a random number between 1000000 and 9999999
          return Math.floor(Math.random() * 1000000000);
        };
      }
      const increment = createRandomNumberFunction();

      try {
        for (const item of attendance_data) {
          const IDValue = increment();
          const Stu_IDValue = StuId;
          const SubjectValue = item.Subject;
          const CountValue = item.Count;
          const AbsenceDaysValue = item.AbsenceDays;
          const PercentageValue = item.Percentage;
          const NO_of_absenceValue = item.hasOwnProperty("NO of absence")
            ? item["NO of absence"]
            : null;

          // Insert data into the database (replace 'Levels' with your actual table name)
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
        FROM Attendance.attendance_data
        WHERE Stu_ID = $1;
      `;

        const result = await client.query(selectQuery, [StuId]);

        res.json(result.rows);
      } catch (error) {
        console.error("Error querying data:", error.message);
        client.release();
      }
    }
  } catch (error) {
    console.error("Error querying data:", error.message);
    const selectQuery = `
    SELECT *
    FROM Attendance.attendance_data
    WHERE Stu_ID = $1;
  `;

    console.log("Getting data from the DB ");
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
  } finally {
    if (client) {
      client.release();
    }
  }
});

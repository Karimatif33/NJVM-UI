const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/ExamTimetableSchema");

exports.fetshingExamTimetable = AsyncHandler(async (req, res) => {
  const StuId = req.params.StuId;
  const apiUrl = `https://oerp.horus.edu.eg/WSNJ/HUEExamTimetable?index=ExamTimetable&student_id=${StuId}`;
  // const apiUrl = `https://odoo.horus.edu.eg/WSNJ/HUEExamTimetable?index=ExamTimetable&student_id=${StuId}`;
  // 7221004 --- 10607
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
    const deleteAllByStuIdQuery = `
    DELETE FROM ${SchemaAndTable}
    WHERE Stu_ID = $1;
  `;

    await client.query(deleteAllByStuIdQuery, [StuId]);
    try {
      for (const item of exams_data) {
        console.log(item);
        const IDValue = item.ID;
        const Stu_IDValue = StuId;
        const ExamValue = item.Exam;
        const DateValue = item.Date;
        // get day from date
        const dateObject = new Date(DateValue);
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayIndex = dateObject.getDay();
        const dayName = daysOfWeek[dayIndex];
        //
        const DayValue = dayName;
        const TypeValue = item.Type;
        const SubjectValue = item.Subject;
        const PlaceValue = item.Room;
        const fromValue = item.From;
        const toValue = item.To;
        const SeatNoValue = item.SeatNo;
        console.log(Stu_IDValue);

        // Insert data into the database (replace 'Levels' with your actual table name)
        const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, Day, Type, Subject, Place, "from", "to", Exam,  Stu_ID, SeatNo, Date) 
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

      const selectQuery = `
  SELECT *
  FROM ExamTimetable.exams_data
  WHERE Stu_ID = $1;
`;

      const result = await client.query(selectQuery, [StuId]);

      // Return the retrieved data as JSON
      res.json(result.rows);
    } finally {
      client.release();
      console.log("client release ");
    }
  } catch (error) {
    const client = await connect();
    console.error("Error querying data:", error.message);

    const selectQuery = `
      SELECT *
      FROM ExamTimetable.exams_data
      WHERE Stu_ID = $1;
    `;

    const result = await client.query(selectQuery, [StuId]);
    res.json(result.rows);
    console.log("Getting data from the DB due to an error");
    client.release();
    console.log("client release DB");
  }
});

const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/StudyTimetableSchema");

exports.fetshingStudyTimetable = AsyncHandler(async(req, res) => {
    const StuId = req.params.StuId;
  console.log(StuId, "Aa")

    const apiUrl = `https://oerp.horus.edu.eg/WSNJ/HUEStudyTimetable?index=StudyTimetable&student_id=${StuId}`;

    // const apiUrl = `https://odoo.horus.edu.eg/WSNJ/HUEStudyTimetable?index=StudyTimetable&student_id=${StuId}`;
    // 4231404 --- 16828
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
        const deleteAllByStuIdQuery = `
            DELETE FROM ${SchemaAndTable}
            WHERE Stu_ID = $1;
        `;
        await client.query(deleteAllByStuIdQuery, [StuId]);
        try {
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
                console.log(Stu_IDValue);

                // Insert data into the database (replace 'Levels' with your actual table name)
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
        } finally {
            client.release();
            console.log("client release ");
        }
    } catch (error) {
        const client = await connect();
        console.error("Error querying data:", error.message);

        const selectQuery = `
      SELECT *
      FROM studytimetable.sessions
      WHERE Stu_ID = $1;
    `;

        const result = await client.query(selectQuery, []);
        res.json(result.rows);
        console.log(result.rows,StuId)
        console.log("Getting data from the DB due to an error");
        client.release();
        console.log("client release DB");
    }
});
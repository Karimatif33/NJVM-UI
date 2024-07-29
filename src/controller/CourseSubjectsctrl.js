const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/CourseSubjectsSchema");
require("dotenv").config();
exports.fetshingSubjectsData = AsyncHandler(async (req, res) => {
    const apiUrl =
        `${process.env.HORUS_API_DOMAIN}/WSNJ/HUEcoursesSubjects?index=CourseSubjectsData`;

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

        const coursessubjects = apiData.coursessubjects;

        // Connect to the database
        const client = await connect();
        const SchemaAndTable = "CourseSubjects.subjects";

        try {
            for (const item of coursessubjects) {
                const IDValue = item.ID;
                const nameValue = item.Name;
                const CodeValue = item.Code;
                const CourseIDValue = item.CourseID;
                const CreditHoursValue = item.CreditHours;
                const LevelValue = item.Level;
                const TypeValue = item.Type;
                const PrerequisitesValue = item.prerequisites || [];
                // console.log(nameValue, IDValue);

                // Insert data into the database (replace 'Levels' with your actual table name)
                const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, Name, Code, CourseID, CreditHours, Level, Type, Prerequisites) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (ID) DO UPDATE
        SET 
            ID = $1,
            Name = $2,
            Code = $3,
            CourseID = $4,
            CreditHours = $5,
            Level = $6,
            Type = $7,
            Prerequisites = $8;
    `;

                await client.query(insertQuery, [
                    IDValue,
                    nameValue,
                    CodeValue,
                    CourseIDValue,
                    CreditHoursValue,
                    LevelValue,
                    TypeValue,
                    PrerequisitesValue,
                ]);

                console.log("Data inserted into the database successfully");
            }

            // Select all data from the 'levels' table
            const selectQuery = "SELECT * FROM CourseSubjects.subjects";
            const result = await client.query(selectQuery);

            // Return the retrieved data as JSON
            res.json(result.rows);
            client.release();
            return { status: "success" };
        } catch (error) {
            console.error(`Error fetching data from ${apiUrl}:`, error.message);
            return { status: "fail", error: `Error fetching data from ${apiUrl}` };
        }
    } finally {
        // console.log("client release");;
    }
});
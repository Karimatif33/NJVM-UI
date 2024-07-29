const axios = require('axios'); // Import Axios for making HTTP requests
const { pool, connect } = require("../../db/dbConnect");
const { fetchAndStoreBlockReasons } = require('../../controller/StudentCheckBlockCtr');
const { createSchemaAndTable } = require("../../model/StudentCheckBlockSchema");
require("dotenv").config();
async function fetchStudentByCode(id) {
  const query = `
    SELECT 
      StudentSemesters.students.studentid, 
      StudentSemesters.students.id, 
      StudentSemesters.students.courseid,
      StudentSemesters.students.acadyear, 
      StudentSemesters.students.semester, 
      StudentSemesters.students.semestergpa,
      StudentSemesters.students.semesterhr,
      StudentSemesters.students.currentgpa,
      StudentSemesters.students.finalgrade,
      StudentSemesters.students.blocked,
      AcadYearData.acadyeardata.name AS acad_year_name,
      SemesterData.semesterdata.name AS SemesterName,
      StudentTranscript.students.fk AS f_k,
      StudentTranscript.students.subjectid,
      StudentTranscript.students.grade,
      GradesData.gradesdata.name As grade_name,
      CourseSubjects.subjects.name AS subject_name,
      CourseSubjects.subjects.code AS subject_code,
      CourseSubjects.subjects.credithours AS credithours
    FROM StudentSemesters.students
    LEFT JOIN CourseData.courses ON StudentSemesters.students.courseid = CourseData.courses.id
    LEFT JOIN AcadYearData.acadyeardata ON StudentSemesters.students.acadyear = AcadYearData.acadyeardata.id
    LEFT JOIN SemesterData.semesterdata ON StudentSemesters.students.semester = SemesterData.semesterdata.id
    LEFT JOIN StudentTranscript.students ON StudentSemesters.students.id = StudentTranscript.students.fk
    LEFT JOIN CourseSubjects.subjects ON StudentTranscript.students.subjectid = CourseSubjects.subjects.id
    LEFT JOIN GradesData.gradesdata ON  StudentTranscript.students.grade = GradesData.gradesdata.id
    WHERE StudentSemesters.students.studentid = $1;
  `;

  const queryBlockTime = `
  SELECT av.selectedacadyearvalue, av.selectedacadyearName, ot.selectedSemesterValue, ot.selectedSemesterName
  FROM Acad_year.BlockTime AS av
  INNER JOIN Cur_Semester.BlockTime AS ot ON av.id = ot.id;
`;

  const client = await pool.connect();
  const result = await client.query(queryBlockTime);
  const selectedacadyearvalue = result.rows[0].selectedacadyearvalue; // Access the value of the id column from the first row
  const selectedsemestervalue = result.rows[0].selectedsemestervalue; // Access the value of the id column from the first row

  // console.log(selectedacadyearvalue, selectedsemestervalue);
  try {
    // let blockReason = "";

    // if (id === null || isNaN(id)) {
    //     id = 0;
    // } 
    // else {
    //     id = parseInt(id);
    //     console.log("Fetching data for id:", id);
    //     console.log("test tran", id);
    //     try {
    //         console.log("Fetching block reason for student id:", id);
    //         const blockReasonResponse = await axios.get(`${process.env.HORUS_API_DOMAIN}/WSNJ/HUECheckBlock?index=StudentCheckBlock&student_id=${id}`, {
    //             timeout: 3000 // timeout set to 5 seconds
    //         });
    //         console.log("Block reason response:", blockReasonResponse.data.Block); // Log the response data

    //         if (Array.isArray(blockReasonResponse.data.Block) && blockReasonResponse.data.Block.length > 0) {
    //             blockReason = blockReasonResponse.data.Block[0].BlockReason || "";
    //         }
    // } catch (error) {
    //     console.error("Error fetching block reason:", error.message);
    // }

    // }

    //   else {
    //     id = parseInt(id);
    //     console.log("Fetching data for id:", id);
    //     console.log("test tran", id);
    //     try {
    //         console.log("Fetching block reason for student id:", id);
    //         const blockReasonResponse = await axios.get(`${process.env.HORUS_API_DOMAIN}/WSNJ/HUECheckBlock?index=StudentCheckBlock&student_id=${id}`, {
    //             timeout: 3000 // timeout set to 5 seconds
    //         });
    //         console.log("Block reason response:", blockReasonResponse.data.Block); // Log the response data

    //         if (Array.isArray(blockReasonResponse.data.Block) && blockReasonResponse.data.Block.length > 0) {
    //             blockReason = blockReasonResponse.data.Block[0].BlockReason || "";
    //         }
    // } catch (error) {
    //     console.error("Error fetching block reason:", error.message);
    // }

    // }



    let blockReason = "";
    const SchemaAndTable = "StudentCheckBlock.Block";
    let StuId = id ? parseInt(id) : 0;


    if (StuId === null || isNaN(StuId)) {
      StuId = 0;
    } else {
      StuId = parseInt(StuId);
      console.log("Fetching data for id:", StuId);
    }

    console.log("Fetching data for id:", StuId);
    try {
      await createSchemaAndTable(client);

      console.log("Fetching block reason for student id:", StuId);
      const blockReasonResponse = await axios.get(`${process.env.HORUS_API_DOMAIN}/WSNJ/HUECheckBlock?index=StudentCheckBlock&student_id=${StuId}`, {
        timeout: 3000 // timeout set to 3 seconds
      });

      const apiData = blockReasonResponse.data; // Corrected to use blockReasonResponse.data
      const Block = apiData.Block;
      console.log(Block)
      // Delete existing data for the student
      const deleteAllByStuIdQuery = `
          DELETE FROM ${SchemaAndTable}
          WHERE Stu_ID = $1;
      `;
      await client.query(deleteAllByStuIdQuery, [StuId]);

      // Insert new data
      for (const item of Block) {
        const BlockReasonValue = item.BlockReason;

        const insertQuery = `
              INSERT INTO ${SchemaAndTable} (Stu_ID, BlockReason) 
              VALUES ($1, $2)
              ON CONFLICT (Stu_ID) DO UPDATE
              SET BlockReason = $2;
          `;
        await client.query(insertQuery, [StuId, BlockReasonValue]);
        console.log("Data inserted into the database successfully");
      }

      // Fetch the block reason from the database
      const selectQuery = `
          SELECT BlockReason
          FROM ${SchemaAndTable}
          WHERE Stu_ID = $1;
      `;
      const result = await client.query(selectQuery, [StuId]);
      console.log(result.rows[0])
      if (result.rows.length > 0) {
        blockReason = result.rows[0].blockreason;
      }

      console.log("Block reason response:", blockReason); // Log the block reason

    } catch (error) {
      console.error("Error fetching data:", error.message);

      // Handle or respond to the error appropriately
      // If there is an error fetching from the API, return data from the database
      const selectQuery = `
        SELECT BlockReason
        FROM ${SchemaAndTable}
        WHERE Stu_ID = $1;
    `;
      const result = await client.query(selectQuery, [StuId]);
      if (result.rows.length > 0) {
        blockReason = result.rows[0].blockreason;
      }
    }






    const result = await client.query(query, [id]);
    const uniqueData = [];
    const uniqueFKIDs = new Set();

    result.rows.forEach((row) => {
      const FKid = row.id;
      const AcadYear = row.acadyear
      const semester = row.semester
      const blockReasonForFKid = (AcadYear === selectedacadyearvalue && semester === selectedsemestervalue) ? blockReason : "";

      if (!uniqueFKIDs.has(FKid)) {
        uniqueFKIDs.add(FKid);
        const subjects = result.rows
          .filter((r) => r.f_k === row.f_k)
          .map((r) => ({ subject_name: r.subject_name, grade: r.grade_name, subject_code: r.subject_code, credithours: r.credithours }));

        // Prepare semester data
        const semesterData = {
          StuId: row.studentid,
          FKid: FKid,
          course: row.courseid,
          AcadYearName: row.acad_year_name,
          AcadYear: AcadYear,
          semester: semester,
          SemesterName: row.semestername,
          semestergpa: blockReasonForFKid !== "" ? "" : row.semestergpa,
          semesterhr: blockReasonForFKid !== "" ? "" : row.semesterhr,
          currentgpa: blockReasonForFKid !== "" ? "" : row.currentgpa,
          finalgrade: blockReasonForFKid !== "" ? "" : row.finalgrade,
          blocked: blockReasonForFKid !== "" ? true : false, // Set to true if blockReasonForFKid is not empty
          blockReason: blockReasonForFKid, // Use blockReasonForFKid instead of blockReason
          subjects: blockReasonForFKid !== "" ? [] : subjects,
        };

        uniqueData.push(semesterData);
        // console.log(semesterData)
      }
    });
    client.release();
    console.log("client release");;

    return uniqueData;
  } catch (error) {
    client.release()
    console.error("Error fetching data:", error.message);
    return [];
  }
}

module.exports = { fetchStudentByCode };

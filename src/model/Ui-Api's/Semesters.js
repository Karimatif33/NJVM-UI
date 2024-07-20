// const { pool, connect } = require("../../db/dbConnect");

// async function fetchStudentByCode(id) {
//   const query = `
//     SELECT 
//       StudentSemesters.students.studentid, 
//       StudentSemesters.students.id, 
//       StudentSemesters.students.courseid,
//       StudentSemesters.students.acadyear, 
//       StudentSemesters.students.semester, 
//       StudentSemesters.students.semestergpa,
//       StudentSemesters.students.semesterhr,
//       StudentSemesters.students.currentgpa,
//       StudentSemesters.students.finalgrade,
//       StudentSemesters.students.blocked,
//       AcadYearData.acadyeardata.name AS acad_year_name,
//       SemesterData.semesterdata.name AS SemsterName
//     FROM StudentSemesters.students
//     LEFT JOIN CourseData.courses ON StudentSemesters.students.courseid = CourseData.courses.id
//     LEFT JOIN AcadYearData.acadyeardata ON StudentSemesters.students.acadyear = AcadYearData.acadyeardata.id
//     LEFT JOIN SemesterData.semesterdata ON StudentSemesters.students.semester = SemesterData.semesterdata.id
//     LEFT JOIN StudentTranscript.students ON StudentSemesters.students.id = StudentTranscript.students.fk
//     WHERE StudentSemesters.students.studentid = $1;
//   `;

//   try {
//     const client = await pool.connect();
//     console.log("Fetching data for id:", id);
//     const result = await client.query(query, [id]);

//     const uniqueData = [];
//     const uniqueFKIDs = new Set();

//     result.rows.forEach((row) => {
//       const FKid = row.id;
//       if (!uniqueFKIDs.has(FKid)) {
//         uniqueFKIDs.add(FKid);
//         uniqueData.push({
//           StuId: row.studentid,
//           FKid: FKid,
//           course: row.courseid,
//           AcadYearName: row.acad_year_name,
//           SemsterName: row.semstername, // Fix the property name here
//           semestergpa: row.semestergpa,
//           semesterhr: row.semesterhr,
//           currentgpa: row.currentgpa,
//           finalgrade: row.finalgrade,
//           blocked: row.blocked || "Unknown",
//         });
//       }
//     });

//     client.release();
//     console.log("client releases");

//     return uniqueData;
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     return [];
//   }
// }

// module.exports = { fetchStudentByCode };

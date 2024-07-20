const { pool } = require("../../db/dbConnect");

async function fetchDataByIdFromDB(code) {
  const query = `
    SELECT 
      answers.instructors.student_id, 
      answers.instructors.subject_id,
      answers.instructors.instructor_id,
      answers.instructors.courseid AS courseid,
      answers.instructors.academic_year,
      answers.instructors.semester, 
      answers.instructors.answered
    FROM answers.instructors
    WHERE answers.instructors.student_id = $1;
  `;

  try {
    const client = await pool.connect();
    if (code === null || isNaN(code)) {
      code = 0;
    } else {
      code = parseInt(code);
      console.log("Fetching data for id:", code);
    }

    const result = await client.query(query, [code]);

    // Initialize an object to store subjects and their instructors
    const subjectsArray = [];
    
    // Iterate through the query result to populate the subjects array
    result.rows.forEach((row) => {
      const studentid = row.student_id;
      const subjectid = row.subject_id;
      const instructor_id = row.instructor_id;
      const courseid = row.courseid;
      const academicyear = row.academic_year;
      const semester = row.semester;
      const answered = row.answered;

      subjectsArray.push({
        studentid: studentid,
        subjectid: subjectid,
        // academicyearid: academicyear,
        // semesterid: semester,
        // courseid: courseid,
        answered: answered,
        instructorid: instructor_id
      });
    });
    
    client.release();
    console.log("Client released");
    return subjectsArray;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
}

module.exports = { fetchDataByIdFromDB };

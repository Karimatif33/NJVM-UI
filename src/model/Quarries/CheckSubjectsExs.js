const { pool } = require("../../db/dbConnect");

async function fetchDataByIdFromDB(code) {
  const query = `
    SELECT 
      answers.subjects.student_id, 
      answers.subjects.subject_id,
      answers.subjects.courseid AS courseid,
      answers.subjects.academic_year,
      answers.subjects.semester, 
      answers.subjects.answered
    FROM answers.subjects
    WHERE answers.subjects.student_id = $1;
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
    const subjectsMap = new Map();
    
    // Iterate through the query result to populate the subjects map
    result.rows.forEach((row) => {
      const studentid = row.student_id;
      const subjectid = row.subject_id;
      const courseid = row.courseid;
      const academicyear = row.academic_year;
      const semester = row.semester;
      const answered = row.answered;
      
      if (!subjectsMap.has(subjectid)) {
        subjectsMap.set(subjectid, {
          studentid: studentid,
          subjectid: subjectid,
          academicyearid: academicyear,
          semesterid: semester,
          courseid : courseid,
          answered : answered,
        });
      }
      
      // Add additional data if necessary
      // Example: subjectsMap.get(subjectid).instructors.push({ Name: staffName, Id: faculty });
    });

    // Convert subjects map to array of objects
    const subjectsData = Array.from(subjectsMap.values());

    client.release();
    console.log("Client released");
    return subjectsData;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
}

module.exports = { fetchDataByIdFromDB };

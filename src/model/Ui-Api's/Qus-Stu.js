const { pool } = require("../../db/dbConnect");

async function fetchDataByIdFromDB(code) {
  const query = `
    SELECT 
      questionnaire.qus_stu.subject, 
      questionnaire.qus_stu.faculty,
      StudentData.students.courseid AS courseid,
      questionnaire.qus_stu.academicyear,
      questionnaire.qus_stu.semester, 
      coursesubjects.subjects.name AS SubName,
      staffdata.staff.name AS StaffName
    FROM questionnaire.qus_stu
    LEFT JOIN StudentData.students ON questionnaire.qus_stu.student = StudentData.students.id
    LEFT JOIN coursesubjects.subjects ON questionnaire.qus_stu.subject = coursesubjects.subjects.id
    LEFT JOIN staffdata.staff ON questionnaire.qus_stu.faculty = staffdata.staff.id
    WHERE questionnaire.qus_stu.student = $1;
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
      const subjectId = row.subject;
      const subjectName = row.subname;
      const staffName = row.staffname;
      const faculty = row.faculty;
      const courseid = row.courseid;

    
      if (!subjectsMap.has(subjectId)) {
        subjectsMap.set(subjectId, {
          subjectid: subjectId,
          academicyearid: row.academicyear,
          semesterid: row.semester,
          courseid : courseid,
          subjectName: subjectName,
          faculty: faculty,
          instructors: [],
        });
      }
    
      subjectsMap.get(subjectId).instructors.push({ Name: staffName, Id: faculty });
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

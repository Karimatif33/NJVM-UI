const { pool, connect } = require("../../db/dbConnect");

async function fetchDataByIdFromDB(code) {
  const query = `
    SELECT 
      totaldata.totals_data.id, 
      totaldata.totals_data.gpa, 
      totaldata.totals_data.hours,
      totaldata.totals_data.level, 
      totaldata.totals_data.advisor, 
      totaldata.totals_data.updatedat,
      studentcheckblock.block.blockreason,
      StudentData.students.code AS code, 
      StudentData.students.enname AS student_name, 
      StudentData.students.courseid AS courseid,
      StaffData.staff.name AS staff_name,
      CourseData.courses.name AS Course,
      Levels.levels.name AS levelName,
      CourseData.courses.credithours AS credithours
    FROM totaldata.totals_data
    LEFT JOIN StudentData.students ON totaldata.totals_data.id = StudentData.students.id
    LEFT JOIN studentcheckblock.block ON totaldata.totals_data.id = studentcheckblock.block.stu_id
    LEFT JOIN StaffData.staff ON totaldata.totals_data.advisor = StaffData.staff.id
    LEFT JOIN CourseData.courses ON StudentData.students.courseid = CourseData.courses.id
    LEFT JOIN Levels.levels ON totaldata.totals_data.level = Levels.levels.id
    WHERE StudentData.students.code = $1;
  `;

  try {
    const client = await pool.connect();
    if (code === null || isNaN(code)) {
      code = 0;
    }
    else {
      code = parseInt(code);
      console.log("Fetching data for id:", code);
    }
    const result = await client.query(query, [code]);
    const dataWithDefaults = result.rows.map((row) => {
      const credithours = row.credithours || 0; // Default to 0 if undefined
      const hours = row.hours || 0; // Default to 0 if undefined
      const neededHours = Math.abs(hours - credithours);
      console.log(row);
      return {
        id: row.id,
        gpa: row.gpa,
        hours: hours,
        level: row.level,
        advisor: row.advisor,
        updatedat: row.updatedat,
        code: row.code,
        student_name: row.student_name || "Unknown",
        course_id: row.courseid,
        staff_name: row.staff_name || "Unknown Staff",
        Course: row.course || "Unknown Course",
        levelname: row.levelname || "Unknown levelName",
        credithours: credithours,
        neededHours: neededHours,
        blockreason: row.blockreason || ""
      };
    });

    // console.log("Transformed Data:", dataWithDefaults);
    client.release();
    console.log("client relases");
    return dataWithDefaults;
  } catch (error) {
    console.error("Error fetching datas:", error.message);
    return [];
  }
}
module.exports = { fetchDataByIdFromDB };

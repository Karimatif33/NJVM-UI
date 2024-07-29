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
      StudentData.students.isadmin AS isadmin, 
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
  const queryAdmin = `
  SELECT 
    code AS code, 
    isadmin AS isadmin, 
    enname AS student_name
  FROM StudentData.students
  WHERE code = $1;
`;
  try {
    const client = await pool.connect();
    // Validate and parse the code
    if (code === null || isNaN(code)) {
      code = 0; // Default value or handle the invalid case
    } else {
      code = parseInt(code, 10); // Convert to integer
      console.log("Fetching data for id:", code);
    }

    // Convert code to string to check its length
    const codeStr = code.toString();
    
    let result;
    if (codeStr.length === 7 && /^\d+$/.test(codeStr)) {
      // Code is 7 digits long
      result = await client.query(query, [code]);
    } else {
      // Code is not 7 digits long
      result = await client.query(queryAdmin, [code]);
    }

    // console.log(result)
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
        IsAdmin: row.isadmin,
        student_name: row.student_name || "",
        course_id: row.courseid,
        staff_name: row.staff_name || "",
        Course: row.course || "",
        levelname: row.levelname || "",
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
    console.error("Error fetching data:", error.message);
    return [];
  }
}
module.exports = { fetchDataByIdFromDB };

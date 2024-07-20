const { pool, connect } = require("../../db/dbConnect");

async function fetchDataByIdFromDB(code) {
  const query = `
  SELECT
  cs.id,
  cs.name,
  cs.code,
  cs.courseid,
  cs.credithours,
  cs.level,
  cs.type,
  cs.Prerequisites,
  ARRAY_AGG(prerequisite.name) AS PrerequisiteNames
FROM
  CourseSubjects.subjects AS cs
LEFT JOIN
  CourseSubjects.subjects AS prerequisite ON cs.Prerequisites @> ARRAY[prerequisite.id]
LEFT JOIN
  CourseData.courses AS cd ON cs.courseid = cd.id
WHERE
  cs.courseid = $1
GROUP BY
  cs.id;
  `;
//   const query = `
//   SELECT 
//   CourseSubjects.subjects.id, 
//   CourseSubjects.subjects.name, 
//   CourseSubjects.subjects.code, 
//   CourseSubjects.subjects.courseid,
//   CourseSubjects.subjects.credithours, 
//   CourseSubjects.subjects.level, 
//   CourseSubjects.subjects.type,
//   CourseSubjects.subjects.Prerequisites
// FROM CourseSubjects.subjects
// LEFT JOIN CourseData.courses ON CourseSubjects.subjects.courseid = CourseData.courses.id
// WHERE CourseSubjects.subjects.courseid = $1;
//   `;
  try {
    const client = await pool.connect();
    if (code === null || isNaN(code)) {
      code = 0;
    } else {
      code = parseInt(code);
      console.log("Fetching data for id:", code);
    }
    const result = await client.query(query, [code]);
    // console.log(result);
    const dataWithDefaults = result.rows.map((row) => {

      return {
        id: row.id,
        name: row.name,
        code: row.code,
        courseid: row.courseid,
        credithours: row.credithours,
        level: row.level,
        type: row.type,
        prerequisitesId: row.prerequisites,
        prerequisitesName:
          row.prerequisitenames === null ? "" : row.prerequisitenames,
      };
    });

    // console.log("Transformed Data:", dataWithDefaults);
    client.release();
    // console.log("client relases");
    return dataWithDefaults;
  } catch (error) {
    console.error("Error fetching datas:", error.message);
    return [];
  }
}
module.exports = { fetchDataByIdFromDB };

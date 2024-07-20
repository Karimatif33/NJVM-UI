const { pool } = require("../../db/dbConnect");

async function fetchBlockTime() {
  let client;
  try {
    client = await pool.connect(); // Connect to the database

    // const query = `
    //   SELECT selectedacadyearvalue, selectedacadyearName
    //   FROM Acad_year.Acad_year_Value;
    // `;

    const query = `
      SELECT av.selectedacadyearvalue, av.selectedacadyearName, ot.selectedSemesterValue, ot.selectedSemesterName
      FROM Acad_year.BlockTime AS av
      INNER JOIN Cur_Semester.BlockTime AS ot ON av.id = ot.id
    `;

    const result = await client.query(query); 
    console.log(result);
    // Check if there are rows returned
    if (result.rows.length > 0) {
      const selectedacadyearvalue = result.rows[0].selectedacadyearvalue;
      let selectedacadyearName = result.rows[0].selectedacadyearname;
      const selectedSemesterValue = result.rows[0].selectedsemestervalue;
      let selectedSemesterName = result.rows[0].selectedsemestername;
      let UpdateStudent = result.rows[0].active;

      return {
        selectedacadyearvalue,
        selectedacadyearName,
        selectedSemesterValue,
        selectedSemesterName,
        UpdateStudent,
      }; // Return both values
    } else {
      console.log("No rows returned from the query");
      return null; // Return null if no rows are returned
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null; // Return null in case of an error
  } finally {
    if (client) {
      client.release(); // Release the client back to the pool
    }
  }
}

module.exports = { fetchBlockTime };

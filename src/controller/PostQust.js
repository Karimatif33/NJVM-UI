const { connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
// const { createSchemaAndTable } = require("../model/UpdateStudentSchema");

exports.PostQust = AsyncHandler(async (req, res) => {
    const client = await connect();
    const query = `
    SELECT av.selectedacadyearvalue, av.selectedacadyearName, ot.selectedSemesterValue, ot.selectedSemesterrName
    FROM Acad_year.Acad_year_Value AS av
    INNER JOIN Cur_Semester.Semester AS ot ON av.id = ot.id;
  `;

const result = await client.query(query);
const selectedacadyearvalue = result.rows[0].selectedacadyearvalue; // Access the value of the id column from the first row
const selectedsemestervalue = result.rows[0].selectedsemestervalue; // Access the value of the id column from the first row

const { selectedOptions, comments, type, subjectId, instructorId, userDB, userCode, courseid } = req.body;
const newInstructorId = instructorId ?? 0;
console.log(`Selected Options:`, selectedOptions);
console.log(`Comments:`, comments);
console.log(`type:`, type);
console.log(`Subject ID:`, subjectId);
console.log(`Instructor ID:`, newInstructorId);
console.log(`User DB:`, userDB);
console.log(`User Code:`, userCode);
console.log("ID semester:", selectedsemestervalue);
console.log("ID Acdyear:", selectedacadyearvalue);
console.log("ID Course:", courseid);
    
try {
    for (const option of selectedOptions) {
        const qusId = option.qusId;
        let columnToUpdate;
    
        console.log(`Question ID: ${qusId}`);
    
        // Determine which column to update based on the selected option id
        switch (option.id) {
          case 1:
            columnToUpdate = 'option1_count';
            break;
          case 2:
            columnToUpdate = 'option2_count';
            break;
          case 3:
            columnToUpdate = 'option3_count';
            break;
          default:
            console.error(`Invalid option selected for question ID ${qusId}`);
            continue; // Skip this iteration if option is invalid
        }
    
  
      // Check if the record exists for the given qusId, courseid, semester, and academic_year
      const { rowCount } = await client.query(
        `SELECT id FROM answers.questions 
         WHERE id = $1 AND courseid = $2 AND semester = $3 AND academic_year = $4 AND subject_id = $5 AND instructor_id = $6`,
        [qusId, courseid, selectedsemestervalue, selectedacadyearvalue, subjectId, newInstructorId]
      );
  
      if (rowCount > 0) {
        // Record exists, so update the existing record
        await client.query(
          `UPDATE answers.questions 
           SET ${columnToUpdate} = ${columnToUpdate} + 1
           WHERE id = $1 AND courseid = $2 AND semester = $3 AND academic_year = $4 AND subject_id = $5 AND instructor_id = $6`,
          [qusId, courseid, selectedsemestervalue, selectedacadyearvalue, subjectId, newInstructorId]
        );
      } else {
        // Record does not exist, so insert a new record
        await client.query(
           `INSERT INTO answers.questions (question_id, ${columnToUpdate}, courseid, semester, academic_year, subject_id, instructor_id)
       VALUES ($1, 1, $2, $3, $4, $5, $6)
       ON CONFLICT (question_id, courseid, semester, academic_year, subject_id, instructor_id) DO UPDATE SET ${columnToUpdate} = answers.questions.${columnToUpdate} + 1
       RETURNING id`,
      [qusId, courseid, selectedsemestervalue, selectedacadyearvalue, subjectId, newInstructorId]
        );
      }
    }




  
    // Mark the subject or instructor as answered
    if (type === 'course') {
      await client.query(
        `INSERT INTO answers.subjects (subject_id, student_id, courseid, semester, academic_year, answered) 
         VALUES ($1, $2, $3, $4, $5, TRUE)
         ON CONFLICT (subject_id, student_id, courseid, semester, academic_year) 
         DO UPDATE SET answered = TRUE;`,
        [subjectId, userDB, courseid, selectedsemestervalue, selectedacadyearvalue]
      );
    }
    
    if (type === 'instructors') {
      await client.query(
        `INSERT INTO answers.instructors (subject_id, student_id, instructor_id, courseid, semester, academic_year, answered) 
         VALUES ($1, $2, $3, $4, $5, $6, TRUE)
         ON CONFLICT (subject_id, student_id, instructor_id, courseid, semester, academic_year) 
         DO UPDATE SET answered = TRUE;`,
        [subjectId, userDB, newInstructorId, courseid, selectedsemestervalue, selectedacadyearvalue]
      );
    }
    
        


//     const { rows: allQuestions } = await client.query(
//       'SELECT * FROM questionnaire.qus_stu WHERE student = $1 AND academicyear = $2 AND semester = $3', 
//       [userDB, selectedacadyearvalue, selectedsemestervalue]
//     );
//     console.log(allQuestions)
//     const allAnswered = allQuestions.every((question) =>
//       selectedOptions.some(option => option.qusId === question.id)
//     );
// console.log(allAnswered)
//     if (allAnswered) {
//       console.log("finish")
//       await client.query(
//         'INSERT INTO answers.students SET finished = TRUE WHERE userDB = $1',
//         [userDB]
//       );
//     }

    res.status(200).send({ message: 'Questionnaire submitted successfully' });
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    res.status(500).send({ message: 'Error submitting questionnaire' });
  } finally {
    // Remember to release the client to the pool after use
    client.release();
  }
});

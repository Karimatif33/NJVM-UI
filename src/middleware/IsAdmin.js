const { pool, connect } = require("../db/dbConnect");


const isAdmin = async (req, res, next) => {
  try {
    // Find the user
    const userId = req?.userAuth?.id;
    console.log(userId, "userID")
    const queryText = 'SELECT isadmin FROM studentdata.students WHERE id = $1';
    const { rows } = await pool.query(queryText, [userId]);
    const adminFound = rows[0];

    // Check if isAdmin
    if (adminFound && adminFound.isadmin === true) {
      next();
    } else {
      next(new Error("Access Denied, admin only"));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;
 
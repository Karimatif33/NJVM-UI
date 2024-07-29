// controllers/uiTotalsDataController.js
const { fetchStudentByCode } = require("../../model/Ui-Api's/Transcript"); // Adjust the path based on your actual file structure

async function uiTranscriptController(req, res) {
  try {
    let id = req.params.id;
    
    if (id === null || isNaN(id)) {
      id = 0;
    } else {
      id = parseInt(id);
      const data = await fetchStudentByCode(id);
      res.json(data);
    }
    // console.log(id)
  } catch (error) {
    console.error("Error fetching dataa:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { uiTranscriptController };

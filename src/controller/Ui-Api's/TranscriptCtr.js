// controllers/uiTotalsDataController.js
const { fetchStudentByCode } = require("../../model/Ui-Api's/Transcript"); // Adjust the path based on your actual file structure

async function uiTranscriptController(req, res) {
  try {
    const id = req.params.id;
    const data = await fetchStudentByCode(id);
    // console.log(id)
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { uiTranscriptController };

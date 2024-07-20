// controllers/uiTotalsDataController.js
const { fetchDataByIdFromDB } = require("../../model/Ui-Api's/TotalData"); // Adjust the path based on your actual file structure

async function uiTotalsDataController(req, res) {
  try {
    const code = req.params.code; // Assuming the ID is passed as a route parameter
    const data = await fetchDataByIdFromDB(code); 
    
    res.json(data); 
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { uiTotalsDataController };

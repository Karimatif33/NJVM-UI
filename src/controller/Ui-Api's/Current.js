const { fetchCurrent } = require("../../model/Ui-Api's/Current"); 

async function uiCurrent(req, res) {
  try {
    const data = await fetchCurrent(); 
    console.log(data)
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { uiCurrent };

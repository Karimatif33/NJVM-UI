const { fetchBlockTime } = require("../../model/Ui-Api's/BlockTime"); 

async function fetchBlock(req, res) {
  try {
    const data = await fetchBlockTime(); 
    console.log(data)
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { fetchBlock };

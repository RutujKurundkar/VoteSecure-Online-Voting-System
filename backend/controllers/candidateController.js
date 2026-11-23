const db = require("../config/db");

async function listByElection(req, res) {
  try {
    const electionId = Number(req.params.electionId);
    if (!Number.isInteger(electionId) || electionId < 1) {
      return res.status(400).json({ message: "Invalid election ID" });
    }
    const [rows] = await db.execute(
      `SELECT c.candidate_id, c.election_id, c.candidate_name, c.candidate_description,
              p.party_name, p.party_symbol
       FROM candidates c LEFT JOIN parties p ON p.party_id = c.party_id
       WHERE c.election_id = ? ORDER BY c.candidate_name`,
      [electionId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load candidates" });
  }
}

module.exports = { listByElection };

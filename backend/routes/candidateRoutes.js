const express = require("express");
const { listByElection } = require("../controllers/candidateController");
const router = express.Router();
router.get("/election/:electionId", listByElection);
module.exports = router;

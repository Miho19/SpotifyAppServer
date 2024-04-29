const express = require("express");
const router = express.Router();

const { users } = require("../src/utils");

router.get("/", (req, res) => {
  res.status(200).json([...users]);
});

module.exports = router;

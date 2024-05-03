const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { id } = req.session;
});

module.exports = router;

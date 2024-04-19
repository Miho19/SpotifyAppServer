const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  return res.status(404).json({ error: "Path not found", error: 404 });
});

module.exports = router;

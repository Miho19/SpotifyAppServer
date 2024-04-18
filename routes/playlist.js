const express = require("express");
const router = express.Router();

const playlist = [{ id: 1, name: "first song" }];

router.get("/", (req, res) => {
  res.json(playlist).status(200);
});

module.exports = router;

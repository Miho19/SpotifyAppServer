const express = require("express");
const router = express.Router();

const { users, usersAdd, usersGet } = require("../src/utils");

router.get("/", (req, res) => {
  res.status(200).json([...users]);
});

router.post("/", (req, res) => {
  const body = req.body;
  const response = usersAdd(body);
  res.status(201).json({ ...response });
});

router.get("/:userID", (req, res) => {
  const { userID } = req.params;
  const user = usersGet(userID);
  res.status(200).json({ ...user });
});

module.exports = router;

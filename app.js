require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index");
const playlistRouter = require("./routes/playlist");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/playlist", playlistRouter);
app.use("/", indexRouter);

app.listen(PORT);

module.exports = app;

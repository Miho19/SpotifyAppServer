require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index");
const playlistRouter = require("./routes/playlist");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/playlists", playlistRouter);
app.use("/", indexRouter);

module.exports = app;

require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const playlistRouter = require("./routes/playlist");
const indexRouter = require("./routes/index");
const { errorHandler } = require("./src/errors/AppError");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/playlists", playlistRouter);
app.use(indexRouter);

app.use(errorHandler);

module.exports = app;

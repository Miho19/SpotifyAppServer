require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { v4: uuid } = require("uuid");

const playlistRouter = require("./routes/playlist");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");

const { errorHandler } = require("./src/errors/AppError");
const { spotifyApiInitialise } = require("./src/spotifyApi/init");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/playlists", playlistRouter);
app.use("/users", userRouter);
app.use(indexRouter);

app.use(session({ secret: uuid(), resave: false, saveUninitialized: true }));

app.use(errorHandler);

spotifyApiInitialise();

module.exports = app;

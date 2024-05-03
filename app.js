require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { v4: uuid } = require("uuid");

const playlistRouter = require("./routes/playlist");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");

const { errorHandler } = require("./src/errors/AppError");
const Auth0Manager = require("./src/Auth0/Auth0");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/playlists", playlistRouter);
app.use("/users", userRouter);
app.use(indexRouter);

app.use(session({ secret: uuid(), resave: false, saveUninitialized: true }));

app.use(errorHandler);

const Auth0 = new Auth0Manager();

Auth0.initialise()
  .then(async (response) => {})
  .catch((err) => console.log(err));

module.exports = app;

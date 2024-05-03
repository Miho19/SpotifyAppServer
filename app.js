require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { v4: uuid } = require("uuid");

const playlistRouter = require("./routes/playlist");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const auth0Router = require("./routes/auth0");

const { errorHandler } = require("./src/errors/AppError");
const Auth0Manager = require("./src/Auth0/Auth0");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "supersecretsecret",
    resave: false,
    saveUninitialized: true,
  })
);

const Auth0 = new Auth0Manager();

Auth0.initialise()
  .then(async (response) => {})
  .catch((err) => console.log(err));

app.use("/playlists", playlistRouter);
app.use("/users", userRouter);
app.use("/auth0", auth0Router);
app.use(indexRouter);
app.use(errorHandler);

module.exports = app;

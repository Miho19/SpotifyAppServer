require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { v4: uuid } = require("uuid");
const cors = require("cors");

const playlistRouter = require("./routes/playlist");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const auth0Router = require("./routes/auth0");
const spotifyRouter = require("./routes/spotify");

const { errorHandler } = require("./src/errors/AppError");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(
  session({
    secret: "supersecretsecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/playlists", playlistRouter);
app.use("/users", userRouter);
app.use("/auth0", auth0Router);
app.use("/spotify", spotifyRouter);

app.use(indexRouter);
app.use(errorHandler);

module.exports = { app };

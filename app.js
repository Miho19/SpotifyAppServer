require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");

const indexRouter = require("./routes/index");
const auth0Router = require("./routes/auth0");
const spotifyRouter = require("./routes/spotify");

const { errorHandler } = require("./src/errors/AppError");

const MysqlLocalHost = require("./src/database/mysqlLocalHost");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

app.use(
  session({
    secret: "supersecretsecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/auth0", auth0Router);
app.use("/spotify", spotifyRouter);

app.use(indexRouter);
app.use(errorHandler);

const mysql = new MysqlLocalHost();

async function init() {
  try {
    await mysql.initialise();
    return app;
  } catch (error) {
    console.error("Failed init process");
    process.exit();
  }
}

module.exports = init;

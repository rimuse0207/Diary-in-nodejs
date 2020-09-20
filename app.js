const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const diaryRouter = require("./routes/diary");
const sequelize = require("./models").sequelize;
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportConfig = require("./passport");
const methodOverride = require("method-override");

var app = express();
sequelize.sync();
passportConfig(passport);

app.use(
  session({
    // 2
    secret: process.env.COOKIE_SECRET, // 암호화
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

console.log("DB success");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/diary", diaryRouter);
app.use("/upload", express.static("uploads"));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const reportRouter = require("./routes/records");
const apiRouter = require("./routes/api");

const cors = require("cors");

const app = express();

// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
const dev_db_url =
  "mongodb://<ExampleUser>:<ExamplePass>@ds031108.mlab.com:31108/local-records";
// Alternate from Atlas mongodb+srv://<ExampleUser>:<ExamplePass>@cluster0-5vd6p.azure.mongodb.net/test?retryWrites=true
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const allowedOrigins = [
  "http://localhost:4200",
  "https://fathomless-atoll-23643.herokuapp.com/"
];

// const corsOptions = {
//   origin: function(origin, callback) {
// allow curl and mobile Reqs
//     if (!origin) {
//       return callback(null, true);
//     }
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg =
//         "The CORS policy for this site does not permit access from your requested origin";
//       return callback(new Error(msg), false);
//     }

//     return callback(null, true);
//   },
//   optionsSuccessStatus: 200
// };

const corsOptions = {
  origin: function(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/records", reportRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Angular 2+ set up
// ! Fingers crossed this actually works
// Serve only the static files from the dist directory
// app.use(express.static(__dirname + "/dist/ang-records"));

// app.get("/*", function(req, res) {
//   res.sendFile(path.join(__dirname + "/dist/ang-records/index.html"));
// });

// Start the app by listening on the default Heroku port
// app.listen(process.env.PORT || 8080);

module.exports = app;

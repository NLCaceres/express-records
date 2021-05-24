const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const favicon = require("serve-favicon");
// require("dotenv").config(); //* Enables process.env vars + USUALLY easier / more natural than using a config file to export env vars
//? Why isn't it easier here? Because we'll have to CONSTANTLY use it in every file that requires env vars
//? That aspect of using dotenv as a package.json dependency (vs as a devDependency) is very easy to take for granted 
//? When more opinionated frameworks (like Laravel) will inject those env vars throughout your monolith app (front-end & back-end). 
//? E.g. Angular 2+ delegates secret env vars entirely to the backend since all env vars set in your Ng app will be visible once committed in the repo 
const { dbUsername, dbPassword } = require("./config"); //* Instead, we can have a config.js file load all necessary env vars and port in any we need!
//* Comes down to preference, but the bonus of config.js means 1 less package.json dependency (devDependency instead)

const indexRouter = require("./routes/index");
const reportRouter = require("./routes/records");
const apiRouter = require("./routes/api");

const cors = require("cors");

const app = express();

const mongoose = require("mongoose"); //* MongoDB ODM (Object Document Mapper - similar to ORM, Object Relational Mapper)

// Alternate from Atlas
const alt_dev_db_url = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.5vd6p.azure.mongodb.net/dev?retryWrites=true&w=majority`;

const mongoDB = process.env.DB_URL || alt_dev_db_url;
mongoose.connect(mongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});
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
  "https://infection-prevention-ang.herokuapp.com"
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
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.use("/", indexRouter);
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

// const dotenv = require("dotenv"); // Neither of these two lines needed if dotenv is preload with -r flag!
// dotenv.config();
module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
};

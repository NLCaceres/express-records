const dotenv = require("dotenv"); //* Could include '-r dotenv/config' in package.json dev scripts (quickstart, devstart) BUT 
const dotenvExpand = require('dotenv-expand'); //* Dotenv currently doesn't support expanding env vars out of the box 
var env = dotenv.config();
dotenvExpand(env); //* Without this separate package, .env files can't do FOO="foo" FOOBAR="${FOO}bar"
//* BUT there does exist dotenv-with-expand, which supports the PullRequest currently sitting in Dotenv limbo.
//* Which would force the above '-r dotenv/config' to work but as '-r dotenv-with-expand/config'. Maybe one day!

module.exports = {
  port: process.env.PORT,
  debugDev: process.env.DEBUG_DEV,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbURL: process.env.DB_URL
};

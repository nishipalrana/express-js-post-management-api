const dotenv = require("dotenv");
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const mongoDbUserName = process.env.MONGODB_USERNAME;
const mongoDbPassword = process.env.MONGODB_PASSWORD;
const mongoDbClusterURL = process.env.MONGODB_CLUSTER_URL;

module.exports = {
  jwtSecret,
  mongoDbUserName,
  mongoDbPassword,
  mongoDbClusterURL,
};

const mongoose = require("mongoose");
const {
  mongoDbUserName,
  mongoDbPassword,
  mongoDbClusterURL,
} = require("../../env-config");

// Connect to MongoDB
const connectMongoDb = () => {
  mongoose
    .connect(
      `mongodb+srv://${mongoDbUserName}:${mongoDbPassword}@${mongoDbClusterURL}/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
    });
};

module.exports = { connectMongoDb };

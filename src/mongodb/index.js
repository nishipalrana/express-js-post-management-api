const postSchema = require("./post-schema");
const userSchema = require("./user-schema");
const { connectMongoDb } = require("./connectMongoDb");

module.exports = { postSchema, userSchema, connectMongoDb };

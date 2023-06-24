const { registerHandler, loginHandler } = require("./auth");
const {
  createPostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
  updatePostByIdHandler,
  deletePostHandler,
} = require("./post");
const {
  getProfileHandler,
  updateProfileHandler,
  updateProfilePictureHandler,
  deleteProfileHandler,
} = require("./profile");

module.exports = {
  registerHandler,
  loginHandler,
  getProfileHandler,
  updateProfileHandler,
  updateProfilePictureHandler,
  deleteProfileHandler,
  createPostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
  updatePostByIdHandler,
  deletePostHandler,
};

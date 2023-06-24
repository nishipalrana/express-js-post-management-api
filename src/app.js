// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const { connectMongoDb } = require("./mongodb");
const { authenticate } = require("./middlewares/authentication");
const {
  registerHandler,
  loginHandler,
  getProfileHandler,
  updateProfileHandler,
  deleteProfileHandler,
  updateProfilePictureHandler,
  getAllPostsHandler,
  createPostHandler,
  getPostByIdHandler,
  updatePostByIdHandler,
  deletePostHandler,
} = require("./helpers");

  // Create an express app
  const app = express();

  // Set up body-parser middleware for parsing JSON data as well as for accepting multipart/form-data
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  app.use(bodyParser.json());

  // Add error handling middleware to handle any unhandled errors
  app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  });

  // Serve Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  //Connect to MongoDb Database
  connectMongoDb();

  // Multer configuration for buffer upload
  const storage = multer.memoryStorage(); // Use memoryStorage instead of diskStorage
  const upload = multer({ storage: storage });

  /****************************************** Auth management endpoints ******************************************/

  // Register endpoint
  app.post("/register", upload.single("profilePicture"), registerHandler);

  // Login endpoint
  app.post("/login", loginHandler);

  /****************************************** Profile management endpoints ******************************************/

  // Get user profile
  app.get("/profile", authenticate, getProfileHandler);

  // Update user profile
  app.put(
    "/profile",
    authenticate,
    upload.single("profilePicture"),
    updateProfileHandler
  );

  // Delete user profile
  app.delete("/profile", authenticate, deleteProfileHandler);

  // Upload user profile picture
  app.put(
    "/profile/picture",
    authenticate,
    upload.single("profilePicture"),
    updateProfilePictureHandler
  );

  /****************************************** Post management endpoints ******************************************/

  // Create a new post
  app.post("/posts", authenticate, upload.single("image"), createPostHandler);

  // Get all posts of the authenticated user
  app.get("/posts", authenticate, getAllPostsHandler);

  // Get a specific post of the authenticated user
  app.get("/posts/:postId", authenticate, getPostByIdHandler);

  // Update a specific post of the authenticated user
  app.put(
    "/posts/:postId",
    authenticate,
    upload.single("image"),
    updatePostByIdHandler
  );

  // Delete a specific post of the authenticated user
  app.delete("/posts/:postId", authenticate, deletePostHandler);

  // Start the server
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });

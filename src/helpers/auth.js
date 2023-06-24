const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../env-config");
const { userSchema } = require("../mongodb");

const User = userSchema?.User;

const registerHandler = async (req, res) => {
  try {
    const { email, password, name, address } = req.body;
    // Access uploaded file as a buffer using req.file.buffer
    const profilePicture = req?.file?.buffer;
    // Check if email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      address,
      profilePicture,
    });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Failed to register user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Generate and sign a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Failed to login user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerHandler, loginHandler };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../env-config");
const { registerHandler, loginHandler } = require("./auth");
const { userSchema } = require("../mongodb");
const User = userSchema.User;
jest.mock("../mongodb");

const UserMock = {
  email: "test@example.com",
  password: "hashedPassword",
  name: "Test User",
  address: "123 Test Street",
  profilePicture: Buffer.from("test"),
};

describe("loginHandler", () => {
  it("returns a JWT token if the user credentials are correct", async () => {
    // Mock the request and response objects
    const req = { body: { email: "test@test.com", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValueOnce({
      _id: "test-id",
      email: "test@test.com",
      password: await bcrypt.hash("password", 10),
    });

    await loginHandler(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });

    const decodedToken = jwt.verify(res.json.mock.calls[0][0].token, jwtSecret);
    expect(decodedToken.userId).toBe("test-id");
  });

  it("returns an error if the user with the given email does not exist", async () => {
    const req = {
      body: { email: "nonexistent@test.com", password: "password" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValueOnce(null);

    await loginHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid email or password",
    });
  });

  it("returns an error if the provided password does not match the hashed password in the database", async () => {
    const req = {
      body: { email: "test@test.com", password: "wrong-password" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValueOnce({
      _id: "test-id",
      email: "test@test.com",
      password: await bcrypt.hash("password", 10),
    });

    await loginHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid email or password",
    });
  });
});

describe("registerHandler", () => {
  test("registers a new user", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        address: "123 Test Street",
      },
      file: { buffer: Buffer.from("test") },
    };
    const res = { json: jest.fn() };
    User.prototype.findOne = jest.fn().mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue(UserMock);
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");

    await registerHandler(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
    });
  });

  test("returns 400 if email is already registered", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        address: "123 Test Street",
      },
      file: { buffer: Buffer.from("test") },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.prototype.findOne = jest.fn().mockResolvedValue({ value: "value" });

    await registerHandler(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  test("returns 500 on error", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        address: "123 Test Street",
      },
      file: { buffer: Buffer.from("test") },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const error = new Error("Failed to save user");

    User.prototype.findOne = jest.fn().mockRejectedValue(error);

    await registerHandler(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
  });
});

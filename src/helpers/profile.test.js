const {
  getProfileHandler,
  updateProfileHandler,
  deleteProfileHandler,
  updateProfilePictureHandler,
} = require("./profile");
const { userSchema } = require("../mongodb");
const User = userSchema?.User;

jest.mock("../mongodb", () => ({
  userSchema: {
    User: {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
    },
  },
}));

describe("User profile handlers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfileHandler", () => {
    it("should return user profile", async () => {
      const mockUser = {
        name: "John Doe",
        address: "123 Main St",
        password: "85t8g7df9g783t",
      };
      User.findById = jest
        .fn()
        .mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      const mockReq = { userId: "123" };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await getProfileHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
      User.findById = jest
        .fn()
        .mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      const mockReq = { userId: "123" };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await getProfileHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 on internal server error", async () => {
      User.findById = jest
        .fn()
        .mockReturnValue({
          select: jest
            .fn()
            .mockRejectedValue(new Error("Internal server error")),
        });

      const mockReq = { userId: "123" };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await getProfileHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("updateProfileHandler", () => {
    it("should update user profile", async () => {
      const mockUser = { name: "John Doe", address: "123 Main St" };
      User.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      const mockReq = {
        userId: "123",
        body: { name: "Jane Doe", address: "456 Elm St" },
      };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await updateProfileHandler(mockReq, mockRes);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { name: "Jane Doe", address: "456 Elm St" },
        { new: true }
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
      User.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      const mockReq = { userId: "123", body: {} };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await updateProfileHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 on internal server error", async () => {
      User.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({
          select: jest
            .fn()
            .mockRejectedValue(new Error("Internal server error")),
        });

      const mockReq = { userId: "123", body: {} };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await updateProfileHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("deleteProfileHandler", () => {
    it("should delete user profile", async () => {
      const mockUser = { name: "John Doe", address: "123 Main St" };
      User.findOneAndDelete.mockResolvedValue(mockUser);

      const mockReq = { userId: "123" };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await deleteProfileHandler(mockReq, mockRes);

      expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: "123" });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User Deleted Successfully",
      });
    });

    it("should return 404 if user not found", async () => {
      User.findOneAndDelete.mockResolvedValue(null);

      const mockReq = { userId: "123" };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await deleteProfileHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 on internal server error", async () => {
      User.findOneAndDelete.mockRejectedValue(
        new Error("Internal server error")
      );

      const mockReq = { userId: "123" };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await deleteProfileHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("updateProfilePictureHandler", () => {
    it("should update user profile picture", async () => {
      const mockUser = { name: "John Doe", address: "123 Main St" };
      User.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      const mockReq = {
        userId: "123",
        file: { buffer: Buffer.from([1, 2, 3]) },
      };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await updateProfilePictureHandler(mockReq, mockRes);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { profilePicture: Buffer.from([1, 2, 3]) },
        { new: true }
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
      User.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      const mockReq = { userId: "123", file: {} };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await updateProfilePictureHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 on internal server error", async () => {
      User.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({
          select: jest
            .fn()
            .mockRejectedValue(new Error("Internal server error")),
        });
      const mockReq = { userId: "123", file: {} };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await updateProfilePictureHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});

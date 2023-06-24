const { postSchema } = require("../mongodb");
const Post = postSchema.Post;

jest.mock("../mongodb", () => ({
  postSchema: {
    Post: {
      constructor: jest.fn(),
      save: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
    },
  },
}));

const {
  createPostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
  updatePostByIdHandler,
  deletePostHandler,
} = require("./post");

describe("Post handlers", () => {
  // Initialize test data
  const testData = {
    _id: "644d1df85d23684f2f392696",
    title: "Test Post",
    description: "This is a test post.",
    keywords: ["test", "post"],
    userId: "6d6f636b2d757365722d6964",
  };

  const req = {
    body: testData,
    params: { postId: "mock-post-id" },
    userId: "mock-user-id",
    file: { buffer: Buffer.from("test") },
  };
  const res = {
    json: jest.fn().mockReturnValue({}),
    status: jest.fn().mockReturnValue({ json: jest.fn() }),
  };

  const consoleErrorSpy = jest.spyOn(console, "error");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPostHandler", () => {
    it("should handle errors when creating a new post", async () => {
      Post.save = jest.fn().mockRejectedValueOnce("mock-error");
      await createPostHandler(req, res);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("getAllPostsHandler", () => {
    it("should get all posts", async () => {
      Post.find = jest.fn().mockResolvedValueOnce([testData]);
      await getAllPostsHandler(req, res);

      expect(res.json).toHaveBeenCalledWith([testData]);
    });

    it("should handle errors when getting all posts", async () => {
      Post.find = jest.fn().mockRejectedValueOnce("mock-error");
      await getAllPostsHandler(req, res);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });

    it("should return a message if no posts are found", async () => {
      Post.find = jest.fn().mockResolvedValueOnce(null);
      await getAllPostsHandler(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "No Post found for this",
      });
    });
  });

  describe("getPostByIdHandler", () => {
    it("should get a post by ID", async () => {
      Post.findOne = jest.fn().mockResolvedValueOnce(testData);
      await getPostByIdHandler(req, res);

      expect(res.json).toHaveBeenCalledWith(testData);
    });

    it("should handle errors when getting a post by ID", async () => {
      Post.findOne = jest.fn().mockRejectedValueOnce("mock-error");
      await getPostByIdHandler(req, res);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });

    it("should return an error if no post is found with the given ID", async () => {
      Post.findOne = jest.fn().mockResolvedValueOnce(null);
      await getPostByIdHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({
        error: "Post not found",
      });
    });
  });
  describe("updatePostByIdHandler", () => {
    it("should update post by id", async () => {
      const mockPost = { title: "Old Title", description: "Old Description" };
      Post.findOneAndUpdate.mockResolvedValue(mockPost);

      const mockReq = {
        userId: "123",
        params: { postId: "456" },
        body: { title: "New Title", description: "New Description" },
      };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await updatePostByIdHandler(mockReq, mockRes);

      expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "456", userId: "123" },
        { title: "New Title", description: "New Description" },
        { new: true }
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockPost);
    });

    it("should return 404 if post not found", async () => {
      Post.findOneAndUpdate.mockResolvedValue(null);

      const mockReq = { userId: "123", params: { postId: "456" }, body: {} };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await updatePostByIdHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Post not found" });
    });

    it("should return 500 on internal server error", async () => {
      Post.findOneAndUpdate.mockRejectedValue(
        new Error("Internal server error")
      );

      const mockReq = { userId: "123", params: { postId: "456" }, body: {} };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await updatePostByIdHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("deletePostHandler", () => {
    it("should delete post by id", async () => {
      const mockPost = { title: "Old Title", description: "Old Description" };
      Post.findOneAndDelete.mockResolvedValue(mockPost);

      const mockReq = { userId: "123", params: { postId: "456" } };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await deletePostHandler(mockReq, mockRes);

      expect(Post.findOneAndDelete).toHaveBeenCalledWith({
        _id: "456",
        userId: "123",
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Post deleted successfully",
      });
    });

    it("should return 404 if post not found", async () => {
      Post.findOneAndDelete.mockResolvedValue(null);

      const mockReq = { userId: "123", params: { postId: "456" } };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await deletePostHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Post not found" });
    });

    it("should return 500 on internal server error", async () => {
      Post.findOneAndDelete.mockRejectedValue(
        new Error("Internal server error")
      );

      const mockReq = { userId: "123", params: { postId: "456" } };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      await deletePostHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});

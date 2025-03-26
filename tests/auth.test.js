const { auth } = require("../src/config/auth");
const { authMiddleware } = require("../src/middleware/auth");
const usersService = require("../src/services/users");

jest.mock("../src/services/users");
jest.mock("../src/services/logger");

describe("Authentication", () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("should reject requests without token", async () => {
    await authMiddleware(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "No token provided" });
  });

  it("should reject invalid tokens", async () => {
    mockReq.headers.authorization = "Bearer invalid_token";
    await authMiddleware(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Authentication failed",
    });
  });

  it("should reject when user does not exist", async () => {
    const token = auth.generateToken("test-user");
    mockReq.headers.authorization = `Bearer ${token}`;
    usersService.findByUsername.mockResolvedValue(null);

    await authMiddleware(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "User does not exist" });
  });

  it("should accept valid tokens for existing users", async () => {
    const mockUser = {
      id: 1,
      username: "test-user",
      email: "test@example.com",
    };

    const token = auth.generateToken(mockUser.username);
    mockReq.headers.authorization = `Bearer ${token}`;
    usersService.findByUsername.mockResolvedValue(mockUser);

    await authMiddleware(mockReq, mockRes, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toEqual(mockUser);
  });
});

const request = require("supertest");
const app = require("../src/app");
const { auth } = require("../src/config/auth");
const usersService = require("../src/services/users");
const database = require("../src/services/database");
const testPool = require("../config/database.test");

// Mock services
jest.mock("../src/services/users");
jest.mock("../src/services/logger");
jest.mock("../src/services/database");

describe("API Endpoints", () => {
  let token;
  let mockUser;

  beforeAll(async () => {
    // Create mock user in test database
    mockUser = {
      username: "test-user",
      email: "test@example.com",
      auth_provider: "google", // Set auth provider to google so password can be null
    };

    const insertUserQuery = `
            INSERT INTO users (username, email, password_hash, auth_provider)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email`;

    const result = await testPool.query(insertUserQuery, [
      mockUser.username,
      mockUser.email,
      null, // Null password since it's Google auth
      mockUser.auth_provider,
    ]);

    mockUser = result.rows[0];
    usersService.findByUsername.mockResolvedValue(mockUser);
    token = auth.generateToken(mockUser.username);
  });

  afterAll(async () => {
    // Clean up test user
    await testPool.query("DELETE FROM users WHERE username = $1", [
      mockUser.username,
    ]);
    await testPool.end();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/todos", () => {
    it("should return all todos", async () => {
      const mockTodos = [
        {
          id: 1,
          name: "Test Todo",
          description: "Test Description",
          created_at: new Date().toISOString(),
        },
      ];

      database.getAll.mockResolvedValueOnce(mockTodos);

      const res = await request(app)
        .get("/api/todos")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe("Test Todo");
    });
  });

  describe("POST /api/todos", () => {
    it("should create a new todo", async () => {
      const newTodo = {
        id: 1,
        name: "New Todo",
        description: "New Description",
        created_at: new Date().toISOString(),
      };

      database.create.mockResolvedValueOnce(newTodo);

      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "New Todo", description: "New Description" });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("New Todo");
    });
  });

  describe("PUT /api/todos/:id", () => {
    it("should update an existing todo", async () => {
      const updatedTodo = {
        id: 1,
        name: "Updated Todo",
        description: "Updated Description",
        created_at: new Date().toISOString(),
      };

      database.update.mockResolvedValueOnce(updatedTodo);

      const res = await request(app)
        .put("/api/todos/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Todo" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Updated Todo");
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should delete an existing todo", async () => {
      database.delete.mockResolvedValueOnce({ id: 1 });

      const res = await request(app)
        .delete("/api/todos/1")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });
  });

  describe("Protected Routes", () => {
    beforeEach(() => {
      usersService.findByUsername.mockResolvedValue(mockUser);
    });

    it("should create a new todo when authenticated", async () => {
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "New Todo" });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("New Todo");
    });

    it("should reject when user does not exist", async () => {
      usersService.findByUsername.mockResolvedValue(null);
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "New Todo" });
      expect(res.status).toBe(401);
    });
  });
});

import { Request, Response } from "express";
import * as userServices from "../../src/services/users.Service";
import * as userController from "../../src/controllers/users.Controllers";

// Mock the services
jest.mock("../../src/services/users.Service");

describe("User Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    jest.clearAllMocks();
    responseObject = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
    };
    mockRequest = {};
  });

  describe("getUsers", () => {
    test("should return 200 with users data when users exist", async () => {
      const mockUsers = [
        { user_id: 1, username: "user1", email: "user1@example.com" },
        { user_id: 2, username: "user2", email: "user2@example.com" },
      ];

      (userServices.getUsers as jest.Mock).mockResolvedValue(mockUsers);

      await userController.getUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userServices.getUsers).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUsers,
      });
    });

    test("should return 404 when no users found", async () => {
      (userServices.getUsers as jest.Mock).mockResolvedValue([]);

      await userController.getUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userServices.getUsers).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "No users found",
      });
    });

    test("should return 500 on service error", async () => {
      const errorMessage = "Database error";
      (userServices.getUsers as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await userController.getUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userServices.getUsers).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage,
      });
    });
  });

  describe("getAdmins", () => {
    test("should return 200 with admins data when admins exist", async () => {
      const mockAdmins = [
        { user_id: 1, username: "admin1", email: "admin1@example.com", role: "Admin" },
      ];

      (userServices.getAdmins as jest.Mock).mockResolvedValue(mockAdmins);

      await userController.getAdmins(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userServices.getAdmins).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockAdmins,
      });
    });
  });

  describe("createUser", () => {
    test("should return 201 with success message on successful user creation", async () => {
      const userData = {
        username: "newuser",
        email: "new@example.com",
        password: "password123",
        role: "Member",
      };

      const mockResult = {
        success: true,
        registeredUser: { user_id: 1, ...userData },
      };

      mockRequest = { body: userData };

      (userServices.insertUser as jest.Mock).mockResolvedValue(mockResult);

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userServices.insertUser).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.success).toBe(true);
      expect(responseObject.message).toBe("User created successfully");
    });

    test("should return 400 when user already exists", async () => {
      const userData = {
        username: "existinguser",
        email: "existing@example.com",
        password: "password123",
      };

      const mockResult = {
        success: false,
        Message: "User already exists",
      };

      mockRequest = { body: userData };

      (userServices.insertUser as jest.Mock).mockResolvedValue(mockResult);

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userServices.insertUser).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.success).toBe(false);
      expect(responseObject.message).toBe("User already exists");
    });
  });

  describe("deleteUser", () => {
    test("should return 200 with success message on successful deletion", async () => {
      const userId = 1;
      mockRequest = { params: { id: userId.toString() } };

      (userServices.deleteUser as jest.Mock).mockResolvedValue(undefined);

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userServices.deleteUser).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.success).toBe(true);
      expect(responseObject.message).toBe(
        `User with ID ${userId} deleted successfully`
      );
    });

    test("should return 400 for invalid user ID", async () => {
      mockRequest = { params: { id: "invalid" } };

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userServices.deleteUser).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.success).toBe(false);
      expect(responseObject.message).toBe("Invalid user ID");
    });
  });

  describe("userlogin", () => {
    test("should return 201 with token on successful login", async () => {
      const loginData = {
        email: "user@example.com",
        password: "correctpassword",
      };

      const mockResult = {
        success: true,
        message: "Logged in successfully",
        data: {
          id: 1,
          username: "testuser",
          role: "Member",
          token: "mock.jwt.token",
        },
      };

      mockRequest = { body: loginData };

      (userServices.loginUser as jest.Mock).mockResolvedValue(mockResult);

      await userController.userlogin(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userServices.loginUser).toHaveBeenCalledWith(loginData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toEqual(mockResult);
    });
  });
});
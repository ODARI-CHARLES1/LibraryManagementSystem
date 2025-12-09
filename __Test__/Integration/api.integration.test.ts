import request from 'supertest';
import express from 'express';
import userRouter from '../../src/router/user.routes';
import bookRouter from '../../src/router/books.Routes';
import * as userServices from '../../src/services/users.Service';
import * as bearAuth from '../../src/Middlewares/bearAuth';
import * as roleAuth from '../../src/Middlewares/roleAuth';

const testApp = express();
testApp.use(express.json());
testApp.use('/api', userRouter);
testApp.use('/api/books', bookRouter);

jest.mock('../../src/services/users.Service');
jest.mock('../../src/Middlewares/bearAuth');
jest.mock('../../src/Middlewares/roleAuth');

(bearAuth.isAuthenticated as jest.Mock).mockImplementation((req: any, res: any, next: any) => {
  req.user = { id: 1, email: 'test@example.com', role: 'admin' };
  next();
});

(roleAuth.authorize as jest.Mock).mockImplementation((role: string) => {
  return (req: any, res: any, next: any) => {
    next();
  };
});
describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Routes', () => {
    describe('GET /api/users', () => {
      test('should return 200 with users data', async () => {
        const mockUsers = [
          { user_id: 1, username: 'user1', email: 'user1@example.com' },
          { user_id: 2, username: 'user2', email: 'user2@example.com' }
        ];
  
        (userServices.getUsers as jest.Mock).mockResolvedValue(mockUsers);
  
        const response = await request(testApp)
          .get('/api/users')
          .set('Authorization', 'Bearer mock-token')
          .expect(200);
  
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockUsers);
      });
  
      test('should return 404 when no users found', async () => {
        (userServices.getUsers as jest.Mock).mockResolvedValue([]);
  
        const response = await request(testApp)
          .get('/api/users')
          .set('Authorization', 'Bearer mock-token')
          .expect(404);
  
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('No users found');
      });
    });

    describe('POST /api/users/create', () => {
      test('should create user and return 201', async () => {
        const newUser = {
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
          role: 'Member'
        };
  
        const mockResult = {
          success: true,
          registeredUser: { user_id: 1, ...newUser }
        };
  
        (userServices.insertUser as jest.Mock).mockResolvedValue(mockResult);
  
        const response = await request(testApp)
          .post('/api/users/create')
          .send(newUser)
          .expect(201);
  
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User created successfully');
      });
  
      test('should return 400 when user already exists', async () => {
        const existingUser = {
          username: 'existinguser',
          email: 'existing@example.com',
          password: 'password123'
        };
  
        const mockResult = {
          success: false,
          Message: 'User already exists'
        };
  
        (userServices.insertUser as jest.Mock).mockResolvedValue(mockResult);
  
        const response = await request(testApp)
          .post('/api/users/create')
          .send(existingUser)
          .expect(400);
  
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User already exists');
      });
    });

    describe('DELETE /api/users/delete/:id', () => {
      test('should delete user and return 200', async () => {
        const userId = 1;
  
        (userServices.deleteUser as jest.Mock).mockResolvedValue(undefined);
  
        const response = await request(testApp)
          .delete(`/api/users/delete/${userId}`)
          .set('Authorization', 'Bearer mock-token')
          .expect(200);
  
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(`User with ID ${userId} deleted successfully`);
      });
  
      test('should return 400 for invalid user ID', async () => {
        const response = await request(testApp)
          .delete('/api/users/delete/invalid')
          .set('Authorization', 'Bearer mock-token')
          .expect(400);
  
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid user ID');
      });
    });
  });

  describe('Book Routes', () => {

    describe('GET /api/books', () => {
      test('should return 200 for books endpoint', async () => {
        const response = await request(testApp)
          .get('/api/books')
          .set('Authorization', 'Bearer mock-token')
          .expect(200);

        expect(response.status).toBe(200);
      });
    });
  });

  describe('Authentication Routes', () => {
    describe('POST /api/users/login', () => {
      test('should return 201 with token on successful login', async () => {
        const loginData = {
          email: 'user@example.com',
          password: 'correctpassword'
        };

        const mockResult = {
          success: true,
          message: 'Logged in successfully',
          data: {
            id: 1,
            username: 'testuser',
            role: 'Member',
            token: 'mock.jwt.token'
          }
        };

        (userServices.loginUser as jest.Mock).mockResolvedValue(mockResult);

        const response = await request(testApp)
          .post('/api/users/login')
          .send(loginData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Logged in successfully');
        expect(response.body.data.token).toBeDefined();
      });
    });
  });
});
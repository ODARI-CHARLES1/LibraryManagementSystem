jest.mock('../../src/Middlewares/bearAuth', () => ({
  isAuthenticated: jest.fn(),
}));

jest.mock('../../src/Middlewares/roleAuth', () => ({
  authorize: jest.fn().mockReturnValue((req: any, res: any, next: any) => next()),
}));

jest.mock('../../src/services/users.Service');

import request from 'supertest';
import express from 'express';
import userRouter from '../../src/router/user.routes';
import bookRouter from '../../src/router/books.Routes';
import * as userServices from '../../src/services/users.Service';
import * as bearAuth from '../../src/Middlewares/bearAuth';
import * as roleAuth from '../../src/Middlewares/roleAuth';

const testApp = express();
testApp.use(express.json());
testApp.use('/api/users', userRouter);
testApp.use('/api/books', bookRouter);

(bearAuth.isAuthenticated as jest.Mock).mockImplementation((req: any, res: any, next: any) => {
  req.user = { id: 1, email: 'test@example.com', role: 'admin' };
  next();
});

(roleAuth.authorize as jest.Mock).mockImplementation(() => {
  return (req: any, res: any, next: any) => next();
});

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Routes', () => {
    describe('GET /api/users', () => {
      test('returns 200 with users', async () => {
        const mockUsers = [
          { user_id: 1, username: 'user1', email: 'user1@example.com' },
          { user_id: 2, username: 'user2', email: 'user2@example.com' }
        ];

        (userServices.getUsers as jest.Mock).mockResolvedValue(mockUsers);

        const res = await request(testApp)
          .get('/api/users')
          .set('Authorization', 'Bearer test')
          .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockUsers);
      });

      test('returns 404 when empty', async () => {
        (userServices.getUsers as jest.Mock).mockResolvedValue([]);

        const res = await request(testApp)
          .get('/api/users')
          .set('Authorization', 'Bearer test')
          .expect(404);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('No users found');
      });
    });

    describe('POST /api/users/create', () => {
      test('creates user', async () => {
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

        const res = await request(testApp)
          .post('/api/users/create')
          .send(newUser)
          .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('User created successfully');
      });

      test('user exists', async () => {
        const mockResult = {
          success: false,
          message: 'User already exists'
        };

        (userServices.insertUser as jest.Mock).mockResolvedValue(mockResult);

        const res = await request(testApp)
          .post('/api/users/create')
          .send({
            username: 'existing',
            email: 'existing@example.com',
            password: 'pass'
          })
          .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('User already exists');
      });
    });

    describe('DELETE /api/users/delete/:id', () => {
      test('deletes user', async () => {
        (userServices.deleteUser as jest.Mock).mockResolvedValue(true);

        const res = await request(testApp)
          .delete('/api/users/delete/5')
          .set('Authorization', 'Bearer test')
          .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('User with ID 5 deleted successfully');
      });

      test('invalid id', async () => {
        const res = await request(testApp)
          .delete('/api/users/delete/invalid')
          .set('Authorization', 'Bearer test')
          .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid user ID');
      });
    });
  });

  describe('Book Routes', () => {
    describe('GET /api/books', () => {
      test('returns 200', async () => {
        const res = await request(testApp)
          .get('/api/books')
          .set('Authorization', 'Bearer test')
          .expect(200);

        expect(res.status).toBe(200);
      });
    });
  });

  describe('Authentication Routes', () => {
    describe('POST /api/users/login', () => {
      test('returns token', async () => {
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

        const res = await request(testApp)
          .post('/api/users/login')
          .send(loginData)
          .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
      });
    });
  });
});

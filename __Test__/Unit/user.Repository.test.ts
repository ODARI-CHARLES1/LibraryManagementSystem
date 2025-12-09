import * as userRepository from '../../src/repositories/user.Repository';
import { getPool } from '../../src/config/database';

jest.mock('../../src/config/database');

describe('User Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdmins', () => {
    test('should return admins from database', async () => {
      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({
          recordset: [
            { user_id: 1, username: 'admin1', email: 'admin1@example.com', role: 'Admin' },
            { user_id: 2, username: 'admin2', email: 'admin2@example.com', role: 'Admin' }
          ]
        })
      };

      (getPool as jest.Mock).mockResolvedValue(mockPool);

      const result = await userRepository.getAdmins();

      expect(getPool).toHaveBeenCalledTimes(1);
      expect(mockPool.request).toHaveBeenCalledTimes(1);
      expect(mockPool.input).toHaveBeenCalledWith('role', 'Admin');
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE role = @role');
      expect(result).toHaveLength(2);
      expect(result[0].username).toBe('admin1');
    });

    test('should throw error when database query fails', async () => {
      const mockError = new Error('Database connection failed');
      (getPool as jest.Mock).mockRejectedValue(mockError);

      await expect(userRepository.getAdmins())
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('getUserByEmail', () => {
    test('should return user when found by email', async () => {
      const testEmail = 'user@example.com';
      const mockUser = {
        user_id: 1,
        username: 'testuser',
        email: testEmail,
        password_hash: 'hashedpassword',
        role: 'Member'
      };

      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({
          recordset: [mockUser]
        })
      };

      (getPool as jest.Mock).mockResolvedValue(mockPool);

      const result = await userRepository.getUserByEmail(testEmail);

      expect(getPool).toHaveBeenCalledTimes(1);
      expect(mockPool.input).toHaveBeenCalledWith('email', testEmail);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE email = @email');
      expect(result).toEqual(mockUser);
    });

    test('should return null when user not found', async () => {
      const testEmail = 'nonexistent@example.com';

      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({
          recordset: []
        })
      };

      (getPool as jest.Mock).mockResolvedValue(mockPool);

      const result = await userRepository.getUserByEmail(testEmail);

      expect(result).toBeNull();
    });
  });

  describe('insertUser', () => {
    test('should insert user and return user without password hash', async () => {
      const newUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashedpassword',
        role: 'Member' as const,
        created_at: new Date()
      };

      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockImplementation((query: string) => {
          if (query.startsWith('INSERT')) {
            return Promise.resolve({ rowsAffected: [1] });
          } else if (query.includes('SELECT * FROM Users WHERE email')) {
            return Promise.resolve({
              recordset: [{
                user_id: 1,
                ...newUser,
                password_hash: newUser.password
              }]
            });
          }
          return Promise.resolve({ recordset: [] });
        })
      };

      (getPool as jest.Mock).mockResolvedValue(mockPool);

      const result = await userRepository.insertUser(newUser);

      expect(getPool).toHaveBeenCalledTimes(1);
      expect(mockPool.request).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password_hash');
      expect(result).toHaveProperty('user_id', 1);
    });
  });

  describe('deleteUser', () => {
    test('should delete user successfully', async () => {
      const userId = 1;

      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [1] })
      };

      (getPool as jest.Mock).mockResolvedValue(mockPool);

      await userRepository.deleteUser(userId);

      expect(getPool).toHaveBeenCalledTimes(1);
      expect(mockPool.input).toHaveBeenCalledWith('user_id', userId);
      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM Users WHERE user_id = @user_id');
    });
  });

  describe('loginUser', () => {
    test('should return user data for valid login', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'password123'
      };

      const mockUser = {
        user_id: 1,
        username: 'testuser',
        email: loginData.email,
        password_hash: 'hashedpassword',
        role: 'Member'
      };

      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({
          recordset: [mockUser]
        })
      };

      (getPool as jest.Mock).mockResolvedValue(mockPool);

      const result = await userRepository.loginUser(loginData);

      expect(getPool).toHaveBeenCalledTimes(1);
      expect(mockPool.input).toHaveBeenCalledWith('email', loginData.email);
      expect(result).toEqual([mockUser]);
    });

    test('should return null when user not found', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const mockPool = {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({
          recordset: []
        })
      };

      (getPool as jest.Mock).mockResolvedValue(mockPool);

      const result = await userRepository.loginUser(loginData);

      expect(result).toBeNull();
    });
  });
});
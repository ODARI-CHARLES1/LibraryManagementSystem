// tests/services/user.service.test.ts
import * as userRepository from '../../src/repositories/user.Repository';
import * as userService from '../../src/services/users.Service';

// Mock the whole repository module
jest.mock('../../src/repositories/user.Repository');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('User Service', () => {
  test('getAdmins() should return admins without password_hash', async () => {
    const fakeAdmins = [
      {
        user_id: 1,
        username: 'admin',
        email: 'admin@library.com',
        password_hash: 'hashed_password_admin',
        role: 'Admin',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      },
    ];

    (userRepository.getAdmins as jest.Mock).mockResolvedValue(fakeAdmins);

    const result = await userService.getAdmins();

    expect(userRepository.getAdmins).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      {
        user_id: 1,
        username: 'admin',
        email: 'admin@library.com',
        role: 'Admin',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      },
    ]);
  });

  test('getAdminById() should return a single admin without password_hash', async () => {
    const fakeAdmin = [
      {
        user_id: 1,
        username: 'admin',
        email: 'admin@library.com',
        password_hash: 'hashed_password_admin',
        role: 'Admin',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      },
    ];

    (userRepository.getAdminById as jest.Mock).mockResolvedValue(fakeAdmin);

    const result = await userService.getAdminById(1);

    expect(userRepository.getAdminById).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      {
        user_id: 1,
        username: 'admin',
        email: 'admin@library.com',
        password_hash: 'hashed_password_admin',
        role: 'Admin',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      },
    ]);
  });

  test('getUsers() should return users without password_hash', async () => {
    const fakeUsers = [
      {
        user_id: 1,
        username: 'admin',
        email: 'admin@library.com',
        password_hash: 'hashed_password_admin',
        role: 'Admin',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      },
      {
        user_id: 2,
        username: 'odari',
        email: 'odari@library.com',
        password_hash: 'hashed_password_user',
        role: 'User',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      },
    ];

    (userRepository.getUsers as jest.Mock).mockResolvedValue(fakeUsers);

    const result = await userService.getUsers();

    expect(userRepository.getUsers).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      {
        user_id: 1,
        username: 'admin',
        email: 'admin@library.com',
        role: 'Admin',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      },
      {
        user_id: 2,
        username: 'odari',
        email: 'odari@library.com',
        role: 'User',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      },
    ]);
  });

 test("getMembers() should return members without password_hash", async () => {
  const fakeMembers = [
    {
      user_id: 1,
      username: 'member',
      email: 'member@library.com',
      password_hash: 'hashed_password_member',
      role: 'Member',
      created_at: new Date('2025-10-29T15:32:55.750Z'),
      updated_at: new Date('2025-10-29T15:32:55.750Z'),
    },
    {
      user_id: 2,
      username: 'odari',
      email: 'odari@library.com',
      password_hash: 'hashed_password_user',
      role: 'Member',
      created_at: new Date('2025-10-29T15:32:55.750Z'),
      updated_at: new Date('2025-10-29T15:32:55.750Z'),
    },
  ];

  (userRepository.getMembers as jest.Mock).mockResolvedValue(fakeMembers);

  const result = await userService.getMembers();

  expect(userRepository.getMembers).toHaveBeenCalledTimes(1);
  expect(result).toEqual([
    {
      user_id: 1,
      username: 'member',
      email: 'member@library.com',
      role: 'Member',
      created_at: new Date('2025-10-29T15:32:55.750Z'),
      updated_at: new Date('2025-10-29T15:32:55.750Z'),
    },
    {
      user_id: 2,
      username: 'odari',
      email: 'odari@library.com',
      role: 'Member',
      created_at: new Date('2025-10-29T15:32:55.750Z'),
      updated_at: new Date('2025-10-29T15:32:55.750Z'),
    },
  ]);
});

  test("getMemberById() should return member without password_hash",async()=>{
      const fakeMember = [
      {
        user_id: 2,
        username: 'member',
        email: 'member@library.com',
        password_hash: 'hashed_password_member',
        role: 'member',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      },
    ];
    (userRepository.getMemberId as jest.Mock).mockResolvedValue(fakeMember)
    const result=await userService.getMemberId(2)
    expect(userRepository.getMemberId).toHaveBeenCalledTimes(1)
    expect(result).toEqual([

       {
        user_id: 2,
        username: 'member',
        email: 'member@library.com',
        role: 'member',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      },
    ])
  })
  test("getUserByEmail() should return a user without password_hash ",async()=>{
    const fakeUser=[
        {
        user_id: 2,
        username: 'member',
        email: 'member@library.com',
        password_hash: 'hashed_password_member',
        role: 'member',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      }
    ];

    (userRepository.getUserByEmail as jest.Mock).mockResolvedValue(fakeUser)
    const result=await userService.getUserByEmail("member@library.com")
    expect(userRepository.getUserByEmail).toHaveBeenCalledTimes(1)
    expect(result).toEqual([
            {
        user_id: 2,
        username: 'member',
        email: 'member@library.com',
        role: 'member',
        created_at: new Date('2025-10-29T15:32:55.750Z'),
        updated_at: new Date('2025-10-29T15:32:55.750Z'),
      }
    ]);

  })

 test("deleteUser() should call repository with correct user_id", async () => {
  // Arrange
  const userId = 5;
  (userRepository.deleteUser as jest.Mock).mockResolvedValue(undefined);

  // Act
  await userService.deleteUser(userId);

  // Assert
  expect(userRepository.deleteUser).toHaveBeenCalledTimes(1);
  expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
});


});
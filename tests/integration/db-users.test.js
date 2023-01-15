const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const User = require('../../models/User');



describe('User', () => {
  
  beforeAll(async () => { 
    // jest.resetModules()
    const DB_URL_TEST = process.env.DB_URL_TEST || 'mongodb://localhost:27017';
    await mongoose.connect(DB_URL_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should create a new user', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword'
    });
    await user.save();
    expect(user._id).toBeDefined();
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(bcrypt.compareSync('testpassword', user.password)).toBe(true);
  });

  test('should not create a new user with invalid role', async () => {
    const user = new User({
      username: 'testuser2',
      email: 'test@example.com',
      password: 'testpassword',
      role: 'invalidrole'
    });
    try {
      await user.save();
    } catch (error) {
      expect(error.message).toMatch(/Invalid role, please enter user or admin/);
    }
  });

  test('should create a new user with valid role', async () => {
    const user = new User({
      username: 'testuser3',
      email: 'test@example.com',
      password: 'testpassword',
      role: 'admin'
    });
    await user.save();
    expect(user._id).toBeDefined();
  });

  test('should not create a new user with invalid plan', async () => {
    const user = new User({
      username: 'testuser4',
      email: 'test@example.com',
      password: 'testpassword',
      plan: 'invalidplan'
    });
    try {
      await user.save();
    } catch (error) {
      expect(error.message).toMatch(/Invalid plan, please enter free or premium/);
    }
  });

  test('should create a new user with valid plan', async () => {
    const user = new User({
      username: 'testuser5',
      email: 'test@example.com',
      password: 'testpassword',
      plan: 'free'
    });
    user.save();
    expect(user._id).toBeDefined();
  });

  test('should cleanup user data', async () => {
    const user = new User({
      username: 'testuser6',
      email: 'test6@example.com',
      password: 'testpassword',
      role: 'admin',
      plan: 'premium'
    });
    await user.save();
    const cleanedUpUser = user.cleanup();
    expect(cleanedUpUser.username).toBe(user.username);
    expect(cleanedUpUser.email).toBe(user.email);
    expect(cleanedUpUser.role).toBe(user.role);
    expect(cleanedUpUser.plan).toBe(user.plan);
    expect(cleanedUpUser.insert).toBe(user.insert);
    });

    test('should not create a new user with missing required fields', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'testpassword'
      });
      try {
        await user.save();
      } catch (error) {
        expect(error.message).toMatch(/`username` is required/);
      }
    });
    
    test('should not create a new user with invalid email', async () => {
      const user = new User({
        username: 'testuser7',
        email: 'invalidemail',
        password: 'testpassword'
      });
      try {
        await user.save();
      } catch (error) {
        expect(error.message).toMatch(/invalid email/);
      }
    });
    
    test('should not create a new user with short password', async () => {
      const user = new User({
        username: 'testuser8',
        email: 'test2@example.com',
        password: 'short'
      });
      try {
        await user.save();
      } catch (error) {
        expect(error.message).toMatch(/password is too short/);
      }
    });
    
});

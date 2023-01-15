const request = require('supertest');
const User = require('../models/User');
const app = require('../app');
const router = require('../routes/transactions');
const bcrypt = require('bcryptjs');

const users = [
    new User({
    _id: "63b3318a3da97aba71958c75",
    username: "testuser",
    email: "testuser@example.com",
    password: "securepassword",
    }),
    new User({
    _id: "63b3318a3da97aba71958c76",
    username: "admin",
    email: "admin@example.com",
    password: "securepassword",
    role: "admin",
    plan: "free"
    })
];

jest.mock('../models/User');

describe('User routes', () => {
    describe("GET /", () => {
        let findAllUsersMock;
        beforeEach(() => {
            findAllUsersMock = jest.spyOn(User, "find");
        });
    
        it("Should return all users", async () => {
            findAllUsersMock.mockImplementation(async () => Promise.resolve(users));
            return request(app).get("/")
                .then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body).toBeArrayOfSize(2);
                    expect(findAllUsersMock).toBeCalled();
                });
        });
    
        it("Should return internal server error", () => {
            findAllUsersMock.mockImplementation(async () => Promise.reject("Internal server error"));
    
            return request(app).get("/")
                .then((response) => {
                    expect(response.statusCode).toBe(500);
                    expect(findAllUsersMock).toBeCalled();
                });
        });
    });
    
  
//     describe('GET /:UserId', () => {
//       it('should return the user with the specified id', async () => {
//         // Arrange
//         const mockUser = { id: 1, name: 'John' };
//         User.findById = jest.fn().mockResolvedValue(mockUser);
  
//         // Act
//         const res = await request(router).get('/1');
  
//         // Assert
//         expect(res.status).toBe(200);
//         expect(res.body).toEqual(mockUser);
//       });
  
//       it('should return an error if there is a problem retrieving the user', async () => {
//         // Arrange
//         const mockError = new Error('Error retrieving user');
//         User.findById = jest.fn().mockRejectedValue(mockError);
  
//         // Act
//         const res = await request(router).get('/1');
  
//         // Assert
//         expect(res.status).toBe(200);
//         expect(res.body).toEqual({ message: mockError });
//       });
//     });
  
//     describe('POST /', () => {
//       it('should create a new user', async () => {
//         // Arrange
//         const mockUser = { id: 1, name: 'John' };
//         User.findOne = jest.fn().mockResolvedValue(null);
//         User.save = jest.fn().mockResolvedValue(mockUser);
  
//         // Act
//         const res = await request(router)
//           .post('/')
//           .send({ name: 'John' });
  
//         // Assert
//         expect(res.status).toBe(201);
//         expect(res.body).toEqual(mockUser);
//       });
  
//       it('should return an error if the email is already in use', async () => {
//         // Arrange
//         User.findOne = jest.fn().mockResolvedValue({});
  
//         // Act
//         const res = await request(router)
//         .post('/')
//         .send({ email: 'existing@email.com' });

//       // Assert
//       expect(res.status).toBe(400);
//       expect(res.body).toEqual({ error: 'Email already in use' });
//     });

//     it('should return an error if there is a problem creating the user', async () => {
//       // Arrange
//       const mockError = new Error('Error creating user');
//       User.findOne = jest.fn().mockResolvedValue(null);
//       User.save = jest.fn().mockRejectedValue(mockError);

//       // Act
//       const res = await request(router)
//         .post('/')
//         .send({ name: 'John' });

//       // Assert
//       expect(res.status).toBe(200);
//       expect(res.body).toEqual({ message: mockError });
//     });
//   });

//   describe('PUT /:UserId', () => {
//     it('should update the user with the specified id', async () => {
//       // Arrange
//       const mockUser = { id: 1, name: 'Jane' };
//       User.updateOne = jest.fn().mockResolvedValue(mockUser);

//       // Act
//       const res = await request(router)
//         .put('/1')
//         .send({ name: 'Jane' });

//       // Assert
//       expect(res.status).toBe(201);
//       expect(res.body).toEqual(mockUser);
//     });

//     it('should hash the password if it is provided', async () => {
//       // Arrange
//       const mockUser = { id: 1, name: 'Jane' };
//       bcrypt.hashSync = jest.fn().mockReturnValue('hashed_password');
//       User.updateOne = jest.fn().mockResolvedValue(mockUser);

//       // Act
//       const res = await request(router)
//         .put('/1')
//         .send({ name: 'Jane', password: 'password' });

//       // Assert
//       expect(bcrypt.hashSync).toHaveBeenCalledWith('password', expect.any(Number));
//       expect(res.status).toBe(201);
//       expect(res.body).toEqual(mockUser);
//     });

//     it('should return an error if there is a problem updating the user', async () => {
//       // Arrange
//       const mockError = new Error('Error updating user');
//       User.updateOne = jest.fn().mockRejectedValue(mockError);

//       // Act
//       const res = await request(router)
//         .put('/1')
//         .send({ name: 'Jane' });

//       // Assert
//       expect(res.status).toBe(200);
//       expect(res.body).toEqual({ message: mockError });
//     });
//   });

//   describe('DELETE /:UserId', () => {
//     it('should delete the user with the specified id', async () => {
//       // Arrange
//       User.deleteOne = jest.fn().mockResolvedValue({});

//       // Act
//       const res = await request(router)
//         .delete('/1');

//         // Assert
//         expect(res.status).toBe(200);
//         expect(res.body).toEqual({});
//       });
  
//       it('should return an error if there is a problem deleting the user', async () => {
//         // Arrange
//         const mockError = new Error('Error deleting user');
//         User.deleteOne = jest.fn().mockRejectedValue(mockError);
  
//         // Act
//         const res = await request(router).delete('/1');
  
//         // Assert
//         expect(res.status).toBe(200);
//         expect(res.body).toEqual({ message: mockError });
//       });
//     });
  
//     describe('POST /login', () => {
//       it('should return the user if the email and password are correct', async () => {
//         // Arrange
//         const mockUser = { id: 1, name: 'John', password: 'password' };
//         bcrypt.compare = jest.fn().mockResolvedValue(true);
//         User.findOne = jest.fn().mockResolvedValue(mockUser);
  
//         // Act
//         const res = await request(router)
//           .post('/login')
//           .send({ email: 'john@example.com', password: 'password' });
  
//         // Assert
//         expect(bcrypt.compare).toHaveBeenCalledWith('password', 'password');
//         expect(res.status).toBe(200);
//         expect(res.body).toEqual(mockUser);
//       });
  
//       it('should return an error if the email is not found', async () => {
//         // Arrange
//         User.findOne = jest.fn().mockResolvedValue(null);
  
//         // Act
//         const res = await request(router)
//           .post('/login')
//           .send({ email: 'nonexistent@example.com', password: 'password' });
  
//         // Assert
//         expect(res.status).toBe(400);
//         expect(res.body).toEqual({ message: 'Invalid email' });
//       });
  
//       it('should return an error if the password is incorrect', async () => {
//         // Arrange
//         const mockUser = { id: 1, name: 'John', password: 'password' };
//         bcrypt.compare = jest.fn().mockResolvedValue(false);
//         User.findOne = jest.fn().mockResolvedValue(mockUser);
  
//         // Act
//         const res = await request(router)
//           .post('/login')
//           .send({ email: 'john@example.com', password: 'wrong_password' });
  
//         // Assert
//         expect(bcrypt.compare).toHaveBeenCalledWith('wrong_password', 'password');
//         expect(res.status).toBe(400);
//         expect(res.body).toEqual({ message: 'Invalid password' });
//       });
    // });
});

  
const request = require('supertest');
const User = require('../models/User');
const app = require('../app');
const bcrypt = require('bcryptjs');
const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

const URL_BASE = "/api/v1/users";
const URL_BASE_SONGS = "/api/v1/users/likes";
const JWT_TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYzA2NzI4MGExN2U5NTZkNTYyMmVlOSIsInJvbGUiOiJ1c2VyIiwicGxhbiI6ImZyZWUiLCJ1c2VybmFtZSI6ImpvaG5kb2UiLCJlbWFpbCI6ImJ1ZW5hc0BnbWFpbC5jb20iLCJpYXQiOjE2NzM1NTY5OTh9.YeYX3vZPDCv6ZqNjPGf_AiViTUlodd8adrBniCWwhUM";

describe("Hello world test", () => {
    it("Should return 200 OK", () => {
        return request(app).get("/").then((response) => {
            expect(response.status).toBe(200);
        })
    });
});

describe('User routes', () => {
    describe("GET /", () => {
        beforeAll(() => {
            const users = [
                new User({
                "username": "testuser",
                "email": "testuser@example.com",
                "password": "securepassword",
                }),
                new User({
                "username": "admin",
                "email": "admin@example.com",
                "password": "securepassword",
                "role": "admin",
                "plan": "free"
                })
            ];

            findAllUsersMock = jest.spyOn(User, "find");
            dbFindOne = jest.spyOn(User, "findOne");

            findAllUsersMock.mockImplementation((query, x, y) => {
                return users;
            });
            dbFindOne.mockImplementation((query) => {
                return undefined;
            })
        });
    
        it("Should return all users", async () => {
            return request(app).get(URL_BASE)
                .then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(Array.isArray(response.body)).toBeTruthy();
                    expect(response.body).toBeArrayOfSize(2);
                    expect(findAllUsersMock).toBeCalled();
                });
        });
    
        it("Should return internal server error", () => {
            findAllUsersMock.mockImplementation(async () => Promise.reject("Internal server error"));
    
            return request(app).get(URL_BASE)
                .then((response) => {
                    expect(response.statusCode).toBe(500);
                    expect(findAllUsersMock).toBeCalled();
                });
        });
    });
    
  
    describe('GET /:UserId', () => {
        it('should return the user with the specified id', async () => {
          const user = new User({
            "username": "admin",
            "email": "admin@example.com",
            "password": "securepassword",
            "role": "admin",
            "plan": "free"
            })
          const findOneMock = jest.spyOn(User, "findOne");
          findOneMock.mockImplementation(() => user);
      
          return request(app).get(`${URL_BASE}/${user._id}`)
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body.username).toBe("admin");
              expect(findOneMock).toBeCalled();
            });
        });
      
        it('should return an error if there is a problem retrieving the user', async () => {
          const findOneMock = jest.spyOn(User, "findOne");
          findOneMock.mockImplementation(() => Promise.reject("Internal server error"));
      
          return request(app).get(`${URL_BASE}/invalid_id`)
            .then((response) => {
              expect(response.statusCode).toBe(500);
              expect(findOneMock).toBeCalled();
            });
        });

        it('should return an error if the user is not found', async () => {
          const findOneMock = jest.spyOn(User, "findOne");
          findOneMock.mockImplementation(() => undefined);
      
          return request(app).get(`${URL_BASE}/41235234523`)
            .then((response) => {
              expect(response.statusCode).toBe(404);
              expect(findOneMock).toBeCalled();
            });
      });
    });
  
    describe('POST /', () => {
        it('should create a new user', async () => {
          const user = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepassword"
          };
          const createMock = jest.spyOn(User.prototype, "save");
          const findOne = jest.spyOn(User, "findOne");
          findOne.mockImplementation(() => undefined);
          createMock.mockImplementation(() => user);
      
          return request(app).post(URL_BASE)
            .send(user)
            .then((response) => {
              expect(response.statusCode).toBe(201);
              expect(response.body.username).toBe("newuser");
              expect(createMock).toBeCalled();
            });
        });
      
        it('should return an error if the email is already in use', async () => {
          const user = {
            "username": "newuser",
            "email": "testuser@example.com",
            "password": "securepassword"
          };
          const createMock = jest.spyOn(User.prototype, "save");
          createMock.mockImplementation(() => Promise.reject("Email already in use"));
      
          return request(app).post(URL_BASE)
            .send(user)
            .then((response) => {
              expect(response.statusCode).toBe(500);
              expect(createMock).toBeCalled();
            });
        });
      
        it('should return an error if there is a problem creating the user', async () => {
          const user = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepassword"
          };
          const createMock = jest.spyOn(User.prototype, "save");
          createMock.mockImplementation(() => Promise.reject("Internal server error"));

            return request(app).post(URL_BASE)
            .send(user)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(createMock).toBeCalled();
            });
        });
    });

    describe('PUT /:UserId', () => {
        it('should update the user with the specified id', async () => {
          const user = new User({ username: "testuser", email:"test@gmail.com" });
          const updateMock = jest.spyOn(User, "updateOne");
          updateMock.mockImplementation(() => new User({ username:"updateduser", email:"test@gmail.com" }));
    
          return request(app).put(`${URL_BASE}/${user._id}`)
            .send({ username: "updateduser" })
            .then((response) => {
              expect(response.statusCode).toBe(201);
              expect(response.body.username).toBe("updateduser");
              expect(updateMock).toBeCalled();
            });
        });
    
        it('should hash the password if it is provided', async () => {
          const user = new User({ username: "testuser", email:"test@gmail.com" });
          const updateMock = jest.spyOn(User, "updateOne");
          updateMock.mockImplementation(() => user);
          const hashMock = jest.spyOn(bcrypt, "hashSync");
          hashMock.mockImplementation(() => "hashedpassword");
    
          return request(app).put(`${URL_BASE}/${user._id}`)
            .send({ password: "newpassword" })
            .then(() => {
              expect(hashMock).toBeCalled();
            });
        });
    
        it('should return an error if there is a problem updating the user', async () => {
          const updateMock = jest.spyOn(User, "updateOne");
          updateMock.mockImplementation(() => Promise.reject("Internal server error"));
    
          return request(app).put(`${URL_BASE}/invalid_id`)
            .send({ username: "updateduser" })
            .then((response) => {
              expect(response.statusCode).toBe(500);
              expect(updateMock).toBeCalled();
            });
        });
      });

      describe('DELETE /:UserId', () => {
        it('should delete the user with the specified id', async () => {
          const user = new User({ username: "testuser", email:"test@gmail.com" });
          const deleteMock = jest.spyOn(User, "deleteOne");
          deleteMock.mockImplementation(() => user);
    
          return request(app).delete(`${URL_BASE}/${user._id}`)
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body.username).toBe("testuser");
              expect(deleteMock).toBeCalled();
            });
        });
    
        it('should return an error if there is a problem deleting the user', async () => {
          const deleteMock = jest.spyOn(User, "deleteOne");
          deleteMock.mockImplementation(() => Promise.reject("Internal server error"));
    
          return request(app).delete(`${URL_BASE}/invalid_id`)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(deleteMock).toBeCalled();
            });
        });
    });
  
    describe('POST /login', () => {
        it('should return the user if the email and password are correct', async () => {
          const user = new User({ username: "testuser", email:"test@gmail.com" });
          const loginMock = jest.spyOn(User, "findOne");
          loginMock.mockImplementation(() => user);
          const compareMock = jest.spyOn(bcrypt, "compare");
          compareMock.mockImplementation(() => true);
    
          return request(app).post(`${URL_BASE}/login`)
            .send({ email: "testuser@example.com", password: "securepassword" })
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body.username).toBe("testuser");
              expect(loginMock).toBeCalled();
              expect(compareMock).toBeCalled();
            });
        });
    
        it('should return an error if the email is not found', async () => {
          const loginMock = jest.spyOn(User, "findOne");
          loginMock.mockImplementation(() => undefined);
    
          return request(app).post(`${URL_BASE}/login`)
            .send({ email: "invalid@example.com", password: "securepassword" })
            .then((response) => {
              expect(response.statusCode).toBe(400);
              expect(loginMock).toBeCalled();
            });
        });
    
        it('should return an error if the password is incorrect', async () => {
          const user = new User({ username: "testuser", email:"test@gmail.com" });
          const loginMock = jest.spyOn(User, "findOne");
          loginMock.mockImplementation(() => user);
          const compareMock = jest.spyOn(bcrypt, "compare");
          compareMock.mockImplementation(() => false);
    
          return request(app).post(`${URL_BASE}/login`)
            .send({ email: "testuser@example.com", password: "wrongpassword" })
            .then((response) => {
              expect(response.statusCode).toBe(400);
              expect(loginMock).toBeCalled();
              expect(compareMock).toBeCalled();
            });
        });
      });
});

describe('Song integration tests', () => {
    describe('POST /api/v1/likes', () => {
        beforeEach(() => {
            fetchMock.enableMocks();
            fetchMock.resetMocks();
        });
        it('should create a new like for a song', async () => {
            const user = new User({
                "username": "testuser",
                "email": "testuser@example.com",
                "password": "securepassword",
            });
            const token = JWT_TEST_TOKEN;
            const song = {
                "songId": "12345",
                "userId": user._id
            }
            const mockFetch = jest.spyOn(global, 'fetch');
            mockFetch.mockImplementationOnce((query, x, y) => {
                return {status: 201, statusCode: 201};
            });
            
            return request(app)
                .post(URL_BASE_SONGS)
                .set('Authorization', `Bearer ${token}`)
                .send(song)
                .then((response) => {
                    expect(mockFetch).toBeCalled();
                    expect(response.statusCode).toBe(201);
                });
        });
    
        it('should return an error if the user is not authenticated', async () => {
            const mockFetch = jest.spyOn(global, 'fetch');
            mockFetch.mockImplementationOnce((query, x, y) => {
                return {status: 401, statusCode: 401};
            });
            return request(app)
                .post(URL_BASE_SONGS)
                .then((response) => {
                    expect(response.statusCode).toBe(401);
                });
        });
    });

    describe('DELETE /api/v1/likes/:songId', () => {
        beforeEach(() => {
            fetchMock.enableMocks();
            fetchMock.resetMocks();
        });
        it('should delete the like for a song', async () => {
            const user = new User({
                "username": "testuser",
                "email": "test@gmail.com",
                "password": "securepassword",
            });
            const token = JWT_TEST_TOKEN;
            const song = {
                "songId": "12345",
                "userId": user._id
            }
            const mockFetch = jest.spyOn(global, 'fetch');
            mockFetch.mockImplementationOnce((query, x, y) => {
                return { status: 200, statusCode: 200 };
            }
            );
            return request(app)
                .delete(`${URL_BASE_SONGS}/${song.songId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(song)
                .then((response) => {
                    expect(mockFetch).toBeCalled();
                    expect(response.statusCode).toBe(200);
                });
            });
    });
    
    describe('GET /api/v1/likes/all', () => {
        beforeEach(() => {
            fetchMock.enableMocks();
            fetchMock.resetMocks();
        });
        it('should return all the likes for a user', async () => {
            const user = new User({
                "username": "testuser",
                "email": "test@gmaik.com",
                "password": "securepassword",
            });
            const song = {
                "songId": "12345",
                "userId": user._id
            }
            // const mockFetch = jest.spyOn(global, 'fetch');
            // mockFetch.mockImplementationOnce((query, x, y) => {
            //     return { status: 200, statusCode: 200, response: { status: 200 } };
            // }
            // );
            fetching = jest.spyOn(global, 'fetch');
            const mockResponse = {
                json: () => Promise.resolve([{id: '54321'}]),
                status: 200
            };
            fetching.mockImplementationOnce(() => Promise.resolve(mockResponse));
        
            // send userid in the query params
            return request(app)
                .get(`${URL_BASE_SONGS}/all?userId=${user._id}`)
                .send(song)
                .then((response) => {
                    expect(fetching).toBeCalled();
                    expect(response.statusCode).toBe(200);
                });
            });
    });         

});

  
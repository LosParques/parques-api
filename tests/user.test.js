const request = require('supertest');
const { app, startServer } = require('../index'); // Import both app and startServer
const db = require('../src/config/dbConfig'); // Your DB connection
require('dotenv').config(); // Load environment variables

let jwtToken;
let userId;
let server; // Store the server instance

beforeAll(async () => {
  // Start the server before the tests
  server = startServer();
});

afterAll(async () => {
  // Clean up the database to avoid test pollution (remove the test user)
  if (userId) {
    await db.query('DELETE FROM USERS WHERE user_id = $1', [userId]);
  }
  // Close DB connection or any other cleanup if needed
  await db.end();

  // Close the server after the tests
  server.close();
});

describe('User Authentication Tests', () => {
  // Test: Create a new user (signup)
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'password123',
        cellphone_number: '1234567890',
        group_role: 'User'
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created');
    expect(response.body.user).toHaveProperty('user_id');
    expect(response.body.user.username).toBe('testuser');

    userId = response.body.user.user_id; // Store user ID to delete later
  });

  // Test: Login with the created user
  it('should login successfully with correct credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'password123'
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body).toHaveProperty('token');
    jwtToken = response.body.token; // Store token to use in further tests if needed
  });

  // Test: Attempt login with incorrect credentials
  it('should return error with incorrect credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });

  // Test: Clean up the user (delete the test user)
  it('should delete the test user after tests', async () => {
    if (userId) {
      const response = await db.query('DELETE FROM USERS WHERE user_id = $1 RETURNING *', [userId]);
      expect(response.rowCount).toBe(1); // Ensure the user was deleted
    }
  });
});

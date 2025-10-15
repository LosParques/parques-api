# Parques API

This repository is the backend service for user authentication and management for the "Parques" project. It uses Express.js for the server, PostgreSQL for data storage (via Docker), and provides basic functionality for user sign-up and login.

## Features

- **User Signup**: Allows users to create an account by providing an email, username, password, cellphone number, and role.
- **User Login**: Authenticates users based on their username and password, returning a JWT token for future authenticated requests.
- **Role-Based Access**: Users can be assigned roles like Admin, Director, or User, with different levels of access (currently handled via JWT).

## Tech Stack

- **Node.js** (Express.js)
- **PostgreSQL** (Dockerized)
- **JWT** for authentication
- **bcrypt** for hashing passwords
- **Jest** for testing

## Installation

### Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= v16)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/) (via Docker in this project)

### Steps to get started

1. **Clone the repository**:

```bash
git clone https://github.com/LosParques/parques-api.git
cd parques-api
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:

Create a `.env` file in the root directory with the following variables:

```bash
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=mysecretpassword
DB_NAME=ParkServer
JWT_SECRET=your_jwt_secret_key
```

Replace `your_jwt_secret_key` with a secure key to sign JWT tokens.

4. **Run Docker for PostgreSQL**:

You can create a PostgreSQL Docker container by running the following command:

```bash
npm run create-docker
```

This will create and run a PostgreSQL container with the necessary environment variables.

5. **Initialize the Database**:

Once the Docker container is running, initialize the database schema and seed it with test data by running:

```bash
npm run init-db
```

6. **Start the server**:

Run the server using:

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port defined in your `.env` file).

## Endpoints

### `POST /users`

* **Description**: Creates a new user.

* **Request Body**:

```json
{
  "email": "user@example.com",
  "username": "newuser",
  "password": "password123",
  "cellphone_number": "1234567890",
  "group_role": "User"
}
```

* **Response**:

```json
{
  "message": "User created",
  "user": {
    "user_id": 1,
    "email": "user@example.com",
    "username": "newuser",
    "cellphone_number": "1234567890",
    "group_role": "User"
  }
```

### `POST /login`

* **Description**: Authenticates a user and returns a JWT token.

* **Request Body**:

```json
{
  "username": "newuser",
  "password": "password123"
}
```

* **Response**:

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE"
}
```

## Running Tests

This project includes Jest-based tests for user authentication. You can run the tests with:

```bash
npm test
```

The tests will cover:

* User creation (sign-up)
* User login with valid credentials
* User login with invalid credentials
* Clean-up (deleting test users)

## Docker Commands

Here are some useful commands for managing the Docker container:

* **Start the container**:

```bash
npm run start-docker
```

* **Stop the container**:

```bash
docker stop ParkServer
```

* **Remove the container**:

```bash
docker rm ParkServer
```

## Contribution

Feel free to fork and submit pull requests. If you find any bugs or issues, please report them on the [GitHub issues page](https://github.com/LosParques/parques-api/issues).

## License

This project is licensed under the GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details.

---

### Acknowledgments

* Thanks to the authors of the libraries used in this project: [Express.js](https://expressjs.com/), [PostgreSQL](https://www.postgresql.org/), [JWT](https://jwt.io/), [bcrypt](https://www.npmjs.com/package/bcrypt), and [Jest](https://jestjs.io/).

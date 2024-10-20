# Secure Fair Voting System 

## Overview

This is a voting system API built using Node.js, Express, PostgreSQL, and JWT authentication. The API allows users to manage voting rooms, candidates, voters, and cast votes. It also provides endpoints for user login and results retrieval.

### Key Features:
- **JWT Authentication**: Secure endpoints for managing voting rooms, candidates, and voters.
- **Voting Functionality**: Voters can cast their votes, which are validated and securely stored.
- **Vote Results**: Fetches weighted voting results based on the number of votes and a decay factor.
  
## API Endpoints

### Public Endpoints
1. Login
2. Cast Vote
3. Get Results

### Protected Endpoints (JWT Authentication Required)
1. Create Voting Room
2. Add Candidates
3. Add Voters

---

## Authentication

### JWT Token Authentication
Protected routes require a valid JWT token. You must include the token in the `Authorization` header in the format:

## Database Structure

The following tables are used in this voting system:

1. **`USERS`**: Stores admin users with hashed passwords.
2. **`VOTING_ROOM`**: Stores voting rooms.
3. **`CANDIDATE`**: Stores candidates.
4. **`STANDING_IN`**: Links candidates to voting rooms.
5. **`VOTER`**: Stores voters with hashed credentials.
6. **`VOTE`**: Stores votes for candidates in specific rooms.
7. **`VOTED_IN`**: Tracks which voters have voted in which rooms.

## Security

- **JWT Token**: Admin-related actions are protected by JWT tokens. Tokens expire after 1 hour.
- **Bcrypt Hashing**: Voter and admin passwords are securely hashed using bcryptjs.
  
## Setup Instructions

1. Clone the repository.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables (`.env`):
    ```
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_DATABASE=your_database_name
    DB_HOST=your_database_host
    DB_PORT=your_database_port
    JWT_SECRET=your_secret_key
    ```
4. Start the server:
    ```bash
    npm start
    ```

The server will run on port `3000`.

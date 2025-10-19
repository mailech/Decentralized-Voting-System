# API Documentation

Base URL: `http://localhost:4000/api`

## Authentication

Admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Voters

#### Register Voter
```http
POST /api/voters/register
Content-Type: application/json

{
  "walletAddress": "0x...",
  "identityHash": "0x...",
  "ipfsCID": "Qm...",
  "email": "voter@example.com",
  "phoneNumber": "+1234567890"
}

Response: 201 Created
{
  "message": "Voter registered successfully",
  "voter": {
    "id": "uuid",
    "walletAddress": "0x...",
    "isRegistered": true,
    "isVerified": false
  }
}
```

#### Get Voter
```http
GET /api/voters/:walletAddress

Response: 200 OK
{
  "id": "uuid",
  "walletAddress": "0x...",
  "isRegistered": true,
  "isVerified": true,
  "registeredAt": "2024-01-01T00:00:00Z",
  "verifiedAt": "2024-01-02T00:00:00Z",
  "kycStatus": "approved"
}
```

#### Verify Voter (Admin)
```http
POST /api/voters/:walletAddress/verify
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "message": "Voter verified successfully",
  "voter": { ... }
}
```

### Elections

#### Create Election (Admin)
```http
POST /api/elections
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Presidential Election 2024",
  "description": "National presidential election",
  "startTime": "2024-06-01T00:00:00Z",
  "endTime": "2024-06-30T23:59:59Z",
  "privacyMode": "commit_only",
  "ipfsCID": "Qm..."
}

Response: 201 Created
{
  "message": "Election created successfully",
  "election": {
    "id": "uuid",
    "electionId": 0,
    "name": "Presidential Election 2024",
    "status": "created",
    ...
  }
}
```

#### Get All Elections
```http
GET /api/elections

Response: 200 OK
{
  "elections": [
    {
      "id": "uuid",
      "name": "Election Name",
      "status": "active",
      "startTime": "2024-06-01T00:00:00Z",
      "endTime": "2024-06-30T23:59:59Z",
      "totalVotes": 150,
      "candidates": [...]
    }
  ]
}
```

#### Get Election Details
```http
GET /api/elections/:electionId

Response: 200 OK
{
  "election": {
    "id": "uuid",
    "name": "Election Name",
    "description": "...",
    "status": "active",
    "candidates": [
      {
        "id": "uuid",
        "name": "Candidate Name",
        "description": "...",
        "voteCount": 50
      }
    ]
  }
}
```

#### Add Candidate (Admin)
```http
POST /api/elections/:electionId/candidates
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "John Doe",
  "description": "Candidate description",
  "ipfsCID": "Qm...",
  "imageUrl": "https://..."
}

Response: 201 Created
{
  "message": "Candidate added successfully",
  "candidate": { ... }
}
```

#### Start Election (Admin)
```http
POST /api/elections/:electionId/start
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "message": "Election started successfully",
  "election": { ... }
}
```

#### Close Election (Admin)
```http
POST /api/elections/:electionId/close
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "message": "Election closed successfully",
  "election": { ... }
}
```

#### Get Results
```http
GET /api/elections/:electionId/results

Response: 200 OK
{
  "election": {
    "id": "uuid",
    "name": "Election Name",
    "totalVotes": 200,
    "status": "tallied"
  },
  "candidates": [
    {
      "id": "uuid",
      "name": "Candidate Name",
      "voteCount": 120,
      "percentage": "60.00"
    }
  ]
}
```

### Votes

#### Submit Vote
```http
POST /api/votes
Content-Type: application/json

{
  "electionId": "uuid",
  "walletAddress": "0x...",
  "voteCommitment": "0x...",
  "txHash": "0x...",
  "ipfsCID": "Qm..."
}

Response: 201 Created
{
  "message": "Vote submitted successfully",
  "vote": {
    "id": "uuid",
    "txHash": "0x...",
    "timestamp": "2024-06-15T12:00:00Z"
  }
}
```

#### Verify Vote
```http
GET /api/votes/verify/:txHash

Response: 200 OK
{
  "verified": true,
  "vote": {
    "txHash": "0x...",
    "timestamp": "2024-06-15T12:00:00Z",
    "electionName": "Presidential Election 2024",
    "voteCommitment": "0x...",
    "blockNumber": 12345
  }
}
```

#### Get Vote by Election and Voter
```http
GET /api/votes/election/:electionId/voter/:walletAddress

Response: 200 OK
{
  "vote": {
    "id": "uuid",
    "txHash": "0x...",
    "timestamp": "2024-06-15T12:00:00Z",
    "voteCommitment": "0x..."
  }
}
```

### Audit Logs

#### Get Audit Logs (Admin)
```http
GET /api/audit?page=1&limit=50&action=vote_submitted&entityType=vote
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "logs": [
    {
      "id": "uuid",
      "action": "vote_submitted",
      "entityType": "vote",
      "details": { ... },
      "txHash": "0x...",
      "createdAt": "2024-06-15T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 50,
    "totalPages": 10
  }
}
```

#### Get Election Audit Logs (Admin)
```http
GET /api/audit/election/:electionId
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "logs": [ ... ]
}
```

### Authentication

#### Admin Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin"
  }
}
```

#### Admin Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newadmin",
  "email": "newadmin@example.com",
  "password": "securepassword",
  "role": "election_manager"
}

Response: 201 Created
{
  "message": "Admin registered successfully",
  "admin": { ... }
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "admin": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin",
    "lastLogin": "2024-06-15T12:00:00Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Pagination

List endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 20,
    "totalPages": 25
  }
}
```

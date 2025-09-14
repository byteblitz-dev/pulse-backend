# 📚 API Documentation

Complete reference for all Pulse Backend API endpoints.

## Base URL

- **Development**: `http://localhost:4000`
- **Production**: `https://backend-production-e915.up.railway.app`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints Overview

### Health Check
- `GET /health` - Server status

### Authentication
- `POST /auth/athlete/signup` - Register athlete
- `POST /auth/athlete/signin` - Login athlete
- `POST /auth/official/signup` - Register official
- `POST /auth/official/signin` - Login official

### Data Management
- `POST /data/store` - Store test result (athletes)
- `GET /data/my-results` - Get my results (athletes)
- `GET /data/all` - Get all results (officials)
- `GET /data/athlete/:athleteId` - Get athlete results (officials)

### AI Feedback
- `POST /feedback` - Get performance feedback (both athletes and officials)

## Detailed Endpoints

### Health Check

#### GET /health

Check server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "development"
}
```

### Authentication Endpoints

#### POST /auth/athlete/signup

Register a new athlete.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25
}
```

**Response:**
```json
{
  "id": "clr1234567890",
  "name": "John Doe"
}
```

#### POST /auth/athlete/signin

Login as an athlete.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/official/signup

Register a new official.

**Request Body:**
```json
{
  "name": "Coach Smith",
  "email": "coach@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "clr0987654321",
  "name": "Coach Smith"
}
```

#### POST /auth/official/signin

Login as an official.

**Request Body:**
```json
{
  "email": "coach@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Data Management Endpoints

#### POST /data/store

Store a test result (athletes only).

**Headers:**
```
Authorization: Bearer <athlete_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "testType": "vertical_jump",
  "metrics": {
    "height": 45.2,
    "confidence": 0.95,
    "timestamp": "2024-01-15T10:30:00Z",
    "attempts": 3,
    "bestAttempt": 1
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "id": "clr1111111111",
    "testType": "vertical_jump",
    "metrics": {
      "height": 45.2,
      "confidence": 0.95,
      "timestamp": "2024-01-15T10:30:00Z",
      "attempts": 3,
      "bestAttempt": 1
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "session": {
      "id": "clr2222222222",
      "athleteId": "clr1234567890",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### GET /data/my-results

Get my test results (athletes only).

**Headers:**
```
Authorization: Bearer <athlete_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "clr1111111111",
      "testType": "vertical_jump",
      "metrics": {
        "height": 45.2,
        "confidence": 0.95
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "session": {
        "id": "clr2222222222",
        "athleteId": "clr1234567890",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
  ]
}
```

#### GET /data/all

Get all athletes' results (officials only).

**Headers:**
```
Authorization: Bearer <official_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "clr1111111111",
      "testType": "vertical_jump",
      "metrics": {
        "height": 45.2,
        "confidence": 0.95
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "session": {
        "id": "clr2222222222",
        "athleteId": "clr1234567890",
        "createdAt": "2024-01-15T10:30:00Z",
        "athlete": {
          "id": "clr1234567890",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "age": 25
        }
      }
    }
  ]
}
```

#### GET /data/athlete/:athleteId

Get results for a specific athlete (officials only).

**Headers:**
```
Authorization: Bearer <official_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "clr1111111111",
      "testType": "vertical_jump",
      "metrics": {
        "height": 45.2,
        "confidence": 0.95
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "session": {
        "id": "clr2222222222",
        "athleteId": "clr1234567890",
        "createdAt": "2024-01-15T10:30:00Z",
        "athlete": {
          "id": "clr1234567890",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "age": 25
        }
      }
    }
  ]
}
```

### AI Feedback Endpoints

#### POST /feedback

Get AI-generated performance feedback. Automatically detects if you're an athlete or official based on your JWT token.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "performanceData": {
    "testType": "vertical_jump",
    "metrics": {
      "height": 45.2,
      "previousBest": 42.1,
      "improvement": 7.4,
      "confidence": 0.95,
      "attempts": 3
    }
  }
}
```

**Response (Athlete):**
```json
{
  "feedback": "Great job on your vertical jump! You've improved by 7.4% from your previous best of 42.1cm to 45.2cm. This shows excellent progress in your lower body power development. To continue improving, focus on explosive leg exercises and plyometric training. Keep up the great work!"
}
```

**Response (Official):**
```json
{
  "feedback": "John Doe (25 years old) shows significant improvement in vertical jump performance with a 7.4% increase from 42.1cm to 45.2cm. This places him in the above-average category for his age group. The high confidence score (0.95) indicates reliable measurement. Recommend continued focus on plyometric training and lower body strength development to maintain this positive trajectory."
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["email"],
      "message": "Required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized: Invalid or missing token"
}
```

### 404 Not Found
```json
{
  "message": "Route not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Rate Limiting

- No rate limiting currently implemented
- Consider implementing for production use

## CORS

The API is configured to accept requests from:
- **Development**: `http://localhost:3000`, `http://localhost:3001`
- **Production**: Your `FRONTEND_URL` environment variable
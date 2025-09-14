# 🧪 Testing Guide

Complete testing instructions for all Pulse Backend API endpoints using cURL and Postman.

## Prerequisites

- Backend server running on `http://localhost:4000` (development) or `https://backend-production-e915.up.railway.app` (production)
- cURL or Postman installed
- Valid test data

## Production Testing

For production testing, replace `http://localhost:4000` with `https://backend-production-e915.up.railway.app` in all examples below.

## Health Check

### cURL
```bash
curl -X GET http://localhost:4000/health
```

### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/health`
- **Headers**: None required
- **Expected Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "development"
}
```

## Authentication Testing

### 1. Athlete Registration

#### cURL
```bash
curl -X POST http://localhost:4000/auth/athlete/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "age": 25
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/auth/athlete/signup`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "age": 25
}
```
- **Expected Response**:
```json
{
  "id": "clr1234567890",
  "name": "John Doe"
}
```

### 2. Athlete Login

#### cURL
```bash
curl -X POST http://localhost:4000/auth/athlete/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/auth/athlete/signin`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
- **Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Official Registration

#### cURL
```bash
curl -X POST http://localhost:4000/auth/official/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coach Smith",
    "email": "coach.smith@example.com",
    "password": "password123"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/auth/official/signup`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Coach Smith",
  "email": "coach.smith@example.com",
  "password": "password123"
}
```
- **Expected Response**:
```json
{
  "id": "clr0987654321",
  "name": "Coach Smith"
}
```

### 4. Official Login

#### cURL
```bash
curl -X POST http://localhost:4000/auth/official/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "coach.smith@example.com",
    "password": "password123"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/auth/official/signin`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "coach.smith@example.com",
  "password": "password123"
}
```
- **Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Data Management Testing

### 1. Store Test Result (Athletes)

#### cURL
```bash
curl -X POST http://localhost:4000/data/store \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE" \
  -d '{
    "testType": "vertical_jump",
    "metrics": {
      "height": 45.2,
      "confidence": 0.95,
      "timestamp": "2024-01-15T10:30:00Z",
      "attempts": 3,
      "bestAttempt": 1
    }
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/data/store`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE`
- **Body** (raw JSON):
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
- **Expected Response**:
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

### 2. Get My Results (Athletes)

#### cURL
```bash
curl -X GET http://localhost:4000/data/my-results \
  -H "Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/data/my-results`
- **Headers**: 
  - `Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE`
- **Expected Response**:
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

### 3. Get All Results (Officials)

#### cURL
```bash
curl -X GET http://localhost:4000/data/all \
  -H "Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/data/all`
- **Headers**: 
  - `Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE`
- **Expected Response**:
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

### 4. Get Athlete Results (Officials)

#### cURL
```bash
curl -X GET http://localhost:4000/data/athlete/clr1234567890 \
  -H "Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/data/athlete/clr1234567890`
- **Headers**: 
  - `Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE`
- **Expected Response**:
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

## AI Feedback Testing

### 1. Get Performance Feedback (Athletes)

#### cURL
```bash
curl -X POST http://localhost:4000/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE" \
  -d '{
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
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/feedback`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE`
- **Body** (raw JSON):
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
- **Expected Response**:
```json
{
  "feedback": "Great job on your vertical jump! You've improved by 7.4% from your previous best of 42.1cm to 45.2cm. This shows excellent progress in your lower body power development. To continue improving, focus on explosive leg exercises and plyometric training. Keep up the great work!"
}
```

### 2. Get Performance Feedback (Officials)

#### cURL
```bash
curl -X POST http://localhost:4000/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE" \
  -d '{
    "performanceData": {
      "testType": "vertical_jump",
      "metrics": {
        "height": 45.2,
        "athleteAge": 25,
        "athleteName": "John Doe",
        "previousBest": 42.1,
        "improvement": 7.4,
        "confidence": 0.95
      }
    }
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/feedback`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE`
- **Body** (raw JSON):
```json
{
  "performanceData": {
    "testType": "vertical_jump",
    "metrics": {
      "height": 45.2,
      "athleteAge": 25,
      "athleteName": "John Doe",
      "previousBest": 42.1,
      "improvement": 7.4,
      "confidence": 0.95
    }
  }
}
```
- **Expected Response**:
```json
{
  "feedback": "John Doe (25 years old) shows significant improvement in vertical jump performance with a 7.4% increase from 42.1cm to 45.2cm. This places him in the above-average category for his age group. The high confidence score (0.95) indicates reliable measurement. Recommend continued focus on plyometric training and lower body strength development to maintain this positive trajectory."
}
```

## Error Testing

### 1. Invalid Authentication

#### cURL
```bash
curl -X GET http://localhost:4000/data/my-results \
  -H "Authorization: Bearer invalid_token"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/data/my-results`
- **Headers**: 
  - `Authorization: Bearer invalid_token`
- **Expected Response**:
```json
{
  "message": "Unauthorized: Invalid or missing token"
}
```

### 2. Missing Required Fields

#### cURL
```bash
curl -X POST http://localhost:4000/auth/athlete/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/auth/athlete/signup`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "John Doe"
}
```
- **Expected Response**:
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
    },
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["password"],
      "message": "Required"
    }
  ]
}
```

### 3. Duplicate Email Registration

#### cURL
```bash
curl -X POST http://localhost:4000/auth/athlete/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/auth/athlete/signup`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Another User",
  "email": "john.doe@example.com",
  "password": "password123"
}
```
- **Expected Response**:
```json
{
  "message": "Athlete signup failed",
  "error": "Unique constraint failed on the field: `email`"
}
```

## Test Data Examples

### Different Test Types

#### Height Test
```json
{
  "testType": "height",
  "metrics": {
    "value": 175.5,
    "unit": "cm",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Weight Test
```json
{
  "testType": "weight",
  "metrics": {
    "value": 70.2,
    "unit": "kg",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Shuttle Run Test
```json
{
  "testType": "shuttle_run",
  "metrics": {
    "time": 12.5,
    "unit": "seconds",
    "level": 8,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Endurance Run Test
```json
{
  "testType": "endurance_run",
  "metrics": {
    "distance": 2.5,
    "unit": "km",
    "time": 15.2,
    "pace": "6:08",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Sit-ups Test
```json
{
  "testType": "sit_ups",
  "metrics": {
    "count": 45,
    "time": 60,
    "unit": "seconds",
    "confidence": 0.92,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Postman Collection Setup

1. **Create a new Postman Collection** named "Pulse Backend API"
2. **Set up Environment Variables**:
   - `base_url`: `http://localhost:4000` (development) or `https://backend-production-e915.up.railway.app` (production)
   - `athlete_token`: (set after login)
   - `official_token`: (set after login)
3. **Use variables in requests**:
   - URL: `{{base_url}}/auth/athlete/signin`
   - Authorization: `Bearer {{athlete_token}}`

## Testing Workflow

1. **Start the server**: `cd apps/backend && pnpm dev`
2. **Test health check**: Verify server is running
3. **Register test users**: Create athlete and official accounts
4. **Login and get tokens**: Store JWT tokens for authenticated requests
5. **Test data endpoints**: Store and retrieve test results
6. **Test feedback endpoints**: Get AI-generated feedback
7. **Test error scenarios**: Verify proper error handling
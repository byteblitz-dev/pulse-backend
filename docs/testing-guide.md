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
curl -X POST http://localhost:4000/athlete/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "2000-01-15T00:00:00Z",
    "age": 24,
    "gender": "MALE",
    "sport": "SWIMMING",
    "password": "password123"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/athlete/signup`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "2000-01-15T00:00:00Z",
  "age": 24,
  "gender": "MALE",
  "sport": "SWIMMING",
  "password": "password123"
}
```
- **Expected Response**:
```json
{
  "success": true,
  "athlete": {
    "id": "clr1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "sport": "SWIMMING"
  }
}
```

### 2. Athlete Login

#### cURL
```bash
curl -X POST http://localhost:4000/athlete/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/athlete/signin`
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
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Signin successful"
}
```

### 3. Official Registration

#### cURL
```bash
curl -X POST http://localhost:4000/official/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1234567891",
    "gender": "FEMALE",
    "sport": "SWIMMING",
    "password": "password123"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/official/signup`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567891",
  "gender": "FEMALE",
  "sport": "SWIMMING",
  "password": "password123"
}
```
- **Expected Response**:
```json
{
  "success": true,
  "official": {
    "id": "clr0987654321",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "sport": "SWIMMING"
  }
}
```

### 4. Official Login

#### cURL
```bash
curl -X POST http://localhost:4000/official/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "password123"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/official/signin`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "jane.smith@example.com",
  "password": "password123"
}
```
- **Expected Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Signin successful"
}
```

## Test Management Testing

### 1. Store Standardized Test (Athletes)

#### cURL
```bash
curl -X POST http://localhost:4000/athlete/tests/standardized \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE" \
  -d '{
    "testDate": "2024-01-15T10:30:00Z",
    "height": 180.5,
    "weight": 75.2,
    "sitAndReach": {
      "value": 25.5,
      "unit": "cm"
    },
    "standingVerticalJump": {
      "value": 45.2,
      "unit": "cm"
    },
    "standingBroadJump": {
      "value": 2.8,
      "unit": "m"
    },
    "medicineBallThrow": {
      "value": 8.5,
      "unit": "m"
    },
    "sprint30m": {
      "value": 4.2,
      "unit": "seconds"
    },
    "shuttleRun4x10m": {
      "value": 12.5,
      "unit": "seconds"
    },
    "situps": {
      "count": 45,
      "time": 60,
      "unit": "seconds"
    },
    "run800m": {
      "value": 180.5,
      "unit": "seconds"
    }
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/athlete/tests/standardized`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE`
- **Body** (raw JSON):
```json
{
  "testDate": "2024-01-15T10:30:00Z",
  "height": 180.5,
  "weight": 75.2,
  "sitAndReach": {
    "value": 25.5,
    "unit": "cm"
  },
  "standingVerticalJump": {
    "value": 45.2,
    "unit": "cm"
  },
  "standingBroadJump": {
    "value": 2.8,
    "unit": "m"
  },
  "medicineBallThrow": {
    "value": 8.5,
    "unit": "m"
  },
  "sprint30m": {
    "value": 4.2,
    "unit": "seconds"
  },
  "shuttleRun4x10m": {
    "value": 12.5,
    "unit": "seconds"
  },
  "situps": {
    "count": 45,
    "time": 60,
    "unit": "seconds"
  },
  "run800m": {
    "value": 180.5,
    "unit": "seconds"
  }
}
```
- **Expected Response**:
```json
{
  "success": true,
  "test": {
    "id": "clr1111111111",
    "athleteId": "clr1234567890",
    "testDate": "2024-01-15T10:30:00Z",
    "height": 180.5,
    "weight": 75.2,
    "sitAndReach": {
      "value": 25.5,
      "unit": "cm"
    },
    "standingVerticalJump": {
      "value": 45.2,
      "unit": "cm"
    },
    "standingBroadJump": {
      "value": 2.8,
      "unit": "m"
    },
    "medicineBallThrow": {
      "value": 8.5,
      "unit": "m"
    },
    "sprint30m": {
      "value": 4.2,
      "unit": "seconds"
    },
    "shuttleRun4x10m": {
      "value": 12.5,
      "unit": "seconds"
    },
    "situps": {
      "count": 45,
      "time": 60,
      "unit": "seconds"
    },
    "run800m": {
      "value": 180.5,
      "unit": "seconds"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Standardized test stored successfully"
}
```

### 2. Store Psychological Assessment (Athletes)

#### cURL
```bash
curl -X POST http://localhost:4000/athlete/tests/psychological \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE" \
  -d '{
    "assessmentDate": "2024-01-15T10:30:00Z",
    "mentalToughness": {
      "score": 85,
      "level": "high"
    },
    "competitiveAnxiety": {
      "level": 25,
      "type": "low"
    },
    "teamCohesion": {
      "score": 78,
      "rating": "good"
    },
    "mentalHealth": {
      "status": "healthy",
      "score": 90
    },
    "personalityTraits": {
      "confidence": 80,
      "resilience": 85
    },
    "motivationGoals": {
      "intrinsic": 90,
      "extrinsic": 70
    },
    "stressCoping": {
      "strategy": "adaptive",
      "score": 82
    },
    "healthScreening": {
      "status": "clear",
      "score": 95
    },
    "imageryAbility": {
      "score": 75,
      "type": "visual"
    },
    "reactionTime": {
      "average": 180,
      "unit": "ms"
    },
    "determination": {
      "score": 88,
      "level": "high"
    },
    "timeAnticipation": {
      "accuracy": 85,
      "unit": "%"
    },
    "peripheralVision": {
      "score": 78,
      "range": "good"
    },
    "attentionAlertness": {
      "score": 82,
      "level": "high"
    },
    "sensorimotorTasks": {
      "score": 80,
      "coordination": "good"
    },
    "balanceTests": {
      "score": 85,
      "stability": "excellent"
    },
    "psychomotorTasks": {
      "score": 78,
      "speed": "fast"
    },
    "cognitiveTasks": {
      "score": 88,
      "memory": "excellent"
    },
    "performanceConsistency": {
      "score": 82,
      "variability": "low"
    }
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/athlete/tests/psychological`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE`
- **Body** (raw JSON):
```json
{
  "assessmentDate": "2024-01-15T10:30:00Z",
  "mentalToughness": {
    "score": 85,
    "level": "high"
  },
  "competitiveAnxiety": {
    "level": 25,
    "type": "low"
  },
  "teamCohesion": {
    "score": 78,
    "rating": "good"
  },
  "mentalHealth": {
    "status": "healthy",
    "score": 90
  },
  "personalityTraits": {
    "confidence": 80,
    "resilience": 85
  },
  "motivationGoals": {
    "intrinsic": 90,
    "extrinsic": 70
  },
  "stressCoping": {
    "strategy": "adaptive",
    "score": 82
  },
  "healthScreening": {
    "status": "clear",
    "score": 95
  },
  "imageryAbility": {
    "score": 75,
    "type": "visual"
  },
  "reactionTime": {
    "average": 180,
    "unit": "ms"
  },
  "determination": {
    "score": 88,
    "level": "high"
  },
  "timeAnticipation": {
    "accuracy": 85,
    "unit": "%"
  },
  "peripheralVision": {
    "score": 78,
    "range": "good"
  },
  "attentionAlertness": {
    "score": 82,
    "level": "high"
  },
  "sensorimotorTasks": {
    "score": 80,
    "coordination": "good"
  },
  "balanceTests": {
    "score": 85,
    "stability": "excellent"
  },
  "psychomotorTasks": {
    "score": 78,
    "speed": "fast"
  },
  "cognitiveTasks": {
    "score": 88,
    "memory": "excellent"
  },
  "performanceConsistency": {
    "score": 82,
    "variability": "low"
  }
}
```
- **Expected Response**:
```json
{
  "success": true,
  "assessment": {
    "id": "clr2222222222",
    "athleteId": "clr1234567890",
    "assessmentDate": "2024-01-15T10:30:00Z",
    "mentalToughness": {
      "score": 85,
      "level": "high"
    },
    "competitiveAnxiety": {
      "level": 25,
      "type": "low"
    },
    // ... other assessment data
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Psychological assessment stored successfully"
}
```

### 3. Store Sport-Specific Test (Athletes)

#### cURL
```bash
curl -X POST http://localhost:4000/athlete/tests/sport-specific \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE" \
  -d '{
    "testDate": "2024-01-15T10:30:00Z",
    "testResults": {
      "strokeRate": 28,
      "strokeLength": 2.1,
      "swimTime": 120.5,
      "efficiency": 85,
      "technique": {
        "score": 88,
        "notes": "Good form"
      },
      "endurance": {
        "score": 82,
        "level": "high"
      },
      "power": {
        "score": 75,
        "measurement": "watts"
      },
      "flexibility": {
        "score": 80,
        "range": "good"
      }
    }
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/athlete/tests/sport-specific`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE`
- **Body** (raw JSON):
```json
{
  "testDate": "2024-01-15T10:30:00Z",
  "testResults": {
    "strokeRate": 28,
    "strokeLength": 2.1,
    "swimTime": 120.5,
    "efficiency": 85,
    "technique": {
      "score": 88,
      "notes": "Good form"
    },
    "endurance": {
      "score": 82,
      "level": "high"
    },
    "power": {
      "score": 75,
      "measurement": "watts"
    },
    "flexibility": {
      "score": 80,
      "range": "good"
    }
  }
}
```
- **Expected Response**:
```json
{
  "success": true,
  "test": {
    "id": "clr3333333333",
    "athleteId": "clr1234567890",
    "testDate": "2024-01-15T10:30:00Z",
    "testResults": {
      "strokeRate": 28,
      "strokeLength": 2.1,
      "swimTime": 120.5,
      "efficiency": 85,
      "technique": {
        "score": 88,
        "notes": "Good form"
      },
      "endurance": {
        "score": 82,
        "level": "high"
      },
      "power": {
        "score": 75,
        "measurement": "watts"
      },
      "flexibility": {
        "score": 80,
        "range": "good"
      }
    },
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Sport-specific test stored successfully"
}
```

### 4. Get Test History (Athletes)

#### cURL
```bash
curl -X GET http://localhost:4000/athlete/tests/history \
  -H "Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/athlete/tests/history`
- **Headers**: 
  - `Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE`
- **Expected Response**:
```json
{
  "success": true,
  "athlete": {
    "id": "clr1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "sport": "SWIMMING",
    "email": "john.doe@example.com",
    "age": 24,
    "gender": "MALE"
  },
  "testHistory": {
    "standardized": {
      "count": 5,
      "latest": {
        "id": "clr1111111111",
        "testDate": "2024-01-15T10:30:00Z",
        "height": 180.5,
        "weight": 75.2,
        // ... other test data
      },
      "all": [
        // ... all standardized tests
      ]
    },
    "psychological": {
      "count": 3,
      "latest": {
        "id": "clr2222222222",
        "assessmentDate": "2024-01-15T10:30:00Z",
        // ... assessment data
      },
      "all": [
        // ... all psychological assessments
      ]
    },
    "sportSpecific": {
      "count": 8,
      "latest": {
        "id": "clr3333333333",
        "testDate": "2024-01-15T10:30:00Z",
        "testResults": {
          // ... test results
        }
      },
      "all": [
        // ... all sport-specific tests
      ]
    }
  },
  "summary": {
    "totalTests": 16,
    "lastTestDate": 1705312200000
  }
}
```

## Official Management Testing

### 1. Get All Athletes in Sport (Officials)

#### cURL
```bash
curl -X GET http://localhost:4000/official/athletes \
  -H "Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/official/athletes`
- **Headers**: 
  - `Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE`
- **Expected Response**:
```json
{
  "success": true,
  "athletes": [
    {
      "id": "clr1234567890",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "age": 24,
      "gender": "MALE",
      "sport": "SWIMMING",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    // ... other athletes
  ],
  "sport": "SWIMMING",
  "count": 15,
  "message": "Found 15 athletes in SWIMMING"
}
```

### 2. Get All Test Results (Officials)

#### cURL
```bash
curl -X GET http://localhost:4000/official/athletes/tests \
  -H "Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/official/athletes/tests`
- **Headers**: 
  - `Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE`
- **Expected Response**:
```json
{
  "success": true,
  "sport": "SWIMMING",
  "athletes": [
    {
      "id": "clr1234567890",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "age": 24,
      "gender": "MALE",
      "sport": "SWIMMING",
      "testHistory": {
        "standardized": {
          "count": 5,
          "latest": {
            // ... latest standardized test
          },
          "all": [
            // ... all standardized tests
          ]
        },
        "psychological": {
          "count": 3,
          "latest": {
            // ... latest psychological assessment
          },
          "all": [
            // ... all psychological assessments
          ]
        },
        "sportSpecific": {
          "count": 8,
          "latest": {
            // ... latest sport-specific test
          },
          "all": [
            // ... all sport-specific tests
          ]
        }
      },
      "summary": {
        "totalTests": 16,
        "lastTestDate": 1705312200000
      }
    },
    // ... other athletes
  ],
  "sportTests": [
    // ... all sport-specific tests across all athletes
  ],
  "message": "Test results for all SWIMMING athletes"
}
```

### 3. Get Specific Athlete's Test History (Officials)

#### cURL
```bash
curl -X GET http://localhost:4000/official/athletes/clr1234567890/tests \
  -H "Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/official/athletes/clr1234567890/tests`
- **Headers**: 
  - `Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE`
- **Expected Response**:
```json
{
  "success": true,
  "athlete": {
    "id": "clr1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "age": 24,
    "gender": "MALE",
    "sport": "SWIMMING"
  },
  "testHistory": {
    // ... same structure as athlete's own test history
  },
  "summary": {
    // ... same structure as athlete's summary
  },
  "message": "Test history for John Doe"
}
```

## Leaderboard Testing

### 1. Get Leaderboard (Athletes)

#### cURL
```bash
curl -X GET http://localhost:4000/athlete/leaderboard \
  -H "Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/athlete/leaderboard`
- **Headers**: 
  - `Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE`
- **Expected Response**:
```json
{
  "success": true,
  "sport": "SWIMMING",
  "leaderboard": [
    {
      "category": "standardized",
      "entries": [
        {
          "athleteId": "clr1234567890",
          "firstName": "John",
          "lastName": "Doe",
          "sport": "SWIMMING",
          "standardizedScore": 85.5,
          "psychologicalScore": 78.2,
          "sportSpecificScore": 92.1,
          "overallScore": 85.3,
          "rank": 1,
          "totalTests": 16
        },
        // ... other athletes
      ]
    },
    {
      "category": "psychological",
      "entries": [
        // ... psychological rankings
      ]
    },
    {
      "category": "sportSpecific",
      "entries": [
        // ... sport-specific rankings
      ]
    },
    {
      "category": "overall",
      "entries": [
        // ... overall rankings
      ]
    }
  ],
  "message": "Leaderboard for SWIMMING athletes"
}
```

### 2. Get Leaderboard (Officials)

#### cURL
```bash
curl -X GET http://localhost:4000/official/leaderboard \
  -H "Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/official/leaderboard`
- **Headers**: 
  - `Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE`
- **Expected Response**:
```json
{
  "success": true,
  "sport": "SWIMMING",
  "leaderboard": [
    // ... same structure as athlete leaderboard
  ],
  "message": "Leaderboard for SWIMMING athletes"
}
```

## AI Feedback Testing

### 1. Get AI Feedback (Athletes)

#### cURL
```bash
curl -X GET http://localhost:4000/athlete/feedback \
  -H "Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/athlete/feedback`
- **Headers**: 
  - `Authorization: Bearer YOUR_ATHLETE_JWT_TOKEN_HERE`
- **Expected Response**:
```json
{
  "success": true,
  "report": {
    "athleteId": "clr1234567890",
    "athleteName": "John Doe",
    "sport": "SWIMMING",
    "reportDate": "2024-01-15T10:30:00Z",
    "overallScore": 85,
    "strengths": [
      "Excellent physical fitness and standardized test performance",
      "Outstanding swimming specific skills and performance",
      "Strong mental resilience and psychological readiness"
    ],
    "weaknesses": [
      "Mental preparation requires attention",
      "Swimming performance can be enhanced"
    ],
    "recommendations": [
      "Practice visualization and mental rehearsal techniques",
      "Work with sports psychologist for mental training",
      "Increase swimming specific training sessions",
      "Analyze technique with specialized coaches"
    ],
    "performanceTrends": {
      "standardized": "improving",
      "psychological": "stable",
      "sportSpecific": "improving"
    },
    "detailedAnalysis": {
      "standardized": {
        "score": 88,
        "analysis": "Physical fitness assessment shows improving performance...",
        "keyMetrics": {
          "height": 180.5,
          "weight": 75.2,
          "sitAndReach": 25.5,
          "standingVerticalJump": 45.2
        }
      },
      "psychological": {
        "score": 78,
        "analysis": "Mental preparation shows stable development...",
        "keyMetrics": {
          "mentalToughness": 85,
          "competitiveAnxiety": 25,
          "teamCohesion": 78,
          "mentalHealth": 90
        }
      },
      "sportSpecific": {
        "score": 89,
        "analysis": "Swimming specific performance shows improving results...",
        "keyMetrics": {
          "strokeRate": 28,
          "efficiency": 85,
          "technique": 88,
          "endurance": 82
        }
      }
    },
    "nextSteps": [
      "Schedule follow-up assessment in 4-6 weeks",
      "Implement recommended training modifications",
      "Track progress with regular testing",
      "Book consultation with sports psychologist",
      "Update training program with fitness coach"
    ],
    "motivationalMessage": "Great work! You're showing strong performance across all areas. Focus on the small improvements to reach the next level."
  },
  "message": "AI feedback report generated successfully"
}
```

### 2. Get AI Feedback for Specific Athlete (Officials)

#### cURL
```bash
curl -X GET http://localhost:4000/official/athletes/clr1234567890/feedback \
  -H "Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/official/athletes/clr1234567890/feedback`
- **Headers**: 
  - `Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE`
- **Expected Response**:
```json
{
  "success": true,
  "report": {
    // ... same structure as athlete feedback report
  },
  "message": "AI feedback report generated for John Doe"
}
```

### 3. Get AI Feedback for All Athletes (Officials)

#### cURL
```bash
curl -X GET http://localhost:4000/official/athletes/feedback \
  -H "Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/official/athletes/feedback`
- **Headers**: 
  - `Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE`
- **Expected Response**:
```json
{
  "success": true,
  "reports": [
    {
      "athleteId": "clr1234567890",
      "athleteName": "John Doe",
      "sport": "SWIMMING",
      "reportDate": "2024-01-15T10:30:00Z",
      "overallScore": 85,
      "strengths": [
        "Excellent physical fitness and standardized test performance",
        "Outstanding swimming specific skills and performance"
      ],
      "weaknesses": [
        "Mental preparation requires attention"
      ],
      "recommendations": [
        "Practice visualization and mental rehearsal techniques",
        "Work with sports psychologist for mental training"
      ],
      "performanceTrends": {
        "standardized": "improving",
        "psychological": "stable",
        "sportSpecific": "improving"
      },
      "detailedAnalysis": {
        // ... detailed analysis
      },
      "nextSteps": [
        "Schedule follow-up assessment in 4-6 weeks",
        "Implement recommended training modifications"
      ],
      "motivationalMessage": "Great work! You're showing strong performance across all areas."
    },
    // ... other athlete reports
  ],
  "totalAthletes": 15,
  "processedAthletes": 10,
  "message": "AI feedback reports generated for 10 athletes in SWIMMING"
}
```

## Error Testing

### 1. Invalid Authentication

#### cURL
```bash
curl -X GET http://localhost:4000/athlete/tests/history \
  -H "Authorization: Bearer invalid_token"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/athlete/tests/history`
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
curl -X POST http://localhost:4000/athlete/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/athlete/signup`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "firstName": "John",
  "lastName": "Doe"
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
curl -X POST http://localhost:4000/athlete/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Another",
    "lastName": "User",
    "email": "john.doe@example.com",
    "phone": "+1234567892",
    "dateOfBirth": "2000-01-15T00:00:00Z",
    "age": 24,
    "gender": "MALE",
    "sport": "SWIMMING",
    "password": "password123"
  }'
```

#### Postman
- **Method**: POST
- **URL**: `http://localhost:4000/athlete/signup`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "firstName": "Another",
  "lastName": "User",
  "email": "john.doe@example.com",
  "phone": "+1234567892",
  "dateOfBirth": "2000-01-15T00:00:00Z",
  "age": 24,
  "gender": "MALE",
  "sport": "SWIMMING",
  "password": "password123"
}
```
- **Expected Response**:
```json
{
  "message": "Email already exists"
}
```

### 4. Access Denied (Official trying to access athlete from different sport)

#### cURL
```bash
curl -X GET http://localhost:4000/official/athletes/clr1234567890/tests \
  -H "Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE"
```

#### Postman
- **Method**: GET
- **URL**: `http://localhost:4000/official/athletes/clr1234567890/tests`
- **Headers**: 
  - `Authorization: Bearer YOUR_OFFICIAL_JWT_TOKEN_HERE`
- **Expected Response** (if athlete is not in official's sport):
```json
{
  "message": "Access denied: Athlete is not in your sport"
}
```

## Test Data Examples

### Different Sport-Specific Tests

#### Swimming Test
```json
{
  "testDate": "2024-01-15T10:30:00Z",
  "testResults": {
    "strokeRate": 28,
    "strokeLength": 2.1,
    "swimTime": 120.5,
    "efficiency": 85,
    "technique": {
      "score": 88,
      "notes": "Good form"
    },
    "endurance": {
      "score": 82,
      "level": "high"
    },
    "power": {
      "score": 75,
      "measurement": "watts"
    },
    "flexibility": {
      "score": 80,
      "range": "good"
    }
  }
}
```

#### Archery Test
```json
{
  "testDate": "2024-01-15T10:30:00Z",
  "testResults": {
    "accuracy": 92,
    "consistency": 88,
    "focus": 85,
    "stability": 90,
    "technique": {
      "score": 87,
      "notes": "Good form"
    },
    "endurance": {
      "score": 82,
      "level": "high"
    }
  }
}
```

#### Boxing Test
```json
{
  "testDate": "2024-01-15T10:30:00Z",
  "testResults": {
    "punchPower": 85,
    "speed": 88,
    "endurance": 82,
    "technique": {
      "score": 90,
      "notes": "Excellent form"
    },
    "reactionTime": {
      "score": 87,
      "unit": "ms"
    },
    "agility": {
      "score": 83,
      "level": "high"
    }
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
   - URL: `{{base_url}}/athlete/signin`
   - Authorization: `Bearer {{athlete_token}}`

## Testing Workflow

1. **Start the server**: `cd apps/backend && pnpm dev`
2. **Test health check**: Verify server is running
3. **Register test users**: Create athlete and official accounts
4. **Login and get tokens**: Store JWT tokens for authenticated requests
5. **Test data endpoints**: Store and retrieve test results
6. **Test leaderboard endpoints**: Verify ranking calculations
7. **Test feedback endpoints**: Get AI-generated feedback
8. **Test error scenarios**: Verify proper error handling
9. **Test access control**: Verify sport-based access restrictions

## Supported Sports for Testing

When testing sport-specific endpoints, use one of these sports:

- `ARCHERY`
- `ATHLETICS`
- `BOXING`
- `CYCLING`
- `FENCING`
- `HOCKEY`
- `JUDO`
- `ROWING`
- `SWIMMING`
- `SHOOTING`
- `TABLE_TENNIS`
- `WEIGHTLIFTING`
- `WRESTLING`

## Gender Options for Testing

When testing registration endpoints, use one of these genders:

- `MALE`
- `FEMALE`
- `OTHER`
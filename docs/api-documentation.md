# API Documentation

Complete reference for all Pulse Backend API endpoints.

## Base URL

- **Development**: `http://localhost:4000`
- **Production**: `https://backend-production-e915.up.railway.app`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## API Structure

The API is organized into two main route groups:

- **`/athlete`** - All athlete-related functionality
- **`/official`** - All official-related functionality

## Endpoints Overview

### Health Check
- `GET /health` - Server status

### Athlete Routes (`/athlete`)
- `POST /athlete/signup` - Register athlete
- `POST /athlete/signin` - Login athlete
- `POST /athlete/tests/standardized` - Store standardized test
- `POST /athlete/tests/psychological` - Store psychological assessment
- `POST /athlete/tests/sport-specific` - Store sport-specific test
- `GET /athlete/tests/history` - Get own test history
- `GET /athlete/leaderboard` - Get leaderboard for sport
- `GET /athlete/feedback` - Generate AI feedback report

### Official Routes (`/official`)
- `POST /official/signup` - Register official
- `POST /official/signin` - Login official
- `GET /official/athletes` - Get all athletes in sport
- `GET /official/athletes/tests` - Get all test results for athletes
- `GET /official/athletes/:athleteId/tests` - Get specific athlete's test history
- `GET /official/leaderboard` - Get leaderboard for sport
- `GET /official/athletes/:athleteId/feedback` - Get AI feedback for specific athlete
- `GET /official/athletes/feedback` - Get AI feedback for all athletes

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

---

## Athlete Endpoints

### Authentication

#### POST /athlete/signup

Register a new athlete.

**Request Body:**
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
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "athlete": {
    "id": "clx123...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "sport": "SWIMMING"
  }
}
```

**Error Responses:**
- `400` - Validation failed
- `409` - Email or phone already exists

#### POST /athlete/signin

Login as an athlete.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Signin successful"
}
```

**Error Responses:**
- `400` - Invalid credentials
- `401` - Authentication failed

### Test Management

#### POST /athlete/tests/standardized

Store a standardized test result.

**Request Body:**
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

**Note:** For athletes 12 and older, use `run1600m` instead of `run800m`.

**Response:**
```json
{
  "success": true,
  "test": {
    "id": "clx456...",
    "athleteId": "clx123...",
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

#### POST /athlete/tests/psychological

Store a psychological assessment.

**Request Body:**
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

**Response:**
```json
{
  "success": true,
  "assessment": {
    "id": "clx789...",
    "athleteId": "clx123...",
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

#### POST /athlete/tests/sport-specific

Store a sport-specific test result. The exact model used depends on the athlete's sport.

**Request Body:**
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

**Response:**
```json
{
  "success": true,
  "test": {
    "id": "clx101...",
    "athleteId": "clx123...",
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

#### GET /athlete/tests/history

Get complete test history for the authenticated athlete.

**Response:**
```json
{
  "success": true,
  "athlete": {
    "id": "clx123...",
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
        "id": "clx456...",
        "testDate": "2024-01-15T10:30:00Z",
        "height": 180.5,
        "weight": 75.2,
        "sitAndReach": {
          "value": 25.5,
          "unit": "cm"
        },
        // ... other test data
      },
      "all": [
        // ... all standardized tests ordered by date (newest first)
      ]
    },
    "psychological": {
      "count": 3,
      "latest": {
        "id": "clx789...",
        "assessmentDate": "2024-01-15T10:30:00Z",
        "mentalToughness": {
          "score": 85,
          "level": "high"
        },
        // ... other assessment data
      },
      "all": [
        // ... all psychological assessments ordered by date (newest first)
      ]
    },
    "sportSpecific": {
      "count": 8,
      "latest": {
        "id": "clx101...",
        "testDate": "2024-01-15T10:30:00Z",
        "testResults": {
          "strokeRate": 28,
          "strokeLength": 2.1,
          // ... other test results
        }
      },
      "all": [
        // ... all sport-specific tests ordered by date (newest first)
      ]
    }
  },
  "summary": {
    "totalTests": 16,
    "lastTestDate": 1705312200000
  }
}
```

### Leaderboard

#### GET /athlete/leaderboard

Get leaderboard for the athlete's sport across all test categories.

**Response:**
```json
{
  "success": true,
  "sport": "SWIMMING",
  "leaderboard": [
    {
      "category": "standardized",
      "entries": [
        {
          "athleteId": "clx123...",
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
        {
          "athleteId": "clx124...",
          "firstName": "Jane",
          "lastName": "Smith",
          "sport": "SWIMMING",
          "standardizedScore": 82.3,
          "psychologicalScore": 85.1,
          "sportSpecificScore": 88.7,
          "overallScore": 85.4,
          "rank": 2,
          "totalTests": 14
        }
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

### AI Feedback

#### GET /athlete/feedback

Generate AI feedback report for the authenticated athlete.

**Response:**
```json
{
  "success": true,
  "report": {
    "athleteId": "clx123...",
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
        "analysis": "Physical fitness assessment shows improving performance. Key areas include cardiovascular endurance, strength, and flexibility. Focus on maintaining consistency in training.",
        "keyMetrics": {
          "height": 180.5,
          "weight": 75.2,
          "sitAndReach": 25.5,
          "standingVerticalJump": 45.2
        }
      },
      "psychological": {
        "score": 78,
        "analysis": "Mental preparation shows stable development. Psychological readiness is crucial for competitive performance. Continue mental training exercises.",
        "keyMetrics": {
          "mentalToughness": 85,
          "competitiveAnxiety": 25,
          "teamCohesion": 78,
          "mentalHealth": 90
        }
      },
      "sportSpecific": {
        "score": 89,
        "analysis": "Swimming specific performance shows improving results. Sport-specific skills are essential for competitive success. Focus on technique refinement.",
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

---

## Official Endpoints

### Authentication

#### POST /official/signup

Register a new official.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567891",
  "gender": "FEMALE",
  "sport": "SWIMMING",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "official": {
    "id": "clx202...",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "sport": "SWIMMING"
  }
}
```

**Error Responses:**
- `400` - Validation failed
- `409` - Email or phone already exists

#### POST /official/signin

Login as an official.

**Request Body:**
```json
{
  "email": "jane.smith@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Signin successful"
}
```

**Error Responses:**
- `400` - Invalid credentials
- `401` - Authentication failed

### Athlete Management

#### GET /official/athletes

Get all athletes in the official's sport.

**Response:**
```json
{
  "success": true,
  "athletes": [
    {
      "id": "clx123...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "age": 24,
      "gender": "MALE",
      "sport": "SWIMMING",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "clx124...",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+1234567891",
      "age": 22,
      "gender": "FEMALE",
      "sport": "SWIMMING",
      "createdAt": "2024-01-02T00:00:00Z"
    }
    // ... other athletes
  ],
  "sport": "SWIMMING",
  "count": 15,
  "message": "Found 15 athletes in SWIMMING"
}
```

#### GET /official/athletes/tests

Get all test results for athletes in the official's sport.

**Response:**
```json
{
  "success": true,
  "sport": "SWIMMING",
  "athletes": [
    {
      "id": "clx123...",
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
            "id": "clx456...",
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
            "id": "clx789...",
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
            "id": "clx101...",
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
    },
    // ... other athletes
  ],
  "sportTests": [
    // ... all sport-specific tests across all athletes
  ],
  "message": "Test results for all SWIMMING athletes"
}
```

#### GET /official/athletes/:athleteId/tests

Get specific athlete's test history.

**Response:**
```json
{
  "success": true,
  "athlete": {
    "id": "clx123...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "age": 24,
    "gender": "MALE",
    "sport": "SWIMMING"
  },
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
  },
  "message": "Test history for John Doe"
}
```

**Error Responses:**
- `403` - Access denied: Athlete is not in your sport
- `404` - Athlete not found

### Leaderboard

#### GET /official/leaderboard

Get leaderboard for the official's sport (same as athlete leaderboard).

**Response:**
```json
{
  "success": true,
  "sport": "SWIMMING",
  "leaderboard": [
    {
      "category": "standardized",
      "entries": [
        // ... same structure as athlete leaderboard
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

### AI Feedback

#### GET /official/athletes/:athleteId/feedback

Generate AI feedback report for a specific athlete.

**Response:**
```json
{
  "success": true,
  "report": {
    "athleteId": "clx123...",
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
  "message": "AI feedback report generated for John Doe"
}
```

**Error Responses:**
- `403` - Access denied: Athlete is not in your sport
- `404` - Athlete not found

#### GET /official/athletes/feedback

Generate AI feedback reports for all athletes in the official's sport.

**Response:**
```json
{
  "success": true,
  "reports": [
    {
      "athleteId": "clx123...",
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
    {
      "athleteId": "clx124...",
      "athleteName": "Jane Smith",
      "sport": "SWIMMING",
      "reportDate": "2024-01-15T10:30:00Z",
      "overallScore": 82,
      // ... other athlete's report
    }
    // ... more reports
  ],
  "totalAthletes": 15,
  "processedAthletes": 10,
  "message": "AI feedback reports generated for 10 athletes in SWIMMING"
}
```

---

## Error Responses

All endpoints return consistent error responses:

### Validation Error (400)
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["email"],
      "message": "Email is required"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "message": "Unauthorized: Invalid or missing token"
}
```

### Access Denied Error (403)
```json
{
  "message": "Access denied: Athlete is not in your sport"
}
```

### Not Found Error (404)
```json
{
  "message": "Athlete not found"
}
```

### Conflict Error (409)
```json
{
  "message": "Email already exists"
}
```

### Server Error (500)
```json
{
  "message": "Failed to generate AI feedback report",
  "error": "Detailed error information"
}
```

---

## Data Models

### Sport Enum
```typescript
enum Sport {
  ARCHERY = "ARCHERY",
  ATHLETICS = "ATHLETICS",
  BOXING = "BOXING",
  CYCLING = "CYCLING",
  FENCING = "FENCING",
  HOCKEY = "HOCKEY",
  JUDO = "JUDO",
  ROWING = "ROWING",
  SWIMMING = "SWIMMING",
  SHOOTING = "SHOOTING",
  TABLE_TENNIS = "TABLE_TENNIS",
  WEIGHTLIFTING = "WEIGHTLIFTING",
  WRESTLING = "WRESTLING"
}
```

### Gender Enum
```typescript
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}
```

### Standardized Test Fields
- `height` (number) - Height in cm
- `weight` (number) - Weight in kg
- `sitAndReach` (JSON) - Sit and reach test results
- `standingVerticalJump` (JSON) - Standing vertical jump results
- `standingBroadJump` (JSON) - Standing broad jump results
- `medicineBallThrow` (JSON) - Medicine ball throw results
- `sprint30m` (JSON) - 30m sprint test results
- `shuttleRun4x10m` (JSON) - 4x10m shuttle run results
- `situps` (JSON) - Sit-ups test results
- `run800m` (JSON) - 800m run results (for athletes under 12)
- `run1600m` (JSON) - 1600m run results (for athletes 12 and older)

### Psychological Assessment Fields
- `mentalToughness` (JSON) - Mental toughness assessment
- `competitiveAnxiety` (JSON) - Competitive state anxiety
- `teamCohesion` (JSON) - Team cohesion assessment
- `mentalHealth` (JSON) - Mental health screening
- `personalityTraits` (JSON) - Personality trait questionnaires
- `motivationGoals` (JSON) - Motivation and goal orientation
- `stressCoping` (JSON) - Stress and coping style inventories
- `healthScreening` (JSON) - Health screening results
- `imageryAbility` (JSON) - Imagery and visualization ability
- `reactionTime` (JSON) - Reaction time test results
- `determination` (JSON) - Determination test results
- `timeAnticipation` (JSON) - Time and movement anticipation
- `peripheralVision` (JSON) - Peripheral perception test
- `attentionAlertness` (JSON) - Attention and alertness tests
- `sensorimotorTasks` (JSON) - Sensorimotor coordination tasks
- `balanceTests` (JSON) - Balance tests (static & dynamic)
- `psychomotorTasks` (JSON) - Psychomotor and perceptual-motor tasks
- `cognitiveTasks` (JSON) - Computer/phone-based cognitive tasks
- `performanceConsistency` (JSON) - Performance consistency measures

### Sport-Specific Test Structure
Each sport has its own test model with a `testResults` JSON field containing sport-specific metrics. Examples:

**Swimming:**
- `strokeRate`, `strokeLength`, `swimTime`, `efficiency`, `technique`, `endurance`, `power`, `flexibility`

**Archery:**
- `accuracy`, `consistency`, `focus`, `stability`, `technique`, `endurance`

**Boxing:**
- `punchPower`, `speed`, `endurance`, `technique`, `reactionTime`, `agility`

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **Test storage endpoints**: 10 requests per minute per user
- **Data retrieval endpoints**: 30 requests per minute per user
- **AI feedback endpoints**: 3 requests per minute per user

---

## Environment Variables

Required environment variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secret-key
NODE_ENV=development|production
PORT=4000
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://your-frontend-domain.com
```

---

## Support

For API support and questions, please contact the development team or create an issue in the repository.
# 🗄️ Database Schema

Complete database structure and relationships for the Pulse Backend.

## Overview

The database uses PostgreSQL with Prisma ORM and follows a relational design with the following entities:

- **Athlete** - Individual athletes who perform tests
- **Official** - Coaches and officials who view results
- **Session** - Testing sessions for athletes
- **TestResult** - Individual test results within sessions

## Entity Relationships

```
Athlete (1) ──→ (Many) Session (1) ──→ (Many) TestResult
Official (Independent - no direct relationships)
```

## Detailed Schema

### Athlete

Represents individual athletes who perform performance tests.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary Key, CUID |
| `name` | String | Athlete's full name | Required |
| `email` | String | Unique email address | Required, Unique |
| `age` | Integer | Athlete's age | Optional |
| `passwordHash` | String | Hashed password | Required |
| `createdAt` | DateTime | Account creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Relationships:**
- Has many `Session` records

**Example:**
```json
{
  "id": "clr1234567890",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 25,
  "passwordHash": "$2b$10$...",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Official

Represents coaches, officials, and administrators who can view athlete results.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary Key, CUID |
| `name` | String | Official's full name | Required |
| `email` | String | Unique email address | Required, Unique |
| `passwordHash` | String | Hashed password | Required |
| `role` | String | Role designation | Default: "official" |
| `createdAt` | DateTime | Account creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Relationships:**
- No direct relationships (independent entity)

**Example:**
```json
{
  "id": "clr0987654321",
  "name": "Coach Smith",
  "email": "coach.smith@example.com",
  "passwordHash": "$2b$10$...",
  "role": "official",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Session

Represents a testing session for an athlete. Each session can contain multiple test results.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary Key, CUID |
| `athleteId` | String | Reference to Athlete | Foreign Key |
| `createdAt` | DateTime | Session creation timestamp | Auto-generated |

**Relationships:**
- Belongs to one `Athlete`
- Has many `TestResult` records

**Example:**
```json
{
  "id": "clr2222222222",
  "athleteId": "clr1234567890",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### TestResult

Represents individual test results within a session. Contains the actual performance metrics.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary Key, CUID |
| `sessionId` | String | Reference to Session | Foreign Key |
| `testType` | String | Type of test performed | Required |
| `metrics` | JSON | Test result data | Required |
| `createdAt` | DateTime | Result creation timestamp | Auto-generated |

**Relationships:**
- Belongs to one `Session`

**Example:**
```json
{
  "id": "clr1111111111",
  "sessionId": "clr2222222222",
  "testType": "vertical_jump",
  "metrics": {
    "height": 45.2,
    "confidence": 0.95,
    "timestamp": "2024-01-15T10:30:00Z",
    "attempts": 3,
    "bestAttempt": 1
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Test Types and Metrics

The `testType` field supports various performance tests:

### Height Test
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

### Weight Test
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

### Shuttle Run Test
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

### Endurance Run Test
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

### Vertical Jump Test
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

### Sit-ups Test
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

## Database Indexes

### Primary Indexes
- `Athlete.id` (Primary Key)
- `Official.id` (Primary Key)
- `Session.id` (Primary Key)
- `TestResult.id` (Primary Key)

### Unique Indexes
- `Athlete.email` (Unique)
- `Official.email` (Unique)

### Foreign Key Indexes
- `Session.athleteId` (Foreign Key to Athlete.id)
- `TestResult.sessionId` (Foreign Key to Session.id)

## Data Flow

1. **Athlete Registration**: Creates new `Athlete` record
2. **Official Registration**: Creates new `Official` record
3. **Test Performance**: 
   - Creates new `Session` record (if needed)
   - Creates new `TestResult` record with metrics
4. **Data Retrieval**:
   - Athletes can view their own results
   - Officials can view all results with athlete information

## Security Considerations

- **Password Hashing**: All passwords are hashed using bcrypt
- **Data Isolation**: Athletes can only see their own results
- **Official Access**: Officials can see all results but not password hashes
- **Input Validation**: All data is validated using Zod schemas

## Migration History

### Initial Migration (20250912123432_init)
- Created all base tables
- Set up relationships and constraints
- Added unique indexes

### Testing Migration (20250913154840_testing)
- Removed invalid many-to-many relationship
- Cleaned up schema for proper one-to-many relationships

## Prisma Schema Definition

```prisma
model Athlete {
  id            String       @id @default(cuid())
  name          String
  email         String       @unique
  age           Int?
  passwordHash  String
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  sessions      Session[]
}

model Official {
  id            String       @id @default(cuid())
  name          String
  email         String       @unique
  passwordHash  String
  role          String       @default("official") 
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Session {
  id         String       @id @default(cuid())
  athleteId  String
  athlete    Athlete      @relation(fields: [athleteId], references: [id])
  createdAt  DateTime     @default(now())

  results    TestResult[]
}

model TestResult {
  id         String   @id @default(cuid())
  sessionId  String
  session    Session  @relation(fields: [sessionId], references: [id])

  testType   String   
  metrics    Json    

  createdAt  DateTime @default(now())
}
```

## Query Examples

### Get Athlete with All Results
```typescript
const athleteWithResults = await prisma.athlete.findUnique({
  where: { id: athleteId },
  include: {
    sessions: {
      include: {
        results: true
      }
    }
  }
});
```

### Get All Results with Athlete Info
```typescript
const allResults = await prisma.testResult.findMany({
  include: {
    session: {
      include: {
        athlete: {
          select: {
            id: true,
            name: true,
            email: true,
            age: true
            // passwordHash excluded for security
          }
        }
      }
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

### Get Results by Test Type
```typescript
const verticalJumpResults = await prisma.testResult.findMany({
  where: { testType: 'vertical_jump' },
  include: {
    session: {
      include: {
        athlete: true
      }
    }
  }
});
```
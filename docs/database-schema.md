# Database Schema

Complete database structure and relationships for the Pulse Backend.

## Overview

The database uses PostgreSQL with Prisma ORM and follows a comprehensive relational design with the following entities:

- **Athlete** - Individual athletes who perform tests
- **Official** - Coaches and officials who view results
- **StandardizedTest** - Standardized physical fitness tests
- **PsychologicalAssessment** - Psychological and cognitive assessments
- **Sport-Specific Test Models** - 13 different sport-specific test models
- **Enums** - Gender and Sport enums for data consistency

## Entity Relationships

```
Athlete (1) ──→ (Many) StandardizedTest
Athlete (1) ──→ (Many) PsychologicalAssessment
Athlete (1) ──→ (Many) SportSpecificTest (13 different models)
Official (Independent - sport-based access control)
```

## Enums

### Gender
```prisma
enum Gender {
  MALE
  FEMALE
  OTHER
}
```

### Sport
```prisma
enum Sport {
  ARCHERY
  ATHLETICS
  BOXING
  CYCLING
  FENCING
  HOCKEY
  JUDO
  ROWING
  SWIMMING
  SHOOTING
  TABLE_TENNIS
  WEIGHTLIFTING
  WRESTLING
}
```

## Detailed Schema

### Athlete

Represents individual athletes who perform performance tests.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary Key, CUID |
| `firstName` | String | Athlete's first name | Required |
| `lastName` | String | Athlete's last name | Required |
| `email` | String | Unique email address | Required, Unique |
| `phone` | String | Unique phone number | Required, Unique |
| `dateOfBirth` | DateTime | Date of birth | Required |
| `age` | Integer | Calculated age | Required |
| `gender` | Gender | Athlete's gender | Required |
| `sport` | Sport | Primary sport | Required |
| `passwordHash` | String | Hashed password | Required |
| `createdAt` | DateTime | Account creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Relationships:**
- Has many `StandardizedTest` records
- Has many `PsychologicalAssessment` records
- Has many sport-specific test records

**Example:**
```json
{
  "id": "clr1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "2000-01-15T00:00:00Z",
  "age": 24,
  "gender": "MALE",
  "sport": "SWIMMING",
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
| `firstName` | String | Official's first name | Required |
| `lastName` | String | Official's last name | Required |
| `email` | String | Unique email address | Required, Unique |
| `phone` | String | Unique phone number | Required, Unique |
| `gender` | Gender | Official's gender | Required |
| `sport` | Sport | Sport they oversee | Required |
| `passwordHash` | String | Hashed password | Required |
| `createdAt` | DateTime | Account creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Relationships:**
- No direct relationships (sport-based access control)

**Example:**
```json
{
  "id": "clr0987654321",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567891",
  "gender": "FEMALE",
  "sport": "SWIMMING",
  "passwordHash": "$2b$10$...",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### StandardizedTest

Represents standardized physical fitness tests performed by athletes.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary Key, CUID |
| `athleteId` | String | Reference to Athlete | Foreign Key |
| `testDate` | DateTime | Date test was performed | Required |
| `height` | Float | Height in cm | Required |
| `weight` | Float | Weight in kg | Required |
| `sitAndReach` | Json | Sit and reach test results | Required |
| `standingVerticalJump` | Json | Standing vertical jump results | Required |
| `standingBroadJump` | Json | Standing broad jump results | Required |
| `medicineBallThrow` | Json | Medicine ball throw results | Required |
| `sprint30m` | Json | 30m sprint test results | Required |
| `shuttleRun4x10m` | Json | 4x10m shuttle run results | Required |
| `situps` | Json | Sit-ups test results | Required |
| `run800m` | Json | 800m run results (under 12) | Optional |
| `run1600m` | Json | 1600m run results (12+) | Optional |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |

**Relationships:**
- Belongs to one `Athlete`

**Example:**
```json
{
  "id": "clr2222222222",
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
}
```

### PsychologicalAssessment

Represents psychological and cognitive assessments performed by athletes.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary Key, CUID |
| `athleteId` | String | Reference to Athlete | Foreign Key |
| `assessmentDate` | DateTime | Date assessment was performed | Required |
| `mentalToughness` | Json | Mental toughness assessment | Required |
| `competitiveAnxiety` | Json | Competitive state anxiety | Required |
| `teamCohesion` | Json | Team cohesion assessment | Required |
| `mentalHealth` | Json | Mental health screening | Required |
| `personalityTraits` | Json | Personality trait questionnaires | Required |
| `motivationGoals` | Json | Motivation and goal orientation | Required |
| `stressCoping` | Json | Stress and coping style inventories | Required |
| `healthScreening` | Json | Health screening results | Required |
| `imageryAbility` | Json | Imagery and visualization ability | Required |
| `reactionTime` | Json | Reaction time test results | Required |
| `determination` | Json | Determination test results | Required |
| `timeAnticipation` | Json | Time and movement anticipation | Required |
| `peripheralVision` | Json | Peripheral perception test | Required |
| `attentionAlertness` | Json | Attention and alertness tests | Required |
| `sensorimotorTasks` | Json | Sensorimotor coordination tasks | Required |
| `balanceTests` | Json | Balance tests (static & dynamic) | Required |
| `psychomotorTasks` | Json | Psychomotor and perceptual-motor tasks | Required |
| `cognitiveTasks` | Json | Computer/phone-based cognitive tasks | Required |
| `performanceConsistency` | Json | Performance consistency measures | Required |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |

**Relationships:**
- Belongs to one `Athlete`

**Example:**
```json
{
  "id": "clr3333333333",
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
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Sport-Specific Test Models

Each sport has its own dedicated test model with the following structure:

### Common Structure
All sport-specific test models follow this pattern:

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary Key, CUID |
| `athleteId` | String | Reference to Athlete | Foreign Key |
| `testDate` | DateTime | Date test was performed | Required |
| `testResults` | Json | Sport-specific test results | Required |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |

### Supported Sports and Models

1. **ArcheryTest** - Precision and focus-based tests
2. **AthleticsTest** - Track and field performance tests
3. **BoxingTest** - Combat sport specific assessments
4. **CyclingTest** - Endurance and power tests
5. **FencingTest** - Reaction time and precision tests
6. **HockeyTest** - Team sport and coordination tests
7. **JudoTest** - Martial arts and strength tests
8. **RowingTest** - Endurance and power tests
9. **SwimmingTest** - Aquatic performance tests
10. **ShootingTest** - Precision and stability tests
11. **TableTennisTest** - Reaction time and coordination tests
12. **WeightliftingTest** - Strength and power tests
13. **WrestlingTest** - Combat sport and strength tests

### Example: SwimmingTest
```json
{
  "id": "clr4444444444",
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
}
```

## Database Indexes

### Primary Indexes
- `Athlete.id` (Primary Key)
- `Official.id` (Primary Key)
- `StandardizedTest.id` (Primary Key)
- `PsychologicalAssessment.id` (Primary Key)
- All sport-specific test model IDs (Primary Keys)

### Unique Indexes
- `Athlete.email` (Unique)
- `Athlete.phone` (Unique)
- `Official.email` (Unique)
- `Official.phone` (Unique)

### Foreign Key Indexes
- `StandardizedTest.athleteId` (Foreign Key to Athlete.id)
- `PsychologicalAssessment.athleteId` (Foreign Key to Athlete.id)
- All sport-specific test model `athleteId` fields (Foreign Keys to Athlete.id)

### Performance Indexes
- `StandardizedTest.testDate` (for chronological queries)
- `PsychologicalAssessment.assessmentDate` (for chronological queries)
- All sport-specific test model `testDate` fields (for chronological queries)

## Data Flow

1. **Athlete Registration**: Creates new `Athlete` record with sport assignment
2. **Official Registration**: Creates new `Official` record with sport assignment
3. **Test Performance**: 
   - Creates new `StandardizedTest` record
   - Creates new `PsychologicalAssessment` record
   - Creates new sport-specific test record
4. **Data Retrieval**:
   - Athletes can view their own results across all test types
   - Officials can view results for athletes in their sport only
   - Leaderboards are calculated across all test categories
   - AI feedback is generated based on all test data

## Security Considerations

- **Password Hashing**: All passwords are hashed using bcrypt
- **Data Isolation**: Athletes can only see their own results
- **Sport-Based Access Control**: Officials can only see results for athletes in their sport
- **Input Validation**: All data is validated using Zod schemas
- **Unique Constraints**: Email and phone numbers are unique across all users
- **Immutable Records**: Test records are never updated, only new records are created

## Migration History

### Initial Migration (20250912123432_init)
- Created all base tables
- Set up relationships and constraints
- Added unique indexes

### Testing Migration (20250913154840_testing)
- Removed invalid many-to-many relationship
- Cleaned up schema for proper one-to-many relationships

### Current Schema Updates
- Added comprehensive athlete and official models
- Implemented standardized test model with all required fields
- Added psychological assessment model with 18 test fields
- Created 13 sport-specific test models
- Added Gender and Sport enums
- Implemented proper indexing and constraints

## Prisma Schema Definition

```prisma
enum Gender {
  MALE
  FEMALE
  OTHER
}

enum Sport {
  ARCHERY
  ATHLETICS
  BOXING
  CYCLING
  FENCING
  HOCKEY
  JUDO
  ROWING
  SWIMMING
  SHOOTING
  TABLE_TENNIS
  WEIGHTLIFTING
  WRESTLING
}

model Athlete {
  id            String       @id @default(cuid())
  firstName     String
  lastName      String
  email         String       @unique
  phone         String       @unique
  dateOfBirth   DateTime
  age           Int          
  gender        Gender       
  sport         Sport        
  passwordHash  String
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  standardizedTests          StandardizedTest[]
  psychologicalAssessments   PsychologicalAssessment[]
  archeryTests              ArcheryTest[]
  athleticsTests            AthleticsTest[]
  boxingTests               BoxingTest[]
  cyclingTests              CyclingTest[]
  fencingTests              FencingTest[]
  hockeyTests               HockeyTest[]
  judoTests                 JudoTest[]
  rowingTests               RowingTest[]
  swimmingTests             SwimmingTest[]
  shootingTests             ShootingTest[]
  tableTennisTests          TableTennisTest[]
  weightliftingTests        WeightliftingTest[]
  wrestlingTests            WrestlingTest[]

  @@map("athletes")
}

model Official {
  id            String       @id @default(cuid())
  firstName     String
  lastName      String
  email         String       @unique
  phone         String       @unique
  gender        Gender 
  sport         Sport        
  passwordHash  String
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@map("officials")
}

model StandardizedTest {
  id                    String   @id @default(cuid())
  athleteId             String
  testDate              DateTime
  height                Float
  weight                Float
  sitAndReach           Json
  standingVerticalJump  Json
  standingBroadJump     Json
  medicineBallThrow     Json
  sprint30m             Json
  shuttleRun4x10m       Json
  situps                Json
  run800m               Json?
  run1600m              Json?
  createdAt             DateTime @default(now())

  athlete               Athlete  @relation(fields: [athleteId], references: [id], onDelete: Cascade)

  @@index([athleteId])
  @@map("standardized_tests")
}

model PsychologicalAssessment {
  id                    String   @id @default(cuid())
  athleteId             String
  assessmentDate        DateTime
  mentalToughness       Json
  competitiveAnxiety    Json
  teamCohesion          Json
  mentalHealth          Json
  personalityTraits     Json
  motivationGoals       Json
  stressCoping          Json
  healthScreening       Json
  imageryAbility        Json
  reactionTime          Json
  determination         Json
  timeAnticipation      Json
  peripheralVision      Json
  attentionAlertness    Json
  sensorimotorTasks     Json
  balanceTests          Json
  psychomotorTasks      Json
  cognitiveTasks        Json
  performanceConsistency Json
  createdAt             DateTime @default(now())

  athlete               Athlete  @relation(fields: [athleteId], references: [id], onDelete: Cascade)

  @@index([athleteId])
  @@map("psychological_assessments")
}

// Sport-specific test models follow the same pattern
model SwimmingTest {
  id          String   @id @default(cuid())
  athleteId   String
  testDate    DateTime
  testResults Json
  createdAt   DateTime @default(now())

  athlete     Athlete  @relation(fields: [athleteId], references: [id], onDelete: Cascade)

  @@index([athleteId])
  @@map("swimming_tests")
}

// ... similar models for all other sports
```

## Query Examples

### Get Athlete with All Test Results
```typescript
const athleteWithResults = await prisma.athlete.findUnique({
  where: { id: athleteId },
  include: {
    standardizedTests: {
      orderBy: { testDate: 'desc' }
    },
    psychologicalAssessments: {
      orderBy: { assessmentDate: 'desc' }
    },
    swimmingTests: {
      orderBy: { testDate: 'desc' }
    }
  }
});
```

### Get All Athletes in a Sport
```typescript
const athletesInSport = await prisma.athlete.findMany({
  where: { sport: 'SWIMMING' },
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    sport: true
  }
});
```

### Get Latest Test Results for Athlete
```typescript
const latestResults = await Promise.all([
  prisma.standardizedTest.findFirst({
    where: { athleteId },
    orderBy: { testDate: 'desc' }
  }),
  prisma.psychologicalAssessment.findFirst({
    where: { athleteId },
    orderBy: { assessmentDate: 'desc' }
  }),
  prisma.swimmingTest.findFirst({
    where: { athleteId },
    orderBy: { testDate: 'desc' }
  })
]);
```

### Get Test History with Pagination
```typescript
const testHistory = await prisma.standardizedTest.findMany({
  where: { athleteId },
  orderBy: { testDate: 'desc' },
  take: 10,
  skip: (page - 1) * 10
});
```

## Performance Considerations

- **Indexing**: All foreign keys and frequently queried fields are indexed
- **Pagination**: Large result sets are paginated to prevent memory issues
- **Selective Queries**: Only necessary fields are selected to reduce data transfer
- **Chronological Ordering**: Test results are ordered by date for easy trend analysis
- **Sport Filtering**: Officials only query athletes in their sport for better performance
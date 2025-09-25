# Pulse Backend

A comprehensive Node.js backend for the Pulse: AI-Powered Hybrid Platform for Sports Talent Assessment. This backend provides APIs for both the Flutter mobile app and web dashboard, handling authentication, data storage, AI-generated feedback, and comprehensive athlete performance tracking.

## Quick Links

- **[Getting Started](docs/getting-started.md)** - Installation and setup guide
- **[API Documentation](docs/api-documentation.md)** - Complete API reference
- **[Testing Guide](docs/testing-guide.md)** - cURL and Postman testing instructions
- **[Frontend Integration](docs/frontend-integration.md)** - Flutter and React integration examples
- **[Database Schema](docs/database-schema.md)** - Database structure and relationships
- **[Deployment Guide](docs/deployment.md)** - Railway and production deployment
- **[Environment Variables](docs/environment-variables.md)** - Configuration reference

## Features

### Authentication System
- **JWT-based authentication** for athletes and officials
- **Role-based access control** with separate athlete and official endpoints
- **Secure password hashing** with bcrypt
- **Session management** with configurable token expiration

### Comprehensive Data Management
- **Athlete Management**: Registration, profile management, sport assignment
- **Official Management**: Registration, sport-specific access control
- **Test Results Storage**: Standardized tests, psychological assessments, sport-specific tests
- **Historical Data**: Complete test history and performance tracking

### Performance Assessment
- **Standardized Tests**: Height, weight, sit & reach, vertical jump, broad jump, medicine ball throw, sprint tests, shuttle run, situps, running tests
- **Psychological Assessments**: 18 comprehensive psychological and cognitive tests
- **Sport-Specific Tests**: Dynamic test models for 13 different sports (Archery, Athletics, Boxing, Cycling, Fencing, Hockey, Judo, Rowing, Swimming, Shooting, Table Tennis, Weightlifting, Wrestling)
- **AI-Powered Analysis**: OpenAI GPT-4o-mini integration for performance feedback

### Analytics & Reporting
- **Leaderboards**: Sport-specific rankings across all test categories
- **AI Feedback Reports**: Comprehensive coach-perspective analysis
- **Performance Trends**: Historical performance tracking and analysis
- **Multi-category Scoring**: Standardized, psychological, and sport-specific scoring

### Security & Performance
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: HTTP security headers
- **Input Validation**: Zod schema validation for all endpoints
- **Error Handling**: Comprehensive error handling and logging
- **Health Monitoring**: Health check endpoint for deployment monitoring

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Flutter App   │    │   Web Dashboard │    │   Pulse Backend │
│   (Athletes)    │    │   (Officials)   │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ POST /athlete/*      │ GET /official/*       │
          │ GET /athlete/tests   │ GET /official/athletes│
          │ POST /athlete/feedback│ GET /official/leaderboard│
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴───────────┐
                    │                         │
            ┌───────▼───────┐    ┌───────────▼──────────┐
            │   PostgreSQL  │    │     OpenAI API       │
            │   (Prisma)    │    │   (GenAI Feedback)   │
            └───────────────┘    └──────────────────────┘
```

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js with JWT
- **AI Integration**: OpenAI GPT-4o-mini
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Monorepo**: Turborepo with pnpm
- **Package Manager**: pnpm

## Project Structure

```
pulse-backend/
├── apps/
│   └── backend/                    # Main backend application
│       ├── src/
│       │   ├── routes/
│       │   │   ├── athlete.ts      # Athlete-specific endpoints
│       │   │   └── official.ts     # Official-specific endpoints
│       │   ├── services/
│       │   │   ├── leaderboard.ts  # Leaderboard calculation service
│       │   │   └── aiFeedback.ts   # AI feedback generation service
│       │   ├── types/
│       │   │   └── index.ts        # Shared TypeScript types
│       │   └── server.ts           # Main server file
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── auth/                       # Authentication package
│   │   ├── src/
│   │   │   ├── config.ts           # Environment configuration
│   │   │   ├── middleware.ts       # Auth middleware
│   │   │   └── passport.ts         # Passport strategies
│   │   └── package.json
│   ├── db/                         # Database package
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema
│   │   │   └── migrations/         # Database migrations
│   │   ├── src/
│   │   │   └── client.ts           # Prisma client
│   │   └── package.json
│   ├── eslint-config/              # Shared ESLint configuration
│   └── typescript-config/          # Shared TypeScript configuration
├── docs/                           # Documentation
├── package.json                    # Root package.json
├── pnpm-workspace.yaml            # pnpm workspace configuration
├── turbo.json                     # Turborepo configuration
└── railway.json                   # Railway deployment configuration
```

## Quick Start

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values (see docs/environment-variables.md)
   ```

3. **Set up the database**
   ```bash
   cd packages/db
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

The server will start at `http://localhost:4000`

## API Endpoints

### Athlete Endpoints (`/athlete`)
- `POST /signup` - Athlete registration
- `POST /signin` - Athlete authentication
- `POST /tests/standardized` - Submit standardized test results
- `POST /tests/psychological` - Submit psychological assessment
- `POST /tests/sport-specific` - Submit sport-specific test results
- `GET /tests/history` - Get personal test history
- `GET /leaderboard` - Get sport-specific leaderboard
- `GET /feedback` - Get AI-generated feedback report

### Official Endpoints (`/official`)
- `POST /signup` - Official registration
- `POST /signin` - Official authentication
- `GET /athletes` - Get all athletes in official's sport
- `GET /athletes/:id/tests` - Get specific athlete's test history
- `GET /leaderboard` - Get sport-specific leaderboard
- `GET /athletes/:id/feedback` - Get AI feedback for specific athlete
- `GET /athletes/feedback` - Get AI feedback for all athletes

## Supported Sports

The system supports 13 different sports with sport-specific test models:

1. **Archery** - Precision and focus-based tests
2. **Athletics** - Track and field performance tests
3. **Boxing** - Combat sport specific assessments
4. **Cycling** - Endurance and power tests
5. **Fencing** - Reaction time and precision tests
6. **Hockey** - Team sport and coordination tests
7. **Judo** - Martial arts and strength tests
8. **Rowing** - Endurance and power tests
9. **Swimming** - Aquatic performance tests
10. **Shooting** - Precision and stability tests
11. **Table Tennis** - Reaction time and coordination tests
12. **Weightlifting** - Strength and power tests
13. **Wrestling** - Combat sport and strength tests

## Production Backend

The backend is deployed and available at: **https://backend-production-e915.up.railway.app**

## Documentation

For detailed information, see the [docs](docs/) folder:

- **[Getting Started](docs/getting-started.md)** - Complete setup guide
- **[API Documentation](docs/api-documentation.md)** - All endpoints with examples
- **[Testing Guide](docs/testing-guide.md)** - How to test all endpoints
- **[Frontend Integration](docs/frontend-integration.md)** - Flutter & React examples
- **[Database Schema](docs/database-schema.md)** - Database structure
- **[Deployment Guide](docs/deployment.md)** - Production deployment
- **[Environment Variables](docs/environment-variables.md)** - Configuration reference
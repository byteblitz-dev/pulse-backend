# 🏃‍♂️ Pulse Backend

A robust Node.js backend for the Pulse athlete performance assessment system. This backend provides APIs for both the Flutter mobile app and web dashboard, handling authentication, data storage, and AI-generated feedback.

## 📋 Quick Links

- **[Getting Started](docs/getting-started.md)** - Installation and setup guide
- **[API Documentation](docs/api-documentation.md)** - Complete API reference
- **[Testing Guide](docs/testing-guide.md)** - cURL and Postman testing instructions
- **[Frontend Integration](docs/frontend-integration.md)** - Flutter and React integration examples
- **[Database Schema](docs/database-schema.md)** - Database structure and relationships
- **[Deployment Guide](docs/deployment.md)** - Railway and production deployment
- **[Environment Variables](docs/environment-variables.md)** - Configuration reference

## ✨ Features

- **🔐 Authentication System**: JWT-based auth for athletes and officials
- **📊 Data Management**: Store and retrieve athlete performance metrics
- **🤖 AI Feedback**: OpenAI-powered performance analysis and feedback
- **🛡️ Security**: CORS, Helmet, input validation, and error handling
- **📱 Mobile Ready**: Optimized for Flutter app integration
- **🖥️ Dashboard Ready**: APIs for web dashboard visualization
- **🏥 Health Monitoring**: Health check endpoint for deployment monitoring

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Flutter App   │    │   Web Dashboard │    │   Pulse Backend │
│   (Athletes)    │    │   (Officials)   │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ POST /data/store     │ GET /data/all        │
          │ POST /feedback       │ GET /data/athlete/:id│
          │                      │ POST /feedback       │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴───────────┐
                    │                         │
            ┌───────▼───────┐    ┌───────────▼──────────┐
            │   PostgreSQL  │    │     OpenAI API       │
            │   (Prisma)    │    │   (GenAI Feedback)   │
            └───────────────┘    └──────────────────────┘
```

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js with JWT
- **AI Integration**: OpenAI GPT-4o-mini
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Monorepo**: Turborepo with pnpm

## 📁 Project Structure

```
apps/backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts          # Authentication endpoints
│   │   ├── data.ts          # Data management endpoints
│   │   └── feedback.ts      # AI feedback endpoints
│   ├── services/
│   │   └── genai.ts         # OpenAI integration
│   ├── types/
│   │   └── index.ts         # Shared TypeScript types
│   └── server.ts            # Main server file
├── package.json
└── tsconfig.json

packages/
├── auth/                    # Authentication package
│   ├── src/
│   │   ├── config.ts        # Environment configuration
│   │   ├── middleware.ts    # Auth middleware
│   │   └── passport.ts      # Passport strategies
│   └── package.json
└── db/                      # Database package
    ├── prisma/
    │   ├── schema.prisma    # Database schema
    │   └── migrations/      # Database migrations
    ├── src/
    │   └── client.ts        # Prisma client
    └── package.json
```

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Set up the database**
   ```bash
   cd packages/db
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

The server will start at `http://localhost:4000`

## 🌐 Production Backend

The backend is deployed and available at: **https://backend-production-e915.up.railway.app**

## 📚 Documentation

For detailed information, see the [docs](docs/) folder:

- **[Getting Started](docs/getting-started.md)** - Complete setup guide
- **[API Documentation](docs/api-documentation.md)** - All endpoints with examples
- **[Testing Guide](docs/testing-guide.md)** - How to test all endpoints
- **[Frontend Integration](docs/frontend-integration.md)** - Flutter & React examples
- **[Database Schema](docs/database-schema.md)** - Database structure
- **[Deployment Guide](docs/deployment.md)** - Production deployment
- **[Environment Variables](docs/environment-variables.md)** - Configuration reference


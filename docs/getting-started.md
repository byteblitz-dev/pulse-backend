# 🚀 Getting Started

This guide will help you set up the Pulse Backend development environment.

## Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- OpenAI API key

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/byteblitz-dev/pulse-web.git
cd pulse-web
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env
```

Required environment variables:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pulse_db"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-here"

# OpenAI API Key
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Environment
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Port
PORT=4000
```

### 4. Set Up the Database

```bash
# Generate Prisma client
cd packages/db
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 5. Build the Project

```bash
# From root directory
pnpm build
```

### 6. Start the Development Server

```bash
# Start all services
pnpm dev

# Or start just the backend
cd apps/backend
pnpm dev
```

The server will start at `http://localhost:4000`

## 🌐 Production Backend

The backend is deployed and available at: **https://backend-production-e915.up.railway.app**

## Verify Installation

Test that everything is working:

```bash
# Health check
curl http://localhost:4000/health

# Expected response:
# {"status":"OK","timestamp":"2024-01-15T10:30:00Z","environment":"development"}
```

## Next Steps

- [API Documentation](api-documentation.md) - Learn about all available endpoints
- [Testing Guide](testing-guide.md) - Test the API with cURL and Postman
- [Frontend Integration](frontend-integration.md) - Integrate with Flutter and React apps
# Environment Variables

Complete reference for all environment variables used in the Pulse Backend.

## Production Backend URL

The backend is deployed and available at: **https://backend-production-e915.up.railway.app**

## Required Variables

### DATABASE_URL
- **Description**: PostgreSQL connection string
- **Required**: Yes
- **Format**: `postgresql://username:password@host:port/database`
- **Example**: `postgresql://user:pass@localhost:5432/pulse_db`
- **Usage**: Used by Prisma to connect to the database

### JWT_SECRET
- **Description**: Secret key for JWT token signing and verification
- **Required**: Yes
- **Format**: String (minimum 32 characters recommended)
- **Example**: `your-super-secret-jwt-key-here-make-it-long-and-random`
- **Usage**: Used by Passport.js for JWT authentication
- **Security**: Keep this secret and use a strong, random string

### OPENAI_API_KEY
- **Description**: OpenAI API key for AI feedback generation
- **Required**: Yes
- **Format**: `sk-...` (OpenAI API key format)
- **Example**: `sk-your-openai-api-key-here`
- **Usage**: Used by the GenAI service to generate performance feedback
- **Security**: Keep this secret and don't commit to version control

## Optional Variables

### NODE_ENV
- **Description**: Environment mode
- **Required**: No
- **Default**: `development`
- **Values**: `development`, `production`, `test`
- **Usage**: Determines CORS origins, error message detail, and other environment-specific behavior

### FRONTEND_URL
- **Description**: Frontend URL for CORS configuration
- **Required**: No
- **Default**: `http://localhost:3000`
- **Example**: `https://your-frontend-domain.com`
- **Usage**: Used by CORS middleware to allow requests from the frontend

### PORT
- **Description**: Server port number
- **Required**: No
- **Default**: `4000`
- **Example**: `3000`, `8000`, `4000`
- **Usage**: Port where the Express server will listen

## Environment File Setup

### Development (.env)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pulse_db"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"

# OpenAI API Key
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Environment
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Port
PORT=4000
```

### Production (.env)
```bash
# Database (Railway will provide this)
DATABASE_URL="postgresql://user:pass@host:port/db"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-production-super-secret-jwt-key-here"

# OpenAI API Key
OPENAI_API_KEY="sk-your-production-openai-api-key"

# Environment
NODE_ENV="production"

# Frontend URL (your production domain)
FRONTEND_URL="https://your-frontend-domain.com"

# Port (Railway sets this automatically)
PORT=4000
```

## Environment Variable Loading

The application loads environment variables from the project root `.env` file:

```typescript
// apps/backend/src/server.ts
import dotenv from "dotenv";
import path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
```

```typescript
// packages/auth/src/config.ts
import dotenv from "dotenv";
import path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
```

## Security Best Practices

### 1. Never Commit Secrets
- Add `.env` to `.gitignore`
- Use `.env.example` for template
- Never commit actual API keys or secrets

### 2. Use Strong Secrets
```bash
# Generate a strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Environment-Specific Values
- Use different values for development and production
- Rotate secrets regularly in production
- Use environment-specific API keys

### 4. Validation
The application validates required environment variables:

```typescript
// apps/backend/src/services/genai.ts
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}
```

## Railway Deployment

### Environment Variables in Railway
1. Go to your Railway project dashboard
2. Navigate to the "Variables" tab
3. Add each environment variable:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | (Auto-provided by Railway PostgreSQL) |
| `JWT_SECRET` | `your-super-secret-jwt-key-here` |
| `OPENAI_API_KEY` | `sk-your-openai-api-key-here` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-frontend-domain.com` |
| `PORT` | `4000` |

### Railway Auto-Environment Variables
Railway automatically provides:
- `DATABASE_URL` (when PostgreSQL service is added)
- `PORT` (automatically set)
- `RAILWAY_ENVIRONMENT` (set to "production")

## Docker Environment

### Docker Compose (.env)
```bash
# Database
DATABASE_URL="postgresql://postgres:password@db:5432/pulse_db"

# JWT Secret
JWT_SECRET="your-docker-jwt-secret-here"

# OpenAI API Key
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Environment
NODE_ENV="production"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Port
PORT=4000
```

### Docker Environment Variables
```dockerfile
# Dockerfile
ENV NODE_ENV=production
ENV PORT=4000
```

## Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
```bash
# Check if .env file exists
ls -la .env

# Check if variables are loaded
node -e "console.log(process.env.JWT_SECRET)"
```

#### 2. Database Connection Issues
```bash
# Test database connection
npx prisma db pull

# Check DATABASE_URL format
echo $DATABASE_URL
```

#### 3. OpenAI API Issues
```bash
# Test OpenAI API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

#### 4. CORS Issues
```bash
# Check FRONTEND_URL
echo $FRONTEND_URL

# Verify CORS configuration in server logs
```

### Environment Variable Validation

Create a validation script to check all required variables:

```typescript
// scripts/validate-env.ts
const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  process.exit(1);
}

console.log('All required environment variables are set');
```

## Example .env Files

### .env.example (Template)
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

### .env.local (Local Development)
```bash
# Local development overrides
DATABASE_URL="postgresql://postgres:password@localhost:5432/pulse_dev"
JWT_SECRET="dev-secret-key-not-for-production"
OPENAI_API_KEY="sk-your-dev-openai-key"
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
PORT=4000
```

### .env.production (Production)
```bash
# Production environment
DATABASE_URL="postgresql://user:pass@prod-host:5432/pulse_prod"
JWT_SECRET="super-secure-production-jwt-secret"
OPENAI_API_KEY="sk-your-production-openai-key"
NODE_ENV="production"
FRONTEND_URL="https://pulse-dashboard.com"
PORT=4000
```
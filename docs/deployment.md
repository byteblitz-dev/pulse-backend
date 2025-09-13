# 🚀 Railway Deployment Guide

Complete guide for deploying the Pulse Backend to Railway.

## Prerequisites

- Railway account
- GitHub repository connected to Railway
- OpenAI API key
- Strong JWT secret

## Step 1: Connect Repository

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect the monorepo structure

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provide the `DATABASE_URL` environment variable

## Step 3: Configure Environment Variables

Set these environment variables in your Railway project:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | (Auto-provided) | PostgreSQL connection string |
| `JWT_SECRET` | `your-super-secret-jwt-key-here` | JWT signing secret |
| `OPENAI_API_KEY` | `sk-your-openai-api-key-here` | OpenAI API key |
| `NODE_ENV` | `production` | Environment mode |
| `FRONTEND_URL` | `https://your-frontend-domain.com` | Frontend URL for CORS |
| `PORT` | `4000` | Server port |

### Setting Environment Variables

1. Go to your Railway project dashboard
2. Click on your backend service
3. Navigate to the "Variables" tab
4. Add each environment variable:

```bash
# Example values (replace with your actual values)
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
PORT=4000
```

## Step 4: Configure Build Settings

Railway will automatically detect the configuration from `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd apps/backend && npm run start",
    "buildCommand": "cd apps/backend && npm run build",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Manual Configuration (if needed)

If Railway doesn't auto-detect your configuration:

1. Go to your service settings
2. Set the following:
   - **Build Command**: `cd apps/backend && npm run build`
   - **Start Command**: `cd apps/backend && npm run start`
   - **Health Check Path**: `/health`

## Step 5: Deploy

1. Railway will automatically build and deploy your application
2. Monitor the deployment logs in the Railway dashboard
3. Your backend will be available at `https://your-app-name.railway.app`

### Monitoring Deployment

```bash
# View deployment logs
railway logs

# Follow logs in real-time
railway logs --follow
```

## Step 6: Run Database Migrations

After deployment, run the database migrations:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migrations
railway run --service backend "cd packages/db && npx prisma migrate deploy"
railway run --service backend "cd packages/db && npx prisma generate"
```

## Step 7: Verify Deployment

### Health Check

Test that your deployment is working:

```bash
# Test health check
curl https://your-app-name.railway.app/health

# Expected response
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "production"
}
```

### Test API Endpoints

```bash
# Test athlete registration
curl -X POST https://your-app-name.railway.app/auth/athlete/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "age": 25
  }'
```

## Railway Features

### Automatic Deployments

Railway automatically deploys when you push to your main branch:

1. Push changes to your repository
2. Railway detects the changes
3. Automatically builds and deploys
4. Updates your live application

### Environment Management

Railway provides different environments:

- **Production**: Live application
- **Preview**: Automatic preview deployments for pull requests
- **Development**: Local development with Railway CLI

### Scaling

Railway automatically handles scaling:

- **CPU**: Automatically scales based on usage
- **Memory**: Allocates resources as needed
- **Networking**: Handles load balancing

## Monitoring and Logs

### View Logs

```bash
# View recent logs
railway logs

# Follow logs in real-time
railway logs --follow

# View logs for specific service
railway logs --service backend
```

### Railway Dashboard

Access comprehensive monitoring through the Railway dashboard:

1. **Metrics**: CPU, memory, and network usage
2. **Logs**: Application and system logs
3. **Deployments**: Deployment history and status
4. **Environment Variables**: Manage configuration
5. **Database**: PostgreSQL management

## Health Checks

Railway automatically monitors your application using the `/health` endpoint:

```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
```

### Health Check Configuration

Railway uses the health check configuration from `railway.json`:

- **Path**: `/health`
- **Timeout**: 100 seconds
- **Restart Policy**: On failure
- **Max Retries**: 10

## Security Features

### Environment Variables

Railway securely stores environment variables:

- **Encryption**: All variables are encrypted at rest
- **Access Control**: Only authorized team members can view/edit
- **Audit Log**: Track changes to environment variables

### HTTPS

Railway automatically provides:

- **SSL/TLS**: Automatic HTTPS for all deployments
- **Custom Domains**: Support for custom domain names
- **Certificate Management**: Automatic SSL certificate renewal

### Network Security

- **Private Networks**: Services can communicate privately
- **Firewall**: Built-in network security
- **DDoS Protection**: Automatic protection against attacks

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Check build logs
railway logs

# Common fixes
# - Ensure all dependencies are in package.json
# - Check for TypeScript errors
# - Verify build commands
```

#### 2. Database Connection Issues

```bash
# Test database connection
railway run --service backend "cd packages/db && npx prisma db pull"

# Check DATABASE_URL
railway variables
```

#### 3. Environment Variable Issues

```bash
# List all variables
railway variables

# Set missing variables
railway variables set JWT_SECRET=your-secret-here
```

#### 4. CORS Issues

```bash
# Check FRONTEND_URL
railway variables get FRONTEND_URL

# Update if needed
railway variables set FRONTEND_URL=https://your-frontend-domain.com
```

### Debugging Commands

```bash
# Connect to running container
railway shell

# Run commands in production environment
railway run --service backend "node --version"

# Check environment variables
railway run --service backend "env | grep DATABASE_URL"
```

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_testresult_createdat ON "TestResult"("createdAt");
CREATE INDEX idx_testresult_testtype ON "TestResult"("testType");
CREATE INDEX idx_session_athleteid ON "Session"("athleteId");
```

### Application Optimization

```typescript
// Enable compression
import compression from 'compression';
app.use(compression());

// Enable caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

## Backup and Recovery

### Database Backup

```bash
# Create backup using Railway CLI
railway run --service backend "pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql"

# Download backup
railway run --service backend "cat backup_file.sql" > local_backup.sql
```

### Environment Variables Backup

```bash
# Export environment variables
railway variables > env_backup_$(date +%Y%m%d_%H%M%S).txt
```

## Maintenance

### Regular Maintenance Tasks

1. **Update Dependencies**
   ```bash
   # Update package.json dependencies
   pnpm update
   
   # Commit and push changes
   git add package.json pnpm-lock.yaml
   git commit -m "Update dependencies"
   git push
   ```

2. **Database Maintenance**
   ```bash
   # Run migrations
   railway run --service backend "cd packages/db && npx prisma migrate deploy"
   ```

3. **Monitor Performance**
   - Check Railway dashboard metrics
   - Review application logs
   - Monitor database performance

## Railway CLI Commands

### Essential Commands

```bash
# Login to Railway
railway login

# Link to project
railway link

# View project status
railway status

# View logs
railway logs

# Set environment variables
railway variables set KEY=value

# Get environment variables
railway variables get KEY

# Run commands in production
railway run --service backend "command"

# Connect to shell
railway shell
```

### Advanced Commands

```bash
# Deploy specific branch
railway up --detach

# View deployment history
railway deployments

# Connect to database
railway connect postgres

# View service metrics
railway metrics
```

## Support and Resources

### Railway Documentation

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Reference](https://docs.railway.app/develop/cli)
- [Environment Variables](https://docs.railway.app/develop/variables)
- [Database Management](https://docs.railway.app/databases/postgresql)

### Community Support

- [Railway Discord](https://discord.gg/railway)
- [Railway GitHub](https://github.com/railwayapp)
- [Railway Status](https://status.railway.app)

---

**Your Pulse Backend is now deployed on Railway! 🚀**
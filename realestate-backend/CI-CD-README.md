# CI/CD Pipeline for Real Estate Backend

This document describes the CI/CD pipeline setup for the Real Estate Backend application.

## 🏗️ Pipeline Overview

The CI/CD pipeline includes:
- **Continuous Integration**: Automated testing, linting, and security scanning
- **Continuous Deployment**: Automated deployment to staging and production environments
- **Containerization**: Docker-based deployment with health checks
- **Security**: Vulnerability scanning and security best practices

## 📋 Prerequisites

1. **GitHub Repository**: Code must be in a GitHub repository
2. **GitHub Secrets**: Configure the following secrets in your repository:
   - `GITHUB_TOKEN` (automatically provided)
   - Environment-specific secrets for staging/production

3. **Docker**: For local development and testing
4. **MongoDB**: For testing and development

## 🚀 Getting Started

### 1. Environment Setup

Copy the environment example file:
```bash
cp env.example .env
```

Configure your environment variables in `.env`:
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/realestate
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Other configurations...
```

### 2. Local Development

Start the development environment:
```bash
# Using Docker Compose
npm run docker:dev

# Or traditional development
npm install
npm run dev
```

### 3. Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### 4. Linting

```bash
# Check for linting issues
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🔄 CI/CD Pipeline Stages

### 1. Test Stage
- **Triggers**: Push to `main`/`develop`, Pull Requests
- **Actions**:
  - Checkout code
  - Setup Node.js environment
  - Install dependencies
  - Run linting
  - Execute tests with MongoDB service
  - Upload coverage reports

### 2. Build Stage
- **Triggers**: Push to `main`/`develop` (after successful tests)
- **Actions**:
  - Build Docker image
  - Push to GitHub Container Registry
  - Tag images appropriately

### 3. Deploy Stages
- **Staging**: Deploys to staging environment on `develop` branch
- **Production**: Deploys to production environment on `main` branch

### 4. Security Stage
- **Actions**:
  - Run Trivy vulnerability scanner
  - Upload results to GitHub Security tab

## 🐳 Docker Configuration

### Development
```bash
docker-compose up --build
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Manual Docker Commands
```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

## 🔒 Security Features

1. **Container Security**:
   - Non-root user in Docker container
   - Health checks for container monitoring
   - Security headers via Nginx

2. **Code Security**:
   - Vulnerability scanning with Trivy
   - Input sanitization middleware
   - Rate limiting
   - CORS configuration

3. **Infrastructure Security**:
   - Environment variable management
   - Secrets management via GitHub Secrets
   - Network isolation with Docker

## 📊 Monitoring and Health Checks

### Health Check Endpoint
- **URL**: `GET /health`
- **Response**: JSON with status, timestamp, and uptime
- **Usage**: Container health checks and monitoring

### Logging
- **Development**: Morgan HTTP request logger
- **Production**: Structured logging with timestamps

## 🚀 Deployment Options

### Option 1: GitHub Actions (Recommended)
- Automated deployment via GitHub Actions
- Environment-specific configurations
- Rollback capabilities

### Option 2: Manual Deployment
```bash
# Run deployment script
./scripts/deploy.sh
```

### Option 3: Cloud Platform Deployment
The pipeline is designed to work with:
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **Kubernetes**

## 🔧 Customization

### Adding New Environments
1. Create new environment in GitHub repository settings
2. Add environment-specific secrets
3. Update workflow file with new deployment job

### Modifying Pipeline
Edit `.github/workflows/ci-cd.yml` to:
- Add new test stages
- Modify deployment targets
- Add additional security checks

### Environment Variables
Configure environment-specific variables in:
- GitHub repository secrets
- Docker Compose files
- Deployment scripts

## 📝 Best Practices

1. **Branch Strategy**:
   - `main`: Production-ready code
   - `develop`: Integration branch
   - Feature branches: Individual features

2. **Testing**:
   - Write comprehensive tests
   - Maintain high test coverage
   - Test in staging before production

3. **Security**:
   - Regular dependency updates
   - Security scanning in CI
   - Secrets management

4. **Monitoring**:
   - Health check endpoints
   - Logging and monitoring
   - Performance metrics

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check environment variables
   - Verify Docker configuration
   - Review test failures

2. **Deployment Issues**:
   - Check GitHub secrets
   - Verify environment configurations
   - Review deployment logs

3. **Health Check Failures**:
   - Check application logs
   - Verify database connectivity
   - Review environment variables

### Getting Help
- Check GitHub Actions logs
- Review application logs
- Verify environment configurations
- Test locally with Docker

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Jest Testing Framework](https://jestjs.io/)
- [Trivy Security Scanner](https://trivy.dev/)

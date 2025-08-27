# Deployment Guide

This project supports two deployment methods:

## 🐳 Docker Deployment (Local/Staging)

**Use this for:**
- Local development with full stack
- Staging environments
- Testing complete application flow

**Requirements:**
- Docker & Docker Compose
- Local MongoDB (containerized)

**Commands:**
```bash
# Option 1: Original script (Docker only)
./deploy.sh

# Option 2: Enhanced script
./deploy-enhanced.sh docker
```

**Services:**
- Frontend: http://localhost:80
- Backend API: http://localhost:80/api
- Direct Backend: http://localhost:5000
- MongoDB: localhost:27017

---

## ☁️ Serverless Deployment (Production)

**Use this for:**
- Production environment
- Cost-effective hosting (~$0.50-1.50/month)
- Auto-scaling serverless architecture

**Requirements:**
- AWS CLI configured
- SAM CLI installed
- MongoDB Atlas (free tier)

**Architecture:**
- Backend: AWS Lambda + API Gateway
- Database: MongoDB Atlas
- Frontend: Ready for S3 static hosting

**Commands:**
```bash
# Deploy serverless backend
./deploy-enhanced.sh serverless
```

**What it does:**
1. ✅ Deploys Lambda functions to AWS
2. ✅ Creates API Gateway endpoints
3. ✅ Builds optimized frontend for production
4. ✅ Returns API Gateway URL

**Manual steps after serverless deployment:**
1. Upload `app/client/dist/*` to S3 bucket
2. Enable S3 static website hosting
3. Configure Route 53 to point to S3/CloudFront

---

## Environment Configuration

The project automatically uses the right environment:

### Local Development (`yarn client:start`)
- Uses `.env.development`
- API points to `/api` (local backend)

### Docker Deployment
- Uses development environment
- API points to `/api` (containerized backend)

### Production Build (`yarn build`)
- Uses `.env.production` 
- API points to serverless Lambda URL

---

## Current Deployment Status

**✅ Serverless Backend:** Deployed and working
- API: `https://cwjxgxiidl.execute-api.us-east-1.amazonaws.com/dev`
- Lambda functions: `todo-auth-dev`, `todo-todos-dev`
- Database: MongoDB Atlas (free tier)

**⏳ Frontend:** Built and ready for S3 deployment
- Location: `app/client/dist/`
- Optimized for production
- Configured to use serverless API

**💡 Next Steps:**
- Set up S3 bucket for static hosting
- Configure CloudFront (optional)
- Point Route 53 domain to S3/CloudFront
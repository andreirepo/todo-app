# Todo Application

A modern, full-stack Todo application with user authentication, responsive design, and Docker containerization. Built for showcasing QA testing frameworks and cloud deployment.

## Features

- **User Authentication** - Secure JWT-based login/register
- **Todo Management** - Create, complete, and delete todos
- **Modern UI** - Responsive design with toast notifications
- **User Isolation** - Each user sees only their own todos

## Tech Stack

**Frontend:** React, Redux Toolkit, CSS Custom Properties  
**Backend:** Node.js, Express, MongoDB, JWT Authentication  
**Infrastructure:** Docker, Traefik, Yarn 4 Workspaces

## Quick Start

### Docker (Recommended)
```bash
git clone https://github.com/andreirepo/todo-app.git
cd todo-app
chmod +x deploy.sh
./deploy.sh
```

**Access:** http://localhost:80

### Local Development
```bash
# Setup Yarn 4
corepack enable && corepack prepare yarn@4.8.1 --activate

# Install and start
yarn install
yarn client:start  # Frontend (port 3000)
yarn server:start  # Backend (port 5000)
```

## API Endpoints

**Auth:**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

**Todos (requires auth):**
- `GET /api/todo` - Get todos
- `POST /api/todo` - Create todo
- `DELETE /api/todo/:id` - Delete todo
- `POST /api/todo/:id/completed` - Complete todo

## Project Structure

```
todo-app/
├── app/
│   ├── client/                 # React Frontend
│   │   ├── src/components/     # UI components
│   │   └── src/common/         # Redux store
│   └── server/                 # Node.js Backend
│       ├── src/models/         # MongoDB models
│       ├── src/routes/         # API routes
│       └── src/middleware/     # Auth middleware
├── docker-compose.yml          # Container orchestration
├── deploy.sh                   # One-command deployment
└── .env                        # Environment variables
```

## Environment Setup

Create `.env` file:
```bash
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_password
NODE_ENV=production
```

## Development Commands

```bash
yarn install              # Install dependencies
./deploy.sh               # Docker deployment
docker-compose down       # Stop services
yarn client:start         # Frontend dev server
yarn server:start         # Backend dev server
```

## Testing & QA

Perfect for testing frameworks:
- **E2E:** User authentication and todo management flows
- **API:** REST endpoints with JWT authentication
- **UI:** Responsive design and form validation
- **Performance:** Database operations and concurrent users

---

**Built with ❤️ by [Andrei](https://github.com/andreirepo)**
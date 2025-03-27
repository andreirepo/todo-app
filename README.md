# Todo Application

A modern, full-stack To-do application built with React, Redux, Node.js, and MongoDB. This project uses a Yarn monorepo structure for efficient code organization and dependency management.

## Features

- Create, read, update, and delete todo items
- Mark todos as completed
- Filter todos by completion status
- Responsive design that works on desktop and mobile devices
- Modern UI with smooth animations and transitions

## Tech Stack

### Frontend
- React for UI components
- Redux with Redux Toolkit for state management
- CSS with modern styling techniques
- FontAwesome for icons

### Backend
- Node.js
- Express.js for API routes
- MongoDB for data persistence
- Docker for containerization

## System Requirements

- `nvm` (Node Version Manager)
- `yarn` (Package Manager)
- Docker and Docker Compose (for containerized deployment)

## Installation Steps

1. Clone the repository to your local machine.
2. Run the command `yarn install` to install dependencies.

## How to Run the Application

### Development Mode

1. Run `nvm use` to use the required node version (run `nvm install` if the required version is not installed)
2. Run `yarn start` to start the application
3. Access the application at `http://localhost:7000`

### Using Docker

1. Make sure Docker and Docker Compose are installed
2. Run `docker-compose up -d` to start the containers
3. Access the application at `http://localhost:7000`

## Project Structure
```
todo-app/
├── app/
│   ├── client/             # Frontend React application
│   │   ├── src/
│   │   │   ├── common/     # Redux store, thunks, selectors
│   │   │   ├── components/ # React components
│   │   │   └── ...
│   │   └── ...
│   └── server/             # Backend Node.js application
│       ├── src/
│       │   ├── controllers/ # API controllers
│       │   ├── models/      # MongoDB models
│       │   ├── routes/      # API routes
│       │   └── ...
│       └── ...
└── ...
```

## Licensing

This project is licensed under the terms of the MIT License.

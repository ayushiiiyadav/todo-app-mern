# To-Do List (MERN)

A full-stack to-do app with user accounts. Each user sees only their own tasks.

## Features
- Register and login with JWT authentication
- Create, read, update and delete tasks
- Task status workflow: pending, in-progress, completed
- Search, filter by status, sort and pagination
- Stats for total, active and done tasks
- Request validation with Zod and centralized error handling

## Tech stack
- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose

## Project structure
```
server/
  controllers/   request handling logic
  middleware/    auth guard, validation, error handler
  models/        Mongoose schemas
  routes/        API routes
  utils/         validation schemas
client/
  src/pages/     Login, Register, Tasks
```

## Run locally
1. Start MongoDB locally, or use a MongoDB Atlas connection string.
2. Backend:
```
   cd server
   npm install
   cp .env.example .env
   node server.js
```
3. Frontend:
```
   cd client
   npm install
   npm run dev
```
4. Open http://localhost:5173

## API
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create an account |
| POST | /api/auth/login | Log in, returns a token |
| GET | /api/tasks | List tasks (page, limit, status, search, sortBy, order) |
| GET | /api/tasks/stats | Total, active and done counts |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update title or status |
| DELETE | /api/tasks/:id | Delete a task |

All task routes need the header `Authorization: Bearer <token>`.
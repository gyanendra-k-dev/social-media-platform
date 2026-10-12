# Social Media Platform

A full-stack social media application where users can create accounts, manage their profiles, share posts, like and comment on posts, follow other users, and interact with the community.

## Run Locally

1. **Backend:** Navigate to the `backend` folder, create a `.env` file using `.env.example`, configure your environment variables, and run `npm install && npm run dev`.
2. **Frontend:** Navigate to the `frontend` folder, create a `.env` file using `.env.example`, configure the API URL, and run `npm install && npm run dev`.
3. Open the frontend at [http://localhost:5173](http://localhost:5173).
4. Check backend health at [http://localhost:5000/api/health](http://localhost:5000/api/health), if the health endpoint is configured.

## Features

- User registration and login
- User profiles
- Create, edit, and delete posts
- Like and comment on posts
- Follow and unfollow users
- Image uploads
- Notifications, if implemented

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Never commit `.env` files or expose secrets on GitHub.

## Technologies

React.js, Vite, Tailwind CSS, Node.js, Express.js, MongoDB, Mongoose, and JWT.

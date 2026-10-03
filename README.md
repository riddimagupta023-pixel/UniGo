# 🎓 UniGo — Campus Made Simple

UniGo is a modern campus management web application designed to make everyday college activities easier for students and administrators.

It provides one platform for accessing campus announcements, events, complaints, lost and found items, and community interactions.

## 🌐 Live Website

**[Visit UniGo](https://uni-go-seven.vercel.app/)**

## 📌 Project Overview

Managing different college activities through separate platforms can be inconvenient for students. UniGo brings these common campus services together in one simple and user-friendly application.

The project was developed as a MERN stack application with separate student and administrator functionality.

## ✨ Features

### 👨‍🎓 Student Features

- Student registration and login
- Secure JWT-based authentication
- Student dashboard
- View college announcements
- View upcoming events
- Submit and track complaints
- Create and view Lost & Found posts
- Create community posts
- Like community posts
- Add comments
- Delete own posts and comments
- Responsive user interface

### 👨‍💼 Admin Features

- Secure admin login
- Admin dashboard
- View registered users
- Manage announcements
- Manage events
- View and manage complaints
- Update complaint status
- Manage Lost & Found posts
- Manage community content

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt.js

### Database
- MongoDB
- Mongoose

### Deployment & Version Control
- GitHub
- Vercel
- Render
- MongoDB Atlas

## 📂 Project Structure

```text
UniGo/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── index.html
│
└── README.md
```

## 🔐 Security

UniGo uses:

- JWT for authentication
- bcrypt.js for password hashing
- Protected routes for authenticated users
- Admin-only access for administrative operations
- Environment variables for sensitive configuration
- Passwords are not returned in API responses

## 🚀 Deployment

The application is deployed using:

**Frontend:** Vercel  
**Backend:** Render  
**Database:** MongoDB Atlas

### Deployment Architecture

```text
User
  │
  ▼
Vercel
React Frontend
  │
  ▼
Render
Node.js + Express Backend
  │
  ▼
MongoDB Atlas
Database
```

## 🔮 Future Enhancements

Some possible future improvements include:

- Push notifications for announcements
- College timetable integration
- Online event registration
- Student-to-student messaging
- Campus map and navigation
- Email notifications
- Mobile application
- More advanced admin analytics
- AI-based campus assistant

## 🎯 Project Goal

The main goal of UniGo is to provide students with a simple, centralized and convenient platform for managing common campus activities.

> **UniGo — Campus Made Simple.**

## 👩‍💻 Project

Developed as a college MERN stack project.

**Live Demo:** https://uni-go-seven.vercel.app/

# EventSphere — MERN Stack Event Management Platform

A full-featured event management web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js).

## Tech Stack

| Layer      | Technology                         |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite + TailwindCSS       |
| Backend    | Node.js + Express.js                |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT (JSON Web Tokens)               |
| Real-time  | Socket.IO                           |
| Storage    | Cloudinary (event images)           |

## Features

- 🔐 Role-based authentication (User / Organizer / Admin)
- 🎟️ Event creation, browsing, and ticket booking
- 📊 Admin dashboard for event approval and user management
- 🗂️ Organizer dashboard for managing your own events
- 🏅 Testimonials page showcasing past completed events
- 🔔 Real-time notifications via Socket.IO
- 📱 Fully responsive dark mode UI with animations (Framer Motion)

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Backend Setup
```bash
cd backend
npm install
# Configure .env with MONGO_URI, JWT_SECRET, CLOUDINARY_* vars
npm run dev        # runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev        # runs on http://localhost:5173
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/        # DB & Cloudinary config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth & error middleware
│   │   ├── models/        # Mongoose models (User, Event, Booking)
│   │   └── routes/        # Express routers
│   └── server.js
└── frontend/
    └── src/
        ├── api/           # Axios API helpers
        ├── components/    # Shared UI components (Navbar, EventCard, …)
        ├── context/       # React Auth context
        ├── pages/         # Route pages (Home, Events, Testimonials, Dashboards)
        └── utils/         # Constants & helpers
```

## API Routes

| Method | Route                        | Access           |
|--------|------------------------------|------------------|
| POST   | /api/auth/register           | Public           |
| POST   | /api/auth/login              | Public           |
| GET    | /api/events                  | Public           |
| POST   | /api/events                  | Organizer/Admin  |
| PUT    | /api/admin/events/:id/status | Admin            |
| GET    | /api/admin/stats             | Admin            |

## License

MIT

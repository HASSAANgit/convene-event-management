require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Connect to database
connectDB();

// ...existing routes and imports...
const http = require('http');
const { Server } = require('socket.io');

const corsOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.CLIENT_URL
].filter(Boolean);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"]
  }
});

// Expose io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Event Management API is running 🚀' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Root route to prevent "Route not found" confusion when visiting backend directly
app.get('/', (req, res) => {
  res.send('<h1>Event Management API is running!</h1><p>This is the backend server. Please visit the frontend React app at <a href="http://localhost:5174">http://localhost:5174</a> to use the website.</p>');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found in API' });
});

// Global error handler
app.use(errorHandler);

// Socket connection
io.on('connection', (socket) => {
  console.log('⚡ A user connected: ', socket.id);
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected: ', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = { app, server, io };

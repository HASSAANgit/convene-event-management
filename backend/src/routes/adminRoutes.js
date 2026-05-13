const express = require('express');
const router = express.Router();
const {
  getAllUsers, toggleUserStatus, changeUserRole,
  getAllEvents, updateEventStatus, deleteEvent, getDashboardStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.put('/users/:id/role', changeUserRole);
router.get('/events', getAllEvents);
router.put('/events/:id/status', updateEventStatus);
router.delete('/events/:id', deleteEvent);

module.exports = router;

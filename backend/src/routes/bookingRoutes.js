const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, getAllBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('user', 'organizer', 'admin'), createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/', protect, authorize('admin'), getAllBookings);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;

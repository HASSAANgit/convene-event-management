const express = require('express');
const router = express.Router();
const {
  getEvents, getEvent, createEvent, updateEvent,
  deleteEvent, getMyEvents, getEventAttendees,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getEvents);
router.get('/my-events', protect, authorize('organizer', 'admin'), getMyEvents);
router.get('/:id', getEvent);
router.get('/:id/attendees', protect, authorize('organizer', 'admin'), getEventAttendees);
router.post('/', protect, authorize('organizer', 'admin'), upload.single('image'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), upload.single('image'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;

const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Book tickets for an event
// @route   POST /api/bookings
// @access  Private (User)
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, tickets } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.status !== 'approved') return res.status(400).json({ success: false, message: 'Event is not available for booking' });
    if (event.availableTickets < tickets) {
      return res.status(400).json({ success: false, message: `Only ${event.availableTickets} tickets remaining` });
    }

    // Check if user already booked this event
    const existing = await Booking.findOne({ user: req.user._id, event: eventId, status: 'confirmed' });
    if (existing) return res.status(400).json({ success: false, message: 'You already have a booking for this event' });

    const totalAmount = event.price * tickets;
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      tickets,
      totalAmount,
      paymentStatus: event.price === 0 ? 'free' : 'paid',
    });

    // Decrement available tickets
    const updatedEvent = await Event.findByIdAndUpdate(eventId, { $inc: { availableTickets: -tickets } }, { new: true });

    // Emit real-time update
    if (req.io) {
      req.io.emit('seatUpdate', { eventId: updatedEvent._id, availableTickets: updatedEvent.availableTickets });
    }

    await booking.populate('event', 'title date location image');
    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (User)
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date location image price status category')
      .sort('-createdAt');
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User)
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Return tickets
    const updatedEvent = await Event.findByIdAndUpdate(booking.event, { $inc: { availableTickets: booking.tickets } }, { new: true });

    // Emit real-time update
    if (req.io) {
      req.io.emit('seatUpdate', { eventId: updatedEvent._id, availableTickets: updatedEvent.availableTickets });
    }

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title date location')
      .sort('-createdAt');
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

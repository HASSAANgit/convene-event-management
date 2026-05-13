const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Technology', 'Music', 'Sports', 'Business', 'Arts', 'Food', 'Health', 'Education', 'Other'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    venue: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalTickets: {
      type: Number,
      required: [true, 'Total tickets is required'],
      min: [1, 'Must have at least 1 ticket'],
    },
    availableTickets: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    tags: [{ type: String }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Set availableTickets = totalTickets on creation
eventSchema.pre('save', function () {
  if (this.isNew) {
    this.availableTickets = this.totalTickets;
  }
});

// Virtual: isUpcoming
eventSchema.virtual('isUpcoming').get(function () {
  return new Date(this.date) > new Date();
});

eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);

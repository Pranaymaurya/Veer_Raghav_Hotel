import mongoose from "mongoose";
import { type } from "os";

const bookingSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  noofguests: {
    type: Number,
    required: true,
    min: 1, // Minimum one guest required
  },
  noofchildrens: {
    type: Number,
    default: 0, // Default to 0 if not provided
    min: 0, // No negative values
  },
  noOfRooms:{
    type:Number,
    },
}, 
{
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

  // const Booking= mongoose.model('Booking', bookingSchema);
  // export default Booking;
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

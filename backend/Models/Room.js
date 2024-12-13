import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Premium', 'Super Deluxe', 'Deluxe'],
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: 'No description available',
  },
  maxOccupancy: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  images: {
    type: [String], // Array to store image paths
    default: [],
  },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;

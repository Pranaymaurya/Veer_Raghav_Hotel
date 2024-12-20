import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactNumbers: {
    type: [String], // Array of strings
    required: true,
  },
  checkInTime: {
    type: String, // Time format like "HH:mm"
    required: true,
  },
  checkOutTime: {
    type: String, // Time format like "HH:mm"
    required: true,
  },
});

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;

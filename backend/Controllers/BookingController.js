import Booking from "../Models/Booking.js";
import Room from "../Models/Room.js";
import User from "../Models/userModel.js";

export const CreateBooking = async (req, res) => {
  const { userId, roomId, checkInDate, checkOutDate } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!room.isAvailable) return res.status(400).json({ message: "Room is not available for booking" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const numberOfNights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    if (numberOfNights <= 0) return res.status(400).json({ message: "Invalid booking dates" });
    const totalPrice = room.pricePerNight * numberOfNights;
    const booking = new Booking({
      user: userId,
      room: roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
    });
    const savedBooking = await booking.save();

    room.isAvailable = false;
    await room.save();

    res.status(201).json({ message: "Booking created successfully", booking: savedBooking });
  } catch (error) {
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};

// Get all bookings
export const GetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user").populate("room");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// Get a booking by ID
export const GetBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user").populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking", error: error.message });
  }
};

// Cancel a booking
export const CancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Cancel the booking
    booking.status = "Cancelled";
    await booking.save();

    // Mark the room as available
    const room = await Room.findById(booking.room);
    room.isAvailable = true;
    await room.save();

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking", error: error.message });
  }
};

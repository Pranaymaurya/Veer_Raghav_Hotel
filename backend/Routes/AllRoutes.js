import express from 'express';
import  { login, register } from '../Controllers/authController.js';
import {
  CancelBooking,
  CreateBooking,
  GetAllBookings,
  GetBookingById,
} from '../Controllers/BookingController.js';
import {
  AddImagesById,
  AddRoom,
  DeleteRoom,
  GetRoomById,
  GetRooms,
  UpdateRoom,
} from '../Controllers/roomController.js';
import { uploadMultiple } from '../Middleware/Multer.js';
import authMiddleware from '../Middleware/AuthMiddleware.js';
const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);

// Booking routes
router.post('/booking',authMiddleware, CreateBooking); // Create a booking
router.put('/booking/:id/cancel',authMiddleware, CancelBooking); // Cancel a booking by ID
router.get('/booking',authMiddleware, GetAllBookings); // Get all bookings
router.get('/booking/:id',authMiddleware, GetBookingById); // Get a booking by ID

// Room routes
router.post('/room',authMiddleware,uploadMultiple, AddRoom); // Create a new room
router.post('/room/images/:id',authMiddleware, uploadMultiple, AddImagesById);
router.delete('/room/:id',authMiddleware, DeleteRoom); // Delete a room by ID
router.get('/room',authMiddleware, GetRooms); // Get all rooms
router.get('/room/:id',authMiddleware, GetRoomById); // Get a single room by ID
router.put('/room/:id',authMiddleware, UpdateRoom); // Update a room by ID

export default router;

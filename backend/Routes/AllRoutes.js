import express from 'express';
import  { login, register } from '../Controllers/authController.js';
import {
  CancelBooking,
  CreateBooking,
  GetAllBookings,
  getavgrating,
  GetBookingById,
  Putrating,
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
import {authMiddleware,authorizeRoles} from '../Middleware/AuthMiddleware.js';
import { deleteUser, updateUser } from '../Controllers/userController.js';
const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.put('/user/:id',authMiddleware,authorizeRoles('user','admin'), updateUser);
router.delete('/user/delete/:id',authMiddleware,authorizeRoles('user','admin'), deleteUser);
// Booking routes
router.post('/booking',authMiddleware,authorizeRoles('user','admin'), CreateBooking); // Create a booking
router.put('/booking/:id/cancel',authMiddleware,authorizeRoles('user','admin'), CancelBooking); // Cancel a booking by ID
router.get('/booking',authMiddleware,authorizeRoles('user','admin'),GetAllBookings); // Get all bookings
router.get('/booking/:id',authMiddleware,authorizeRoles('user','admin'), GetBookingById); // Get a booking by ID
router.post('/room/rating/:id',authMiddleware,authorizeRoles('user','admin'), Putrating);
router.get('/room/rating/:id',authMiddleware,authorizeRoles('user','admin'), getavgrating);
// Room routes
// Room routes
router.post('/room', authMiddleware, authorizeRoles('admin'), uploadMultiple, AddRoom); // Create a new room
router.post('/room/images/:id', authMiddleware, uploadMultiple, authorizeRoles('admin'), AddImagesById);
router.delete('/room/:id', authMiddleware, authorizeRoles('admin'), DeleteRoom); // Delete a room by ID
router.get('/room', GetRooms); // Get all rooms (publicly accessible)
router.get('/room/:id', authMiddleware, authorizeRoles('admin'), GetRoomById); // Get a single room by ID
router.put('/room/:id', authMiddleware, authorizeRoles('admin'), UpdateRoom); // Update a room by ID


export default router;

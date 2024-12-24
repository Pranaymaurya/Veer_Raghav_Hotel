import express from 'express';
import  { login, register } from '../Controllers/authController.js';
import {
  CancelBooking,
  CreateBooking,
  GetAllBookings,
  getavgrating,
  GetBookingById,
  GetUserBookings,
  Putrating,
  UpdateBooking,
  UpdateBookingForAdmin,
} from '../Controllers/BookingController.js';
import {
  AddImagesById,
  AddRoom,
  DeleteRoom,
  GetRoomById,
  GetRooms,
  UpdateRoom,
} from '../Controllers/roomController.js';
import { uploadMultiple, uploadsingle } from '../Middleware/Multer.js';
import {authMiddleware,authorizeRoles} from '../Middleware/AuthMiddleware.js';
import { deleteUser, GetAllUsers, getUserDetails, updateUser } from '../Controllers/userController.js';
import { AddHotel, GetHotel, updateHotel, UploadHotelLogo } from '../Controllers/HotelController.js';
const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.put('/user/:id',authMiddleware,authorizeRoles('user','admin'), updateUser);
router.delete('/user/delete/:id',authMiddleware,authorizeRoles('user','admin'), deleteUser);
router.get('/user',authMiddleware,authorizeRoles('admin'),GetAllUsers)//used by admin o get all user
router.get('/userdetails',authMiddleware,authorizeRoles('admin','user'),getUserDetails)//helps to get details of user
router.get('/user/booking',authMiddleware,authorizeRoles('admin','user'),GetUserBookings)//helps to get booking of a particular user

// Booking routes
router.post('/booking',authMiddleware,authorizeRoles('user','admin'), CreateBooking); // Create a booking
router.delete('/booking/:id/cancel',authMiddleware,authorizeRoles('user','admin'), CancelBooking);
router.put('/booking/:id',authMiddleware,authorizeRoles('user','admin'), UpdateBooking);
router.put('/booking/admin/:id',authMiddleware,authorizeRoles('admin'), UpdateBookingForAdmin);
 // Cancel a booking by ID
router.get('/booking',authMiddleware,authorizeRoles('user','admin'),GetAllBookings); // Get all bookings
router.get('/booking/:id',authMiddleware,authorizeRoles('user','admin'), GetBookingById); // Get a booking by ID
router.post('/room/rating/:id',authMiddleware,authorizeRoles('user','admin'), Putrating);
router.get('/room/rating/:id',authMiddleware,authorizeRoles('user','admin'), getavgrating);
// Room routes
// Room routes
router.post('/room', authMiddleware, authorizeRoles('admin'), uploadMultiple, AddRoom); // Create a new room
router.post('/room/images/:id', authMiddleware,  authorizeRoles('admin') ,uploadMultiple, AddImagesById);
router.delete('/room/:id', authMiddleware, authorizeRoles('admin'), DeleteRoom); // Delete a room by ID
router.get('/room', GetRooms); // Get all rooms (publicly accessible)
router.get('/room/:id', authMiddleware, authorizeRoles('admin'), GetRoomById); // Get a single room by ID
router.put('/room/:id', authMiddleware, authorizeRoles('admin'), UpdateRoom); // Update a room by ID

router.post('/hotel', authMiddleware, authorizeRoles('admin'), AddHotel);
router.put('/hotel/:id', authMiddleware, authorizeRoles('admin'), updateHotel);
router.put('/hotel/image/:id', authMiddleware, authorizeRoles('admin'),uploadsingle, UploadHotelLogo);
router.get('/hotel',GetHotel)
export default router;

// Update User Function
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';
export const updateUser = async (req, res) => {
    const { name, email, password, phoneno, gender, age, role } = req.body;
    const userId = req.params.id;  // The ID of the user to update, passed via URL parameter
  
    try {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found."
        });
      }
      console.log(req.user.userId)
      // Ensure the logged-in user is the one requesting the update (if required)
      if (userId !== req.user.userId) {  // Assuming req.userId comes from JWT authentication
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this account."
        });
      }
  
      // Update user details
      if (name) user.name = name;
      if (email) user.email = email;
      if (phoneno) user.phoneno = phoneno;
      if (gender) user.gender = gender;
      if (age) user.age = age;
      if (role) user.role = role;
  
      // If password is provided, hash it
      if (password) {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);
      }
  
      // Save the updated user
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "User updated successfully.",
        user: {
          name: user.name,
          email: user.email,
          phoneno: user.phoneno,
          gender: user.gender,
          age: user.age,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error. Please try again later."
      });
    }
  };

  export const deleteUser = async (req, res) => {
    const userId = req.params.id;  // The ID of the user to delete
    const loggedInUserId = req.user.userId;  // The ID from the JWT token (authenticated user)
    const loggedInUserRole = req.user.role;  // The role from the JWT token (e.g., user or admin)
  
    try {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found."
        });
      }
  
      // Authorization check: only the user themselves or an admin can delete an account
      if (userId !== loggedInUserId && loggedInUserRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this account."
        });
      }
  
      // Optional: Handle any associated data (e.g., bookings, ratings) that need to be cleaned up before deleting the user
      // Example: await Booking.deleteMany({ userId: userId }); // If you have a bookings collection, delete related records
  
      // Delete the user using findByIdAndDelete
      await User.findByIdAndDelete(userId);
  
      return res.status(200).json({
        success: true,
        message: "User deleted successfully."
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error. Please try again later."
      });
    }
  };
  
  export const GetAllUsers = async (req, res) => {
    try {
      const bookings = await User.find();
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    }
  };
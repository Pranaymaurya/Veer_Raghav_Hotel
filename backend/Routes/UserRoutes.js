import express from 'express'
import { changePassword, deleteUser, GetAllUsers, getUserDetails, profile, updateUser } from '../Controllers/userController.js';
import { authMiddleware, authorizeRoles } from '../Middleware/AuthMiddleware.js';
const router2=express.Router();
// router2.get("/profile", authMiddleware, profile);
router2.put(
  "/user/:id",
  authMiddleware,
  authorizeRoles("user", "admin"),
  updateUser
);
router2.delete(
  "/user/delete/:id",
  authMiddleware,
  authorizeRoles("user", "admin"),
  deleteUser
);
router2.get("/user", authMiddleware, authorizeRoles("admin"), GetAllUsers); //used by admin o get all user
router2.get(
  "/userdetails",
  authMiddleware,
  authorizeRoles("admin", "user"),
  getUserDetails
);
router2.put(
    "/changepassword",
    authMiddleware,
    authorizeRoles("admin", "user"),
    changePassword
  );

export default router2;
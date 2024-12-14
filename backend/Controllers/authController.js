import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

// Register Function
export const register = async (req, res) => {
  const { name, email, password, phoneno, gender, age, role } = req.body;

  try {
    // Input validation
    if (!name || !email || !password || !phoneno) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and phone number are required."
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { phoneno }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email or phone number already exists."
      });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneno,
      gender,
      age,
      role
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        name: newUser.name,
        email: newUser.email,
        phoneno: newUser.phoneno,
        gender: newUser.gender,
        age: newUser.age
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

// Login Function
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }); // Case-insensitive email check

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "User not found or password is missing."
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials. Password is incorrect."
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // Include 'role' here
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
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

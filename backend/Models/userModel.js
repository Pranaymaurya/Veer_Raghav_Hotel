import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email format'], // Added custom error message
      },
      password: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        default: 18,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'other'],
        default: '',
      },
    phoneno: {
        type: Number,
        required: true,
        validate: {
          validator: function(v) {
            // Regular expression to match a valid phone number format
            return /^[0-9]{10}$/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
      },
  });
  
const User=mongoose.model('User',userSchema)
export default User;
  
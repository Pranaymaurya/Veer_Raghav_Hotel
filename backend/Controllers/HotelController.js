import Hotel from "../Models/HotelModel.js";

export const AddHotel = async (req, res) => {
  try {
    const { name, address, contactNumbers, checkInTime, checkOutTime } = req.body;
    if (!name || !address || !contactNumbers || !checkInTime || !checkOutTime) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!Array.isArray(contactNumbers)) {
      return res.status(400).json({ message: "Contact numbers must be an array." });
    }
    const newHotel = new Hotel({
      name,
      address,
      contactNumbers,
      checkInTime,
      checkOutTime,
    });
    await newHotel.save();
    return res.status(201).json({
      message: "Hotel added successfully.",
      hotel: newHotel,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params; // Get the hotel ID from the URL
    const { name, address, contactNumbers, checkInTime, checkOutTime } = req.body;

    // Check if any fields are provided for update
    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (contactNumbers) updateData.contactNumbers = contactNumbers;
    if (checkInTime) updateData.checkInTime = checkInTime;
    if (checkOutTime) updateData.checkOutTime = checkOutTime;

    // If no fields to update, send a message
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }

    // Find the hotel by ID and update it
    const updatedHotel = await Hotel.findByIdAndUpdate(id, updateData, { new: true });

    // If hotel is not found, send an error message
    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    // Return the updated hotel details
    return res.status(200).json({
      message: "Hotel updated successfully.",
      hotel: updatedHotel,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

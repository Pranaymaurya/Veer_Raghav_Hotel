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
export const UploadHotelLogo = async (req, res) => {
  const { id } = req.params; // Get hotel ID from the request parameters

  try {
    // Find the hotel by ID
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Check if a file was uploaded
    console.log(req.file)
    if (!req.file) {
      return res.status(400).json({ message: "No logo file uploaded" });
    }

    // Store the file path to the logo field
    hotel.logo = req.file.path;

    // Save the updated hotel document
    const updatedHotel = await hotel.save();

    return res.status(200).json({ message: "Logo uploaded successfully", hotel: updatedHotel });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload logo", error: error.message });
  }
};
export const GetHotel = async (req, res) => {
  try {
    const rooms = await Hotel.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error: error.message });
  }
};
export const GetHotelById = async (req, res) => {
  try {
    const room = await Hotel.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room", error: error.message });
  }
};
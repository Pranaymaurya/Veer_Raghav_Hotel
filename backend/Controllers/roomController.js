import { uploadMultiple } from "../Middleware/Multer.js";
import Room from "../Models/Room.js";

// Add a new room
// Add a new room with images
export const AddRoom = async (req, res) => {
  const { name, pricePerNight, amenities, description, maxOccupancy, isAvailable } = req.body;

  try {
    const images = req.files ? req.files.map(file => file.path) : [];

    // Create a new room
    const room = new Room({
      name,
      pricePerNight,
      amenities: amenities ? amenities.split(',') : [],
      description,
      maxOccupancy,
      isAvailable,
      images,
    });

    const savedRoom = await room.save();
    res.status(201).json({ message: "Room added successfully", room: savedRoom });
  } catch (error) {
    res.status(400).json({ message: "Failed to add room", error: error.message });
  }
};
export const AddImagesById = async (req, res) => {
  const { id } = req.params; // Get room ID from the request parameters

  try {
    // Find the room by ID
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Collect images from the uploaded files
    const newImages = req.files ? req.files.map(file => file.path) : [];

    if (newImages.length > 0) {
      // Append the new images to the existing images array
      room.images = [...room.images, ...newImages];
      
      // Save the updated room
      const updatedRoom = await room.save();
      return res.status(200).json({ message: "Images added successfully", room: updatedRoom });
    } else {
      return res.status(400).json({ message: "No images uploaded" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add images", error: error.message });
  }
};

// Get all rooms
export const GetRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error: error.message });
  }
};

// Get a single room by ID
export const GetRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room", error: error.message });
  }
};

// Update a room by ID
export const UpdateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRoom) return res.status(404).json({ message: "Room not found" });

    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    res.status(400).json({ message: "Failed to update room", error: error.message });
  }
};

// Delete a room by ID
export const DeleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) return res.status(404).json({ message: "Room not found" });

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete room", error: error.message });
  }
};

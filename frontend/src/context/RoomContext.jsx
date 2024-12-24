import React, { createContext, useContext, useCallback, useState } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

const RoomContext = createContext();

const API_BASE_URL = import.meta.env.VITE_BACKEND_UPLOAD_URL;

export const RoomProvider = ({ children }) => {
  const { getToken } = useAuth();

  const [ Rooms, setRooms ] = useState([]);


  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return '/placeholder-room.jpg';
    return `${API_BASE_URL}/${imagePath}`;
  }, []);

  // Helper function to get authenticated config
  const getAuthConfig = useCallback(async () => {
    const token = await getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }, [getToken]);

  // Helper function for multipart form data with auth
  const getMultipartConfig = useCallback(async () => {
    const token = await getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
  }, [getToken]);

  const putRating = async (roomId, ratingData) => {
    try {
      const config = await getAuthConfig();
      const response = await api.post(`/room/rating/${roomId}`, ratingData, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const getAverageRating = async (roomId) => {
    try {
      const config = await getAuthConfig();
      const response = await api.get(`/room/rating/${roomId}`, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const addRoom = async (roomData) => {
    try {
      const basicRoomData = {
        name: roomData.name,
        pricePerNight: roomData.pricePerNight,
        amenities: roomData.amenities,
        description: roomData.description,
        maxOccupancy: roomData.maxOccupancy,
        isAvailable: roomData.isAvailable
      };

      const config = await getAuthConfig();
      const response = await api.post('/room', basicRoomData, config);

      if (!response.data.room || !response.data.room._id) {
        throw new Error('Invalid response from server when creating room');
      }

      // If there are images, add them in a separate request
      if (roomData.images && roomData.images.length > 0) {
        await addImagesToRoom(response.data.room._id, roomData.images);
      }

      return response.data.room;
    } catch (error) {
      console.error('Error in addRoom:', error);
      handleApiError(error);
    }
  };

  const addImagesToRoom = async (roomId, images) => {
    try {
      if (!roomId) {
        throw new Error('Room ID is required to add images');
      }

      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const config = await getMultipartConfig();
      const response = await api.post(`/room/images/${roomId}`, formData, config);
      
      if (!response.data) {
        throw new Error('Failed to upload images');
      }

      return response.data;
    } catch (error) {
      console.error('Error in addImagesToRoom:', error);
      handleApiError(error);
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      const config = await getAuthConfig();
      console.log('Deleting room with ID:', roomId);
      console.log('Delete request config:', config);
      const response = await api.delete(`/room/${roomId}`, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const getAllRooms = async () => {
    try {
      const response = await api.get('/rooms');
      // console.log(response.data);
      setRooms(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const getRoomById = async (roomId) => {
    try {
      const config = await getAuthConfig();
      const response = await api.get(`/room/${roomId}`, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const updateRoom = async (roomId, roomData) => {
    try {
      const config = await getAuthConfig();
      const response = await api.put(`/room/${roomId}`, roomData, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  // Helper function to handle API errors
  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }
    throw error;
  };

  const value = {
    putRating,
    getAverageRating,
    addRoom,
    addImagesToRoom,
    deleteRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    Rooms,
    getImageUrl
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
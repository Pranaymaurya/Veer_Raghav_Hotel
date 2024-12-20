import React, { createContext, useContext } from 'react';
import api from '@/utils/api';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  const putRating = async (roomId, ratingData) => {
    try {
      const response = await api.post(`/room/rating/${roomId}`, ratingData);
      return response.data;
    } catch (error) {
      console.error('Error putting rating:', error);
      throw error;
    }
  };

  const getAverageRating = async (roomId) => {
    try {
      const response = await api.get(`/room/rating/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching average rating:', error);
      throw error;
    }
  };

  const addRoom = async (roomData) => {
    try {
      const response = await api.post('/room', roomData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding room:', error);
      throw error;
    }
  };

  const addImagesToRoom = async (roomId, images) => {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`image${index}`, image);
      });
      const response = await api.post(`/room/images/${roomId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding images to room:', error);
      throw error;
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      const response = await api.delete(`/room/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  };

  const getAllRooms = async () => {
    try {
      const response = await api.get('/room');
      return response.data;
    } catch (error) {
      console.error('Error fetching all rooms:', error);
      throw error;
    }
  };

  const getRoomById = async (roomId) => {
    try {
      const response = await api.get(`/room/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  };

  const updateRoom = async (roomId, roomData) => {
    try {
      const response = await api.put(`/room/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
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


import React, { createContext, useContext } from 'react';
import api from '@/utils/api';

const BookingContext = createContext();


export const BookingProvider = ({ children }) => {

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  const createBooking = async (bookingData) => {
    try {
      const response = await api.post('/booking', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await api.put(`/booking/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  };

  const getAllBookings = async () => {
    try {
      const response = await api.get('/booking');
      return response.data;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  };

  const getBookingById = async (bookingId) => {
    try {
      const response = await api.get(`/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  };

  const value = {
    createBooking,
    cancelBooking,
    getAllBookings,
    getBookingById,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};


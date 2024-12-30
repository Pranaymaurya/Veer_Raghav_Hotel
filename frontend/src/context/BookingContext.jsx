import React, { createContext, useContext, useCallback } from 'react';
import api from '@/utils/api';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {


  const createBooking = useCallback(async (bookingData) => {
    console.log('Booking data:', bookingData);
    
    try {
      const response = await api.post('/booking', bookingData);

      return {
        success: true,
        booking: {
          ...response.data,
          id: response.data.id || response.data._id,
          userId: bookingData._id,
          roomId: bookingData.roomId,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          totalPrice: bookingData.totalPrice
        }
      };
    } catch (error) {
      console.error('Booking error:', error);

      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create booking',
        booking: null
      };
    }
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      const response = await api.put(`/booking/${bookingId}/cancel`, {});
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  };

  const getAllBookings = async () => {
    try {
      const response = await api.get('/bookings');
      return Array.isArray(response.data) ? response.data :
        Array.isArray(response.data.bookings) ? response.data.bookings : [];
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
import React, { createContext, useCallback, useContext } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { getToken, logout, user } = useAuth();

  if (!getToken) {
    logout();
    throw new Error('getToken is not defined');
  }



  const getAuthConfig = useCallback(async () => {
    const token = await getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }, [getToken]);


  const createBooking = useCallback(async (bookingData) => {
    try {
      const config = await getAuthConfig();
      const response = await api.post('/booking', bookingData, config);
      
      // Transform the API response to match the expected structure
      return {
        success: true,
        booking: {
          ...response.data,
          // Ensure these fields exist in the response
          id: response.data.id || response.data._id,
          userId: bookingData.userId,
          roomId: bookingData.roomId,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          totalPrice: bookingData.totalPrice
        }
      };
    } catch (error) {
      console.error('Booking error:', error);
      
      // Transform error response to match expected structure
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create booking',
        booking: null
      };
    }
  }, [getAuthConfig]);

  const cancelBooking = async (bookingId) => {
    try {
      const config = await getAuthConfig();
      const response = await api.put(`/booking/${bookingId}/cancel`, {}, config);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  };

  const getAllBookings = async () => {
    try {
      const config = await getAuthConfig();
      const response = await api.get('/bookings', config);
      return response.data;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  };

  const getBookingById = async (bookingId) => {
    try {
      const config = await getAuthConfig();
      const response = await api.get(`/booking/${bookingId}`, config);
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
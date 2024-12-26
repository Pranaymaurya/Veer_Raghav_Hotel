import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/api';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {

  // const { getToken } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [ hotelInfo, setHotelInfo ] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // const getAuthConfig = useCallback(async () => {
  //   const token = await getToken();
  //   return {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json',
  //     },
  //   };
  // }, [getToken]);

 

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    try {
      // const config = await getAuthConfig();
      const response = await api.get('/hotel');
      if (response.data) {
        setHotel(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch hotel:', error);
      setIsLoading(false);
    }
  };

  const gethotel = async () => {
    try {
      // const config = await getAuthConfig();
      const response = await api.get('/hotel');
      if (response.data) {
        setHotelInfo(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch hotel:', error);
    }
  };

  const createHotel = async (hotelData) => {
    try {
      const config = await getAuthConfig();
      const response = await api.post('/hotel', hotelData);
      setHotel(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create hotel:', error);
      throw error;
    }
  };

  const updateHotel = async (hotelId, hotelData) => {
    try {
    
      // Ensure data is properly formatted
      const formattedData = {
        name: hotelData.name || '',
        contactNumbers: Array.isArray(hotelData.contactNumbers) 
          ? hotelData.contactNumbers.filter(num => num.trim() !== '')
          : [],
        address: hotelData.address || '',
        checkInTime: hotelData.checkInTime || '',
        checkOutTime: hotelData.checkOutTime || '',
      };
  
      console.log('Sending data:', formattedData); // For debugging
  
      const response = await api.put(`/hotel/${hotelId}`, formattedData);
      
      if (response.data) {
        setHotel(Array.isArray(response.data) ? response.data : [response.data]);
        return response.data;
      }
      
      throw new Error('No data received from server');
    } catch (error) {
      console.error('Failed to update hotel:', error);
      // Log more detailed error information
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  };

  const uploadLogo = async (file) => {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const response = await api.put('/hotel/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHotel(prevHotel => ({ ...prevHotel, logoUrl: response.data.logoUrl }));
      return response.data;
    } catch (error) {
      console.error('Failed to upload logo:', error);
      throw error;
    }
  };


  return (
    <SettingsContext.Provider value={{ hotel, isLoading, createHotel, updateHotel, uploadLogo, fetchHotel, gethotel, hotelInfo }}>
      {children}
    </SettingsContext.Provider>
  );
};


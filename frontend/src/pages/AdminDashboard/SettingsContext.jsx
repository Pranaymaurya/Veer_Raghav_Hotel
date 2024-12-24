import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/api';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {

  const { getToken } = useAuth();

  const getAuthConfig = useCallback(async () => {
    const token = await getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }, [getToken]);

  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    try {
      const config = await getAuthConfig();
      const response = await api.get('/hotel', config);
      if (response.data) {
        setHotel(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch hotel:', error);
      setIsLoading(false);
    }
  };

  const createHotel = async (hotelData) => {
    try {
      const config = await getAuthConfig();
      const response = await api.post('/hotel', hotelData, config);
      setHotel(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create hotel:', error);
      throw error;
    }
  };

  const updateHotel = async (hotelData) => {
    try {
      const config = await getAuthConfig();
      const response = await api.put('/hotel', hotelData, config);
      setHotel(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update hotel:', error);
      throw error;
    }
  };

  const uploadLogo = async (file) => {
    try {
      const config = await getAuthConfig();
      const formData = new FormData();
      formData.append('logo', file);
      const response = await api.put('/hotel/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, config
      });
      setHotel(prevHotel => ({ ...prevHotel, logoUrl: response.data.logoUrl }));
      return response.data;
    } catch (error) {
      console.error('Failed to upload logo:', error);
      throw error;
    }
  };


  return (
    <SettingsContext.Provider value={{ hotel, isLoading, createHotel, updateHotel, uploadLogo }}>
      {children}
    </SettingsContext.Provider>
  );
};


import api from '@/utils/api';
import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await api.put('/settings', newSettings);
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const uploadLogo = async (file) => {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const response = await api.post('/settings/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSettings(prev => ({ ...prev, logoUrl: response.data.logoUrl }));
    } catch (error) {
      console.error('Failed to upload logo:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, uploadLogo }}>
      {children}
    </SettingsContext.Provider>
  );
};


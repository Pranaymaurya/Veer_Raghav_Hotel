import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/api';
import React, { createContext, useCallback, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const { getToken } = useAuth();

    const [Guests , setGuests] = useState([]);

    const getAuthConfig = useCallback(async () => {
        const token = await getToken();
        return {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };
      }, [getToken]);


    const [adminData, setAdminData] = useState({
        users: [],
        loading: false,
        error: null
    });

    const fetchUsers = async () => {
        try {
            const config = await getAuthConfig();
            const response = await api.get('/user', config);
            // Filter out admin users
            const guestUsers = response.data.filter(user => user.role !== 'admin');
            setGuests(guestUsers);
            return guestUsers;
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            const config = await getAuthConfig();
            const response = await api.delete(`/user/delete/${userId}`, config);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <AdminContext.Provider value={{ 
            adminData, 
            setAdminData,
            fetchUsers,
            deleteUser,
            Guests
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminContext = () => useContext(AdminContext);
import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/api';
import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

    const [Guests, setGuests] = useState([]);

    const [adminData, setAdminData] = useState({
        users: [],
        loading: false,
        error: null
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/user');
            // Filter out admin users
            const guestUsers = response.data.filter(user => user.role !== 'admin');
            setGuests(guestUsers);
            return guestUsers;
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await api.delete(`/user/delete/${userId}`);
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
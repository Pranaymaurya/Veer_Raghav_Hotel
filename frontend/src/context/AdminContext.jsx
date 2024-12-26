import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/api';
import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [Guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/user');
            const guestUsers = response.data.filter(user => user.role !== 'admin');
            setGuests(guestUsers);
            return guestUsers;
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        setLoading(true);
        try {
            const response = await api.delete(`/user/delete/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminContext.Provider value={{ 
            fetchUsers,
            deleteUser,
            Guests,
            loading
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminContext = () => useContext(AdminContext);
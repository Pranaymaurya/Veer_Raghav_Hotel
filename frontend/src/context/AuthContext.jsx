import { createContext, useCallback, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import api from "@/utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = () => {
        const userFromCookie = Cookies.get('user');
        const tokenFromCookie = Cookies.get('token');

        if (userFromCookie && tokenFromCookie) {
            try {
                const parsedUser = JSON.parse(userFromCookie);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                Cookies.remove('user');
                Cookies.remove('token');
            }
        }
        setLoading(false);
    };

    const getToken = async () => {
        try {
            const token = Cookies.get('token');
            // console.log('bjbj',token);

            if (!token) {
                throw new Error('No token found');
            }
            return token;
        } catch (error) {
            console.error('Error getting token:', error);
            logout();
            throw new Error('Authentication failed');
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            if (response.status === 200 && response.data.success) {
                setUser(response.data.user);
                Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
                Cookies.set('token', response.data.token, { expires: 7 });
                return {
                    success: true,
                    message: response.data.message,
                    user: response.data.user
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Login failed.'
                };
            }
        } catch (error) {
            console.error('Error logging in:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'An error occurred. Login failed.'
            };
        }
    };

    const register = async (userData) => {
        try {
            const registrationData = {
                ...userData,
                role: userData.role || 'patient'
            };
            const response = await api.post('/register', registrationData);
            if (response.data.success) {
                setUser(response.data.user);
                Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
                Cookies.set('token', response.data.token, { expires: 7 });
                return {
                    success: true,
                    user: response.data.user
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Registration failed'
                };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'An error occurred during registration'
            };
        }
    };

    const updateUserData = useCallback((newData) => {
        setUser(currentUser => {
            const updatedUser = { ...currentUser, ...newData };
            // Update the user cookie with the new data
            Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
            return updatedUser;
        });
    }, []);

    const logout = () => {
        setUser(null);
        Cookies.remove('user');
        Cookies.remove('token');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            getToken,
            updateUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
};
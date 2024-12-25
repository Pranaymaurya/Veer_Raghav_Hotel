import { createContext, useCallback, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import api, { setAuthContext } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        checkUserLoggedIn();
        setAuthContext({ logout });
    }, []);

    const getToken = useCallback(() => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('No token found');
            }
            return token;
        } catch (error) {
            console.error('Error getting token:', error);
            logout();
            throw new Error('Authentication failed');
        }
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
                role: userData.role || 'user'
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
            Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
            return updatedUser;
        });
    }, []);

    const updateProfile = async (userData) => {
        
        try {
           
            
            const response = await api.put(`/user/${user.userId}`, userData);
            if (response.data.success) {
                updateUserData(response.data.user);
                toast({
                    title: "Profile updated",
                    description: "Your profile has been successfully updated.",
                    variant: "success",
                    className: "bg-green-200 border-green-400 text-black text-lg",
                    duration: 3000
                });
                return { success: true, user: response.data.user };
            } else {
                throw new Error(response.data.message || 'Profile update failed');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast({
                title: "Update failed",
                description: error.message || 'An error occurred while updating your profile',
                variant: "destructive",
                className: "bg-red-200 border-red-400 text-black text-lg",
                duration: 3000
            });
            return { success: false, message: error.message || 'An error occurred while updating your profile' };
        }
    };

    const deleteAccount = async () => {
        try {
            const response = await api.delete(`/user/delete/${user._id}`);
            if (response.data.success) {
                toast({
                    title: "Account deleted",
                    description: "Your account has been successfully deleted.",
                    variant: "success",
                    className: "bg-green-200 border-green-400 text-black text-lg",
                    duration: 3000
                });
                logout();
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Account deletion failed');
            }
        } catch (error) {
            console.error('Account deletion error:', error);
            toast({
                title: "Deletion failed",
                description: error.message || 'An error occurred while deleting your account',
                variant: "destructive",
                className: "bg-red-200 border-red-400 text-black text-lg",
                duration: 3000
            });
            return { success: false, message: error.message || 'An error occurred while deleting your account' };
        }
    };

    const logout = useCallback(() => {
        setUser(null);
        Cookies.remove('user');
        Cookies.remove('token');
        localStorage.removeItem('token');
        toast({
            title: "Logout successful",
            description: "You have successfully logged out.",
            variant: "success",
            className: "bg-green-200 border-green-400 text-black text-lg",
            duration: 3000
        });
    }, [toast]);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            getToken,
            updateUserData,
            updateProfile,
            deleteAccount
        }}>
            {children}
        </AuthContext.Provider>
    );
};
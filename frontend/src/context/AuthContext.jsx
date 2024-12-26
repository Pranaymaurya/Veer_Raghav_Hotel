import { createContext, useCallback, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import api from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = () => {
        const userFromCookie = Cookies.get('user');
        
        if (userFromCookie) {
            try {
                const parsedUser = JSON.parse(userFromCookie);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                Cookies.remove('user');
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            
            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                // Store user data in cookie
                Cookies.set('user', JSON.stringify(userData), { expires: 1 }); // 1 hour to match backend
                
                return {
                    success: true,
                    message: response.data.message,
                    user: userData
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
                message: error.response?.data?.message || 'An error occurred during login.'
            };
        }
    };

    const register = async (userData) => {
        try {
            const registrationData = {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                phoneno: userData.phoneno,
                gender: userData.gender || '',
                age: userData.age || '',
                role: userData.role || 'user'
            };

            const response = await api.post('/register', registrationData);
            
            if (response.data.success) {
                const newUser = response.data.user;
                setUser(newUser);
                Cookies.set('user', JSON.stringify(newUser), { expires: 1 });
                
                return {
                    success: true,
                    message: response.data.message,
                    user: newUser
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

    const updateProfile = async (userData) => {
        try {
            const response = await api.put(`/user/${user.userId}`, userData);
            
            if (response.data.success) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                Cookies.set('user', JSON.stringify(updatedUser), { expires: 1 });
                
                toast({
                    title: "Profile updated",
                    description: "Your profile has been successfully updated.",
                    variant: "success",
                    className: "bg-green-200 border-green-400 text-black text-lg",
                    duration: 3000
                });
                
                return { success: true, user: updatedUser };
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
            return { 
                success: false, 
                message: error.message || 'An error occurred while updating your profile' 
            };
        }
    };

    const logout = useCallback(async () => {
        try {
            await api.post('/logout');
            setUser(null);
            Cookies.remove('user');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }, []);

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
                
                await logout();
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
            return { 
                success: false, 
                message: error.message || 'An error occurred while deleting your account' 
            };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateProfile,
            deleteAccount
        }}>
            {children}
        </AuthContext.Provider>
    );
};
import { createContext, useCallback, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import api from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();


    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/profile');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            logout();
        }
    };


    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            fetchUserProfile();
        }
        setLoading(false);
    }, []);


    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            
            if (response.data.success) {
                await fetchUserProfile();
                return {
                    success: true,
                    message: response.data.message
                };
            }
            return {
                success: false,
                message: response.data.message || 'Login failed.'
            };
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
                toast({
                    title: "Registration successful",
                    description: "Please login to continue.",
                    variant: "success",
                    className: "bg-green-200 border-green-400 text-black text-lg",
                    duration: 3000
                });
                
                return {
                    success: true,
                    message: "Registration successful. Please login to continue."
                };
            }
            
            return {
                success: false,
                message: response.data.message || 'Registration failed'
            };
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
                // Cookies.set('user', JSON.stringify(updatedUser), { expires: 1 });
                
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
        setUser(null);
        Cookies.remove('user');
        Cookies.remove('token');
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
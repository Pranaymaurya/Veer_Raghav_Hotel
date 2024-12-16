'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        // Also set the token in localStorage
        localStorage.setItem('token', tokenFromCookie);
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('user');
        Cookies.remove('token');
      }
    }
    setLoading(false);
  };

  const login = (userData, token) => {
    // Store user data and token in both cookies and localStorage
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }); // Expires in 7 days
    Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
    localStorage.setItem('token', token);
    
    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    // Remove user data and token from cookies and localStorage
    Cookies.remove('user');
    Cookies.remove('token');
    localStorage.removeItem('token');
    
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
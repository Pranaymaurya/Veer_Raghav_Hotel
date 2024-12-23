import React, { useEffect, useRef } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen } from 'lucide-react';

const UserProfileLayout = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const bookingsRef = useRef(null);

  // Updated useEffect to handle both initial load and navigation
  useEffect(() => {
    if (location.hash === '#mybookings' && bookingsRef.current) {
      // Small delay to ensure DOM is ready
      const scrollToBookings = () => {
        bookingsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      };

      // Try immediate scroll
      scrollToBookings();

      // Backup scroll after a short delay
      const timer = setTimeout(scrollToBookings, 100);

      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]); // Add pathname to dependencies

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Authentication checks
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'user') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Profile Page</h1>
      </header>

      {/* Profile Section */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <p>Welcome, {user.name}</p>
          {/* Add more profile information here */}
        </div>
      </section>

      {/* Bookings Section */}
      <section 
        ref={bookingsRef}
        id="mybookings" 
        className="p-6 bg-white rounded-lg shadow min-h-screen"
      >
        <div className="flex items-center mb-4">
          <BookOpen className="mr-2 h-5 w-5" />
          <h2 className="text-xl font-semibold">My Bookings</h2>
        </div>
        <div className="space-y-4">
          {/* Add your bookings content here */}
          <p>Your bookings will appear here...</p>
        </div>
      </section>

      {/* Add more sections as needed */}
      {/* like Bookings, Reviews, etc settings call this in the component folder */}
    </div>
  );
};

export default UserProfileLayout;
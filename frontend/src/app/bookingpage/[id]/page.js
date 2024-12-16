'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaUsers, FaBed, FaCalendarAlt, FaCreditCard, FaLock } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { rooms } from '../../../app/data/room';
import { useAuth } from '@/context/AuthContext';

const BookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const [room, setRoom] = useState(null);
  const [guests, setGuests] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalPrice, setTotalPrice] = useState(0);
  const [duration, setDuration] = useState({ days: 0, nights: 0 });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page with a return url
      router.push('/login?return_url=/booking');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const roomId = searchParams.get('roomId');
    const guestsParam = searchParams.get('guests');
    const roomCountParam = searchParams.get('roomCount');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const totalPriceParam = searchParams.get('totalPrice');

    if (roomId) {
      const selectedRoom = rooms.find(r => r.id === parseInt(roomId));
      setRoom(selectedRoom);
    }

    if (guestsParam) setGuests(parseInt(guestsParam));
    if (roomCountParam) setRoomCount(parseInt(roomCountParam));
    if (startDateParam) setStartDate(new Date(startDateParam));
    if (endDateParam) setEndDate(new Date(endDateParam));
    if (totalPriceParam) setTotalPrice(parseInt(totalPriceParam));
  }, [searchParams]);

  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDuration({ days: diffDays, nights: diffDays - 1 });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (room) {
      const calculatedPrice = room.price * guests * roomCount * duration.nights;
      setTotalPrice(calculatedPrice);
    }
  }, [room, guests, roomCount, duration.nights]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted', { firstName, lastName, email, phone, room, guests, roomCount, startDate, endDate, totalPrice });
    // Redirect to a confirmation page or show a success message
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return <div className="container mx-auto mt-8 text-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" min-h-screen py-12 px-4 roooms"
    >
      
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-orange-800 mb-8 text-center">Complete Your Booking</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="Name"
                    value={firstName || user?.name?.split(' ')[0] || ''}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email || user?.email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Confirm Booking
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Booking Summary</h2>
            <div className="mb-6">
              <Image
                src={room.image[0]}
                alt={room.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl font-bold text-orange-800 mb-2">{room.name}</h3>
            <p className="text-gray-600 mb-4">{room.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <FaUsers className="text-orange-500 mr-2" />
                <span>{guests} Guests</span>
              </div>
              <div className="flex items-center">
                <FaBed className="text-orange-500 mr-2" />
                <span>{roomCount} Rooms</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="text-orange-500 mr-2" />
                <span>{duration.nights} Nights</span>
              </div>
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-2" />
                <span>{room.rating} Rating</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Dates</span>
                <span className="font-semibold">
                  {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Price per night</span>
                <span className="font-semibold">₹{room.price}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total nights</span>
                <span className="font-semibold">{duration.nights}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-orange-600 mt-4">
                <span>Total Price</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p className="flex items-center mb-2">
                <FaLock className="mr-2" /> Secure payment
              </p>
              <p className="flex items-center">
                <FaCreditCard className="mr-2" /> We accept all major credit cards
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingPage;


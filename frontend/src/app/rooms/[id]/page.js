'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaStar, FaUsers, FaBed, FaCalendarAlt, FaPlus, FaMinus, FaChevronLeft, FaInfoCircle } from 'react-icons/fa';
import { rooms } from '../../data/room';
import ImageSlider from '../components/ImageSlider';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function RoomDetail({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const room = rooms.find(r => r.id === parseInt(params.id));
  const [guests, setGuests] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [duration, setDuration] = useState({ days: 0, nights: 0 });
  
  const [startDate, setStartDate] = useState(searchParams.get('startDate') ? new Date(searchParams.get('startDate')) : new Date());
  const [endDate, setEndDate] = useState(searchParams.get('endDate') ? new Date(searchParams.get('endDate')) : new Date());

  useEffect(() => {
    if (searchParams.get('guests')) {
      setGuests(parseInt(searchParams.get('guests')));
    }
  }, [searchParams]);

  const getRoomQuality = (rating) => {
    if (rating > 4.5) return "Excellent";
    if (rating > 4) return "Very Good";
    if (rating >= 3.5) return "Good";
    return "Okay";
  };

  const updateRoomCount = (guestCount) => {
    setRoomCount(Math.ceil(guestCount / room.capacity));
  };

  useEffect(() => {
    if (startDate && endDate && endDate > startDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDuration({ days: diffDays, nights: diffDays - 1 });
    } else {
      setDuration({ days: 0, nights: 0 });
    }
    updateRoomCount(guests);
  }, [startDate, endDate, guests, room.capacity]);

  if (!room) {
    return <div className="container mx-auto mt-8 text-center">Room not found</div>
  }

  const calculatePrice = () => {
    if (duration.nights <= 0) return 0;
    const basePrice = room.price * duration.nights;
    const requiredRooms = Math.ceil(guests / room.capacity);
    return basePrice * requiredRooms;
  };

  const totalPrice = calculatePrice();

  const handleGuestChange = (increment) => {
    setGuests(prev => Math.max(1, prev + increment));
    updateRoomCount(guests + increment);
  };

  const handleBookNow = () => {
    const queryString = new URLSearchParams({
      roomId: room.id,
      guests,
      roomCount,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalPrice,
    }).toString();
  
    router.push(`/bookingpage/${room.id}?${queryString}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-orange-50 min-h-screen roooms"
    >
      <header className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{room.name}</h1>
              <Link href="/rooms" className="text-orange-100 hover:underline flex items-center">
                <FaChevronLeft className="mr-2" />
                Back to Rooms
              </Link>
            </div>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-2" size={24} />
              <span className="text-white text-lg font-semibold">{room.rating}</span>
              <span className="ml-2 text-orange-100">({getRoomQuality(room.rating)})</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Room Images */}
          <div>
            <ImageSlider images={room.image} />
          </div>

          {/* Room Details and Booking */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-orange-800 mb-2">{room.name}</h2>
              <p className="text-gray-600 text-base">{room.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Details</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FaBed className="text-orange-500 mr-2" size={20} />
                    <span className="text-gray-600">Room Type: {room.type}</span>
                  </li>
                  <li className="flex items-center">
                    <FaUsers className="text-orange-500 mr-2" size={20} />
                    <span className="text-gray-600">Capacity: {room.capacity} Guests</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Price</h3>
                <div className="text-3xl font-bold text-orange-600">₹{room.price}
                  <span className="text-sm text-gray-500 ml-2">per night</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Booking Section */}
            <div className="bg-orange-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Book Your Stay</h3>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">
                  Duration: {duration.days} days, {duration.nights} nights
                </p>
              </div>

              {/* Guest and Room Selection */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <div className="flex items-center">
                    <button onClick={() => handleGuestChange(-1)} className="bg-orange-200 text-orange-800 p-2 rounded-l-md hover:bg-orange-300">
                      <FaMinus size={12} />
                    </button>
                    <span className="bg-white px-4 py-2 border-t border-b">{guests}</span>
                    <button onClick={() => handleGuestChange(1)} className="bg-orange-200 text-orange-800 p-2 rounded-r-md hover:bg-orange-300">
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rooms (auto-adjusted)</label>
                  <div className="bg-gray-100 px-4 py-2 rounded-md">
                    {roomCount}
                  </div>
                </div>
              </div>

              {/* Total Price */}
              <div className="text-right mb-4 flex items-center justify-end">
                <span className="text-lg font-semibold">Total: </span>
                <div className="text-2xl font-bold text-orange-600 mr-2 ml-2"> ₹{Math.max(0, totalPrice)}</div>
                {guests > room.capacity && (
                  <div className="relative group">
                    <FaInfoCircle className="text-orange-500 cursor-pointer" />
                    <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-white border border-gray-200 rounded p-2 shadow-lg text-sm text-gray-700 w-64">
                      Price increased due to guest count exceeding room capacity. Additional rooms are required.
                    </div>
                  </div>
                )}
              </div>

              {/* Book Now Button */}
              <button 
                onClick={handleBookNow}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Book Now
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm">
              Instant confirmation • Free cancellation
            </p>
            <p className="text-center text-gray-500 text-sm mt-2">
              *Price does not include taxes
            </p>
          </div>
        </div>
      </main>
    </motion.div>
  )
}


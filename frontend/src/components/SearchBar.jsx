import React, { useState } from 'react';
import { Calendar, Users, Bed, Search, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const HotelBookingSystem = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState('standard');

  const roomTypes = [
    { value: 'Premium', label: 'Premium' },
    { value: 'Deluxe Room', label: 'Deluxe Room' },
    { value: 'Deluxe', label: 'Super Deluxe' },
  ];

  const hotels = [
    {
      id: 1,
      name: "Luxury Ocean Resort",
      rating: 4.8,
      pricePerNight: "500",
      description: "Beachfront luxury resort with spectacular ocean views",
      image: "/uploads/1734712902927-backiee-275105.jpg"
    },
    {
      id: 2,
      name: "City Center Hotel",
      rating: 4.5,
      pricePerNight: "$199",
      description: "Modern hotel in the heart of downtown",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      name: "Mountain View Lodge",
      rating: 4.7,
      pricePerNight: "$249",
      description: "Scenic mountain retreat with premium amenities",
      image: "/api/placeholder/400/250"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-8xl mx-auto space-y-12"
      >
        {/* Search Form */}
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl overflow-hidden border-t border-white/60">
          <CardContent className="p-6">
            <motion.h2 
              className="text-2xl font-semibold text-orange-400 mb-6 text-center"
              variants={itemVariants}
            >
              Find Your Perfect Stay
            </motion.h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Check-in Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Check-in</label>
                  <div className="relative group">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg pl-10 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none group-hover:border-orange-300"
                      required
                    />
                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-orange-500" />
                  </div>
                </div>

                {/* Check-out Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Check-out</label>
                  <div className="relative group">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg pl-10 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none group-hover:border-orange-300"
                      required
                    />
                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-orange-500" />
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Room Type</label>
                  <div className="relative group">
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg pl-10 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none group-hover:border-orange-300"
                    >
                      {roomTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </motion.select>
                    <Bed className="absolute left-3 top-3.5 h-4 w-4 text-orange-500" />
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Guests</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1 group">
                      <motion.select
                        whileFocus={{ scale: 1.02 }}
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full p-3 border border-gray-200 rounded-lg pl-10 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none group-hover:border-orange-300"
                      >
                        {[1, 2, 3, 4].map((num) => (
                          <option key={num} value={num}>
                            {num} Adult{num !== 1 ? 's' : ''}
                          </option>
                        ))}
                      </motion.select>
                      <Users className="absolute left-3 top-3.5 h-4 w-4 text-orange-500" />
                    </div>
                    <div className="relative flex-1 group">
                      <motion.select
                        whileFocus={{ scale: 1.02 }}
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full p-3 border border-gray-200 rounded-lg pl-10 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none group-hover:border-orange-300"
                      >
                        {[0, 1, 2, 3].map((num) => (
                          <option key={num} value={num}>
                            {num} Child{num !== 1 ? 'ren' : ''}
                          </option>
                        ))}
                      </motion.select>
                      <Users className="absolute left-3 top-3.5 h-4 w-4 text-orange-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg"
                  type="submit"
                >
                  <Search className="h-4 w-4" />
                  <span>Search Rooms</span>
                </motion.button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Hotel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <motion.div
              key={hotel.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-gray-600">{hotel.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{hotel.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-600">{hotel.pricePerNight}</span>
                  <span className="text-sm text-gray-500">per night</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center"
        >
          <motion.a
            href="/rooms"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-white text-orange-600 px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span>View More Rooms</span>
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HotelBookingSystem;
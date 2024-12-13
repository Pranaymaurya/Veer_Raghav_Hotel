"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBed, FaUsers, FaWifi, FaCocktail, FaSwimmingPool, FaCoffee } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { BsStarFill } from 'react-icons/bs';
import { MdFilterList } from 'react-icons/md';
import { rooms } from '../data/room';
import ImageSlider from './components/ImageSlider';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function RoomsPage() {
  const router = useRouter();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    type: '',
    capacity: '',
    amenities: [],
    startDate: null,
    endDate: null,
  });

  const availableAmenities = [...new Set(rooms.flatMap(room => room.amenities))];

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value }));
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const priceWithinRange = room.price <= filters.priceRange[1];
      const typeMatches = filters.type === '' || room.type === filters.type;
      const capacityMatches = filters.capacity === '' || room.capacity >= parseInt(filters.capacity);
      const amenitiesMatch = filters.amenities.every(amenity => room.amenities.includes(amenity));
      const searchMatches = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || room.description.toLowerCase().includes(searchQuery.toLowerCase()) || room.amenities.some(amenity => amenity.toLowerCase().includes(searchQuery.toLowerCase()));

      return priceWithinRange && typeMatches && capacityMatches && amenitiesMatch && searchMatches;
    });
  }, [rooms, searchQuery, filters]);

  const sortedRooms = useMemo(() => {
    return [...filteredRooms].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'capacity') {
        return a.capacity - b.capacity;
      }
      return 0;
    });
  }, [filteredRooms, sortBy]);

  const filteredAndSortedRooms = sortedRooms;

  const handleRoomClick = (roomId) => {
    router.push(`/rooms/${roomId}?startDate=${filters.startDate?.toISOString()}&endDate=${filters.endDate?.toISOString()}&guests=${filters.capacity}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-orange-50 roooms"
    >
      <header className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16 px-4" style={{ zIndex: 1 }}>
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Discover Our Rooms</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            Find the perfect room that matches your style, comfort, and budget
          </p>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  selectsStart
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  selectsEnd
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  minDate={filters.startDate}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                >
                  <option value="">All Types</option>
                  <option value="Suite">Suite</option>
                  <option value="Room">Room</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <select
                  value={filters.capacity}
                  onChange={(e) => handleFilterChange('capacity', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                >
                  <option value="">Any</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <div className="container mx-auto px-4 py-12" style={{ zIndex: -1 }}>
        {/* Mobile Filter Toggle */}
        <motion.div 
          className="md:hidden mb-6"
          whileTap={{ scale: 0.95 }}
        >
          <button 
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full bg-orange-500 text-white py-3 rounded-lg flex items-center justify-center"
          >
            <MdFilterList className="w-6 h-6 mr-2" />
            {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(isMobileFilterOpen || !isMobileFilterOpen) && (
              <motion.div 
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`
                  md:col-span-1 
                  ${isMobileFilterOpen ? 'block' : 'hidden'} md:block 
                  bg-white rounded-xl shadow-lg p-6 
                  fixed inset-0 z-50 md:static md:z-auto overflow-y-auto
                `}
              >
                <div className="flex justify-between items-center mb-6 md:hidden">
                  <h2 className="text-2xl font-semibold text-gray-800">Filters</h2>
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-orange-600"
                  >
                    <IoMdClose className="w-6 h-6" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="mb-6">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <input 
                      id="search"
                      type="text" 
                      placeholder="Search rooms, amenities, price..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex items-center space-x-4">
                    <input 
                      id="price-range"
                      type="range" 
                      min="0" 
                      max="500" 
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-900">₹{filters.priceRange[1]}</span>
                  </div>
                </div>

                {/* Room Type */}
                <div className="mb-6">
                  <label htmlFor="room-type" className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <div className="relative">
                    <select 
                      id="room-type"
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none transition-all duration-200"
                    >
                      <option value="">All Types</option>
                      <option value="Suite">Suite</option>
                      <option value="Room">Room</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Capacity */}
                <div className="mb-6">
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <div className="relative">
                    <select 
                      id="guests"
                      value={filters.capacity}
                      onChange={(e) => handleFilterChange('capacity', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none transition-all duration-200"
                    >
                      <option value="">Any Capacity</option>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  {availableAmenities.map(amenity => (
                    <div key={amenity} className="flex items-center mb-2">
                      <input 
                        type="checkbox" 
                        id={amenity}
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => {
                          const newAmenities = filters.amenities.includes(amenity)
                            ? filters.amenities.filter(a => a !== amenity)
                            : [...filters.amenities, amenity];
                          handleFilterChange('amenities', newAmenities);
                        }}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor={amenity} className="ml-2 text-sm text-gray-700 flex items-center">
                        <span className="ml-2">{amenity}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rooms Grid */}
          <div className="md:col-span-3">
            {/* Sorting and Results Count */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row justify-between items-center mb-8"
            >
              <div className="flex items-center space-x-4 w-full">
                <span className="text-gray-600">
                  {filteredAndSortedRooms.length} rooms found
                </span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none transition-all duration-200"
                  >
                    <option value="price">Sort by Price</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="capacity">Sort by Capacity</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {filteredAndSortedRooms.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16 bg-white rounded-xl shadow-lg"
              >
                <p className="text-2xl text-gray-500">No rooms match your search</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAndSortedRooms.map((room) => (
                  <motion.div 
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                    onClick={() => handleRoomClick(room.id)}
                  >
                    <div className="relative">
                      <ImageSlider images={room.image} />
                      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold text-orange-600 z-10">
                        {room.type}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2 text-orange-800">{room.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{room.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <BsStarFill className="w-5 h-5 text-yellow-400 mr-1" />
                          <span className="text-gray-700 font-semibold">{room.rating}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUsers className="mr-1" />
                          <span>Sleeps {room.capacity}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mb-4 overflow-x-auto">
                        {room.amenities.slice(0, 3).map(amenity => (
                          <span 
                            key={amenity} 
                            className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-full whitespace-nowrap flex items-center"
                          >
  
                            <span className="ml-1">{amenity}</span>
                          </span>
                        ))}
                      </div>
                      <div className="text-black px-3 py-1 rounded-full my-2 text-lg font-semibold">
                        ₹{room.price} /night
                      </div>
                      <Link
                        href={`/rooms/${room.id}`}
                        className="block w-full text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


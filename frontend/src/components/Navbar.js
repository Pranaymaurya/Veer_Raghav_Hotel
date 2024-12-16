"use client";
import { FiAlignJustify, FiX, FiUser, FiLogOut, FiSettings, FiBookOpen } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "typewriter-effect";
import Link from "next/link";
import { LiaPrayingHandsSolid } from "react-icons/lia";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Adjust the import path as needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const linkStyle =
    "py-3 px-4 text-[#FF9933] hover:bg-[#FF9933] hover:text-white transition duration-200 rounded-md";
  const activeLinkStyle =
    "py-3 px-4 border-b border-[#BF6D00] text-[#FF9933] hover:bg-[#FF9933] hover:text-white transition duration-200 rounded-md relative cursor-pointer border-double";

  const getLinkClass = (path) => {
    return pathname === path ? activeLinkStyle : linkStyle;
  };

  const menuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="bg-white shadow-lg ">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <div className="items-center text-[#FF9933] pr-5">
              <h1 className="text-xl font-bold">Veer Raghav</h1>
              <motion.div className="flex ml-4">
                <Typewriter
                  options={{
                    strings: ["Welcome", "स्वागत", "ਸੁਆਗਤ ਹੈ", "સ્વાગત છે"],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                  }}
                />
                <LiaPrayingHandsSolid size={25} className="ml-2" />
              </motion.div>
            </div>
          </Link>
          <div className="hidden md:flex flex-grow justify-end items-center space-x-4">
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link href="/gallary" className={getLinkClass("/gallary")}>
              Gallery
            </Link>
            <Link href="/rooms" className={getLinkClass("/rooms")}>
              Rooms
            </Link>
            <Link href="/contact" className={getLinkClass("/contact")}>
              Contact
            </Link>

            {user ? (
              <div className="relative" style={{ zIndex: 99 }}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center roooms hover:bg-[#FF9933] hover:text-white py-2 px-4 rounded-md transition duration-200 "
                >
                  <FiUser className="mr-2" />
                  {user.name || user.email}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg roooms">
                    {user.role === "admin" ? (
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                    <div>
                      <Link
                        href="/bookings"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiBookOpen className="mr-2" /> My Bookings
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiSettings className="mr-2" /> Settings
                      </Link>
                    </div>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="bg-[#FF9933] text-white py-2 px-4 rounded-md hover:bg-[#BF6D00] transition duration-200">
                  Login
                </Link>
                <Link href="/signup" className="bg-white text-[#FF9933] border border-[#FF9933] py-2 px-4 rounded-md hover:bg-[#FF9933] hover:text-white transition duration-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center justify-end">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-button focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <FiX color="orange" size={25} />
              ) : (
                <FiAlignJustify color="orange" size={25} />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden bg-white overflow-hidden"
            >
              <div className="flex flex-col space-y-2 p-4">
                <Link href="/" className={getLinkClass("/")} onClick={() => setIsOpen(false)}>
                  Home
                </Link>
                <Link href="/gallary" className={getLinkClass("/gallary")} onClick={() => setIsOpen(false)}>
                  Gallery
                </Link>
                <Link href="/rooms" className={getLinkClass("/rooms")} onClick={() => setIsOpen(false)}>
                  Rooms
                </Link>
                <Link href="/contact" className={getLinkClass("/contact")} onClick={() => setIsOpen(false)}>
                  Contact
                </Link>

                {user ? (
                  <>
                    <Link
                      href="/bookings"
                      className="flex items-center py-2 px-4 text-[#FF9933] hover:bg-[#FF9933] hover:text-white rounded-md transition duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiBookOpen className="mr-2" /> My Bookings
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center py-2 px-4 text-[#FF9933] hover:bg-[#FF9933] hover:text-white rounded-md transition duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiSettings className="mr-2" /> Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full text-left py-2 px-4 text-[#FF9933] hover:bg-[#FF9933] hover:text-white rounded-md transition duration-200"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="bg-[#FF9933] text-white py-2 px-4 rounded-md hover:bg-[#BF6D00] transition duration-200 text-center" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                    <Link href="/signup" className="bg-white text-[#FF9933] border border-[#FF9933] py-2 px-4 rounded-md hover:bg-[#FF9933] hover:text-white transition duration-200 text-center" onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  );
};

export default Navbar;
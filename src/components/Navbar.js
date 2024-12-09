"use client";
import { FiAlignJustify } from "react-icons/fi";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import Link from "next/link";
import { LiaPrayingHandsSolid } from "react-icons/lia";
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  const linkStyle =
    "py-3 px-4 text-[#FF9933] hover:bg-[#FF9933] hover:text-white transition duration-200 rounded-md";
  const activeLinkStyle =
    "py-3 px-4 border-b-2 border-[#BF6D00] bg-[#FF9933] relative cursor-pointer border-double rounded-md text-white";

  const getLinkClass = (path) => {
    return pathname === path ? activeLinkStyle : linkStyle;
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="bg-white shadow-lg z-50">
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
            <Link
              href="/"
              className={getLinkClass("/")}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/gallary"
              className={getLinkClass("/gallary")}
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/rooms"
              className={getLinkClass("/rooms")}
              onClick={() => setIsOpen(false)}
            >
              Rooms
            </Link>
            <Link
              href="/contact"
              className={getLinkClass("/contact")}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>

          <div className="md:hidden flex items-center justify-end">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-button focus:outline-none"
            >
              <FiAlignJustify color="orange" size={25} />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={
            isOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }
          }
          transition={{ duration: 0.3 }}
          className={`${isOpen ? "block" : "hidden"} md:hidden bg-white`}
        >
          <div className="flex flex-col space-y-2 p-4 justify-end">
            <Link
              href="/"
              className={getLinkClass("/")}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/gallary"
              className={getLinkClass("/gallary")}
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/rooms"
              className={getLinkClass("/rooms")}
              onClick={() => setIsOpen(false)}
            >
              Rooms
            </Link>
            <Link
              href="/contact"
              className={getLinkClass("/contact")}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </nav>
    </motion.div>
  );
};

export default Navbar;

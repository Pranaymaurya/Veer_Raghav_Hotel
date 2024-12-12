import React from 'react'
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";

function Rooms() {
    const testimonials = [
        {
          quote: "Premium Room",
          image: "/image/room3.jpeg"
        },
        {
          quote: "Supar Deluxe",
          image: "/image/room8.jpeg"
        },
        {
          quote: "Deluxe",
          image: "/image/room15.jpeg"
        },
        {
          quote: "Single Room",
          image: "/image/room7.jpeg"
        },
      ];
      
      
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white  dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <h1 className="font-serif font-bold text-4xl bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-transparent bg-clip-text flex items-center justify-center m-10">Room Available</h1>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  )
}


export default Rooms

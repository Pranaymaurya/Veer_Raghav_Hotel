"use client";

import React from "react";
import "@/components/HeroSection.css"
import { LayoutGridCard } from "@/components/ui/layout-grid";
import AnimatedCursor from "react-animated-cursor";
// Define the skeleton components first
const SkeletonOne = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">
      House in the woods
    </p>
    <p className="font-normal text-base text-white"></p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      A serene and tranquil retreat, this house in the woods offers a peaceful
      escape from the hustle and bustle of city life.
    </p>
  </div>
);

const SkeletonTwo = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">
      House above the clouds
    </p>
    <p className="font-normal text-base text-white"></p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      Perched high above the world, this house offers breathtaking views and a
      unique living experience. It&apos;s a place where the sky meets home, and
      tranquility is a way of life.
    </p>
  </div>
);

const SkeletonThree = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">Greens all over</p>
    <p className="font-normal text-base text-white"></p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      A house surrounded by greenery and nature&apos;s beauty. It&apos;s the
      perfect place to relax, unwind, and enjoy life.
    </p>
  </div>
);

const SkeletonFour = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">
      Rivers are serene
    </p>
    <p className="font-normal text-base text-white"></p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      A house by the river is a place of peace and tranquility. It&apos;s the
      perfect place to relax, unwind, and enjoy life.
    </p>
  </div>
);

function Page() {
  // Define the cards array with unique IDs
  const cards = [
    {
      id: 1,
      content: <SkeletonOne />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/hotel3.jpeg",
    },
    {
      id: 2,
      content: <SkeletonTwo />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room3.jpeg",
    },
    {
      id: 3,
      content: <SkeletonThree />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room8.jpeg",
    },
    {
      id: 4,
      content: <SkeletonFour />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/hotel4.jpeg",
    },
    {
      id: 5,
      content: <SkeletonOne />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/hotel2.jpeg",
    },
    {
      id: 6,
      content: <SkeletonTwo />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room3.jpeg",
    },
    {
      id: 7,
      content: <SkeletonThree />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room3.jpeg",
    },
    {
      id: 8,
      content: <SkeletonFour />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/hotel5.jpeg",
    },
    {
      id: 9,
      content: <SkeletonOne />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/hotel6.jpeg",
    },
    {
      id: 10,
      content: <SkeletonTwo />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room7.jpeg",
    },
    {
      id: 10,
      content: <SkeletonThree />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/hotel8.jpeg",
    },
    {
      id: 11,
      content: <SkeletonFour />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/room8.jpeg",
    },
    {
      id: 12,
      content: <SkeletonOne />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/room11.jpeg",
    },
    {
      id: 12,
      content: <SkeletonTwo />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room15.jpeg",
    },
    {
      id: 13,
      content: <SkeletonThree />,
      className: "col-span-1 animateCard",
      thumbnail: "/image/room17.jpeg",
    },
    {
      id: 14,
      content: <SkeletonFour />,
      className: "md:col-span-2 animateCard",
      thumbnail: "/image/room17.jpeg",
    },
  ];

  return (
    
    <div className="bg-white w-screen">
      {/* <AnimatedCursor
        innerSize={8}
        outerSize={25}
        // RGB values for white color
        color="255, 165, 0"
        outerAlpha={0.2}
        innerScale={0.7}
        outerScale={2}
        clickables={[
          'a',
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.link',
        ]}
      /> */}
    <div className="h-[350vh] bg-white py-20 w-full flex flex-col items-center justify-center max-w-screen-xl mx-auto px-4">
      <h1 className="font-serif font-bold text-4xl bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-transparent bg-clip-text flex items-center justify-center">
        Gallery
      </h1>
      <LayoutGridCard cards={cards} />
    </div>
    </div>
  );
}

export default Page;

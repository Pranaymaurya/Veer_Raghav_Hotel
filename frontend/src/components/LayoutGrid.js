'use client';
import React from "react";
import { LayoutGridCard } from "../components/ui/layout-grid";
import Link from "next/link";

export function LayoutGrid() {
  return (
    (<div className="h-screen py-20 w-full flex flex-col items-center justify-center max-w-screen-xl mx-auto px-4">
      <h1 className="font-serif font-bold text-4xl bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-transparent bg-clip-text flex items-center justify-center">Gallary</h1>
      <LayoutGridCard cards={cards} />
      <Link href={"/gallary"}>
      <button className="font-merriweather font-semibold text-lg text-white bg-gradient-to-r from-[#FF9933] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FF9933] px-6 py-2 rounded-lg ">More..</button>
      </Link>
    </div>)
  );
}

const SkeletonOne = () => {
  return (
    (<div>
      <p className="font-bold md:text-4xl text-xl text-white">
        House in the woods
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A serene and tranquil retreat, this house in the woods offers a peaceful
        escape from the hustle and bustle of city life.
      </p>
    </div>)
  );
};

const SkeletonTwo = () => {
  return (
    (<div>
      <p className="font-bold md:text-4xl text-xl text-white">
        House above the clouds
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Perched high above the world, this house offers breathtaking views and a
        unique living experience. It&apos;s a place where the sky meets home,
        and tranquility is a way of life.
      </p>
    </div>)
  );
};
const SkeletonThree = () => {
  return (
    (<div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Greens all over
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A house surrounded by greenery and nature&apos;s beauty. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>)
  );
};
const SkeletonFour = () => {
  return (
    (<div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Rivers are serene
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A house by the river is a place of peace and tranquility. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>)
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2 animateCard",
    thumbnail:
      "/image/hotel3.jpeg",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1 animateCard",
    thumbnail:
      "/image/room5.jpeg",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1 animateCard",
    thumbnail:
      "/image/room8.jpeg"
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2 animateCard",
    thumbnail:
    "/image/hotel4.jpeg"
  },
];

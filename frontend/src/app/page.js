'use client';
import { useState, useEffect } from "react";
import CustomCursor from "@/components/Customcourser";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import AnimatedCursor from "react-animated-cursor";
import SparkleEffect from "@/components/Customcourser";
// import ContactSection from "@/app/contact/page";
import HeroSection from "@/components/HeroSection";
import { LayoutGrid } from "@/components/LayoutGrid";
import TextAnimation from "@/components/TextAnimation";
import Rooms from "@/components/Rooms";
import AnimationPage from "@/components/animation"; 
import Hmap from "@/components/Hmap";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <>
      {loading ? (
        <AnimationPage />
      ) : (
     <div className="bg-[#FFFFFF]">
      <SparkleEffect/>
      <AnimatedCursor
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
      />
      <HeroSection />
      <LayoutGrid />
      <TextAnimation />
      <Rooms />
      <Hmap />
      </div>
        
          
      )}
    </>
  );
}

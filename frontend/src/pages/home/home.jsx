import React from 'react'
import HeroSection from '@/components/HeroSection'
import Hmap from '@/components/Hmap'
// import { LayoutGrid } from '@/components/LayoutGrid'
import Rooms from '@/components/Rooms'
import TextAnimation from '@/components/TextAnimation'
import HotelBookingForm from '@/components/SearchBar'
import ReviewSlider from '@/components/Review'
import ImageSliderCards from '@/components/Imageslider'

const Home = () => {
    return (
        <div>
            <HeroSection />
            <HotelBookingForm/>
            <ImageSliderCards/>
            {/* <LayoutGrid /> */}
            <TextAnimation />
            <ReviewSlider/>
            {/* <Rooms /> */}
            <Hmap />
        </div>
    )
}

export default Home
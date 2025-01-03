import React from 'react'

import HeroSection from '@/components/HeroSection'
import LayoutGrid from '@/components/LayoutGrid'
import Hmap from '@/components/Hmap'
// import { LayoutGrid } from '@/components/LayoutGrid'
import Rooms from '@/components/Rooms'
import TextAnimation from '@/components/TextAnimation'
import HotelBookingForm from '@/components/SearchBar'

const Home = () => {
    return (
        <div>
            <HeroSection />
            <HotelBookingForm/>
            <LayoutGrid />
            <TextAnimation />
            <Rooms />
            <Hmap />
        </div>
    )
}

export default Home
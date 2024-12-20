import React from 'react'

import HeroSection from '@/components/HeroSection'
import LayoutGrid from '@/components/LayoutGrid'
import Hmap from '@/components/Hmap'
// import { LayoutGrid } from '@/components/LayoutGrid'
import Rooms from '@/components/Rooms'
import TextAnimation from '@/components/TextAnimation'

const Home = () => {
    return (
        <div>
            <HeroSection />
            <LayoutGrid />
            <TextAnimation />
            <Rooms />
            <Hmap />
        </div>
    )
}

export default Home
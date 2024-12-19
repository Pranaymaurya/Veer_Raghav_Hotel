import React, { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import Navbar from './components/Navbar'
import { Link, Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import AnimationPage from './components/animation'

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>{loading ? (
      <AnimationPage />
    ) : (
      <>
        <Navbar />
          <Outlet />
        <Footer />
      </>
    )}

    </div>
  )
}

export default App
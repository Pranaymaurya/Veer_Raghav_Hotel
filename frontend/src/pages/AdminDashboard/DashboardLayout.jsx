import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { X } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
// import { SettingsProvider } from './SettingsContext';

const DashboardLayout = () => {
    const { user } = useAuth();
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!user || user.role !== 'admin') {
    //         navigate('/auth/login');
    //     }
    // }, [user, navigate]);

    if (!user) {
        return null; // Render nothing while redirecting
    }

    if (user.role !== 'admin') {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p className='text-red-500 text-5xl'>You are not authorized to access this page.</p>
            </div>
        );
    }


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call once to set initial state
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar for Mobile and Desktop */}
                <aside
                    className={`
                    fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg 
                    transform transition-transform duration-300 ease-in-out 
                    lg:relative lg:translate-x-0 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                >
                    {/* Mobile Close Button */}
                    <button
                        className="lg:hidden absolute top-4 right-4 z-60"
                        onClick={toggleSidebar}
                    >
                        <X className="h-6 w-6 text-gray-600" />
                    </button>

                    <div className="h-full flex flex-col ">
                        <Sidebar />
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex w-full flex-col overflow-hidden">
                    <div className='px-4 sm:px-6 lg:px-8'>
                        <Header title="Admin Dashboard" onClick={setIsSidebarOpen} />
                    </div>

                    {/* Page Content */}
                    <main className="flex-grow overflow-y-auto border-t">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <Outlet />
                        </div>
                    </main>
                </div>

                {/* Overlay for Mobile Sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )}
            </div>
        </>

    )
}

export default DashboardLayout
'use client'

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();


    //   console.log(user.role);


    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p className='text-red-500 text-5xl'>You are not authorized to access this page.</p>
            </div>
        )
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p>Welcome, Admin {user.name}!</p>
            {/* Add your admin dashboard content here */}
        </div>
    );
}


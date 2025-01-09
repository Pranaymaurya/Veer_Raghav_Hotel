import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCharts from '../components/DashboardCharts';
import RecentActivity from '../components/RecentActivity';
import { Loader2 } from 'lucide-react';
import { useAdminContext } from '@/context/AdminContext';

const DashboardContent = () => {
  const { fetchDashboardStats, dashboardStats, getBookingsPercentage,
    Percentage} = useAdminContext();

  useEffect(() => {
    fetchDashboardStats();
    getBookingsPercentage();
  }, []);

  const statsCards = [
    {
      title: 'Total Bookings',
      value: dashboardStats?.totalBookings || 0,
      change: Percentage?.bookingPercentage || 0,
      textColor: 'text-orange-600'
    },
    {
      title: 'Total Guests',
      value: dashboardStats?.totalGuests || 0,
      change: Percentage?.guestPercentage || 0,
      textColor: 'text-green-600'
    },
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers || 0,
      change: Percentage?.userPercentage || 0,
      textColor: 'text-red-600'
    },
    {
      title: 'Revenue',
      value: `₹${dashboardStats?.revenue?.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0}`,
      change: Percentage?.revenuePercentage || 0,
      textColor: 'text-blue-600'
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <Card key={index} className={card.bgColor}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}
              </div>
              <p className={`text-xs ${card.textColor}`}>
                {card.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <DashboardCharts dashboardStats={dashboardStats} />
      <RecentActivity recentBookings={dashboardStats?.recentBookings} />
    </div>
  );
};

export default DashboardContent;
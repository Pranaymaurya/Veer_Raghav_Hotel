import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, CheckCircle, Clock } from 'lucide-react';

const RecentActivity = () => {
  // Sample data for recent bookings
  const recentBookings = [
    {
      id: 1,
      guestName: "Emma Thompson",
      roomType: "Deluxe Suite",
      checkIn: "2024-12-26",
      status: "Confirmed",
      amount: "420"
    },
    {
      id: 2,
      guestName: "John Martinez",
      roomType: "Standard Room",
      checkIn: "2024-12-27",
      status: "Pending",
      amount: "180"
    },
    {
      id: 3,
      guestName: "Sarah Wilson",
      roomType: "Family Room",
      checkIn: "2024-12-28",
      status: "Confirmed",
      amount: "340"
    }
  ];

  // Sample data for recent guests
  const recentGuests = [
    {
      id: 1,
      name: "Michael Brown",
      checkIn: "2024-12-24",
      roomNumber: "304",
      duration: "3 nights"
    },
    {
      id: 2,
      name: "Lisa Chen",
      checkIn: "2024-12-24",
      roomNumber: "215",
      duration: "5 nights"
    },
    {
      id: 3,
      name: "David Kim",
      checkIn: "2024-12-23",
      roomNumber: "412",
      duration: "2 nights"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Recent Bookings Card */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{booking.guestName}</p>
                  <p className="text-sm text-gray-500">{booking.roomType}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium text-gray-900">₹ {booking.amount}</p>
                  <span 
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                      {booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Guests Card */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-green-500" />
            Recent Guests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentGuests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{guest.name}</p>
                  <p className="text-sm text-gray-500">Room {guest.roomNumber}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {guest.duration}
                  </div>
                  <p className="text-xs text-gray-500">Check-in: {guest.checkIn}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivity;
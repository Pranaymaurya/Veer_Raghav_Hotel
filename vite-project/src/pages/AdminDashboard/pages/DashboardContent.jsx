import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardContent = () => {
  const statsCards = [
    { 
      title: 'Total Bookings', 
      value: '254', 
      change: '+12%', 
      bgColor: 'bg-orange-50', 
      textColor: 'text-orange-600' 
    },
    { 
      title: 'Occupancy Rate', 
      value: '75%', 
      change: '+5%', 
      bgColor: 'bg-green-50', 
      textColor: 'text-green-600' 
    },
    { 
      title: 'Revenue', 
      value: '$45,230', 
      change: '+8%', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600' 
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <Card key={index} className={`${card.bgColor}`}>
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
    </div>
  );
};

export default DashboardContent;
import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Bed, 
  Users, 
  Star, 
  Search 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Link, useNavigate } from 'react-router-dom';

// Assuming you have a similar data structure
import { rooms } from '@/data/room';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import ImageSlider from './components/ImageSlider';

export default function RoomsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 1500],
    type: '',
    capacity: '',
    amenities: [],
    startDate: null,
    endDate: null,
  });

  // Handle guest input change with validation
  const handleGuestChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 10)) {
        setFilters(prev => ({ ...prev, capacity: value }));
      }
    }
  };

  // Handle price range change
  const handlePriceRangeChange = (value) => {
    setFilters(prev => ({ 
      ...prev, 
      priceRange: [value[0], value[1]]
    }));
  };

  // Memoized filtered and sorted rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // Price range filter - check if room price is within the selected range
      const priceMatch = room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1];
      
      // Other filters
      const typeMatch = !filters.type || room.type === filters.type;
      const capacityMatch = !filters.capacity || room.capacity >= parseInt(filters.capacity);
      const amenitiesMatch = filters.amenities.length === 0 || 
        filters.amenities.every(amenity => room.amenities.includes(amenity));
      
      // Search query
      const searchMatch = !searchQuery || 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.amenities.some(amenity => 
          amenity.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return priceMatch && typeMatch && capacityMatch && amenitiesMatch && searchMatch;
    });
  }, [rooms, searchQuery, filters]);

  // Rest of the helper functions
  const calculateDynamicPrice = (basePrice, nights) => {
    if (nights >= 5) return Math.round(basePrice * nights * 0.9);
    if (nights > 1) return Math.round(basePrice * nights * 0.95);
    return basePrice * nights;
  };

  const calculateNights = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const getDateRangeText = () => {
    if (filters.startDate && filters.endDate) {
      return `${format(filters.startDate, 'PP')} - ${format(filters.endDate, 'PP')}`;
    }
    return "Select Dates";
  };

  const handleRoomClick = (roomId) => {
    const queryParams = new URLSearchParams();

    if (filters.startDate) {
      queryParams.append('startDate', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      queryParams.append('endDate', filters.endDate.toISOString());
    }
    if (filters.capacity) {
      queryParams.append('guests', filters.capacity);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `/rooms/${roomId}?${queryString}`
      : `/rooms/${roomId}`;

    navigate(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Find Your Perfect Room
          </CardTitle>
          <CardDescription>
            Discover comfortable and stylish accommodations tailored to your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {/* Date Picker */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {getDateRangeText()}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Check-in and Check-out Dates</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode="range"
                  selected={{
                    from: filters.startDate,
                    to: filters.endDate
                  }}
                  onSelect={(range) => {
                    setFilters(prev => ({
                      ...prev,
                      startDate: range?.from,
                      endDate: range?.to
                    }));
                  }}
                />
              </DialogContent>
            </Dialog>

            {/* Room Type */}
            <Select 
              value={filters.type} 
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Suite">Suite</SelectItem>
                <SelectItem value="Room">Room</SelectItem>
              </SelectContent>
            </Select>

            {/* Guests Input */}
            {/* <div className="relative">
              <Input
                type="text"
                placeholder="Number of guests"
                value={filters.capacity}
                onChange={handleGuestChange}
                className="pr-10"
              />
              <Users className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div> */}

            {/* Search */}
            <div className="relative">
              <Input 
                placeholder="Search rooms" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <Label>Price Range:</Label>
              <div className="text-sm text-muted-foreground">
                ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
              </div>
            </div>
            <Slider
              defaultValue={[0, 1500]}
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              min={0}
              max={1500}
              step={50}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card 
            key={room.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <ImageSlider images={room.images} />
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{room.name}</h3>
                <div className="flex items-center text-yellow-500">
                  <Star className="mr-1 w-4 h-4 fill-current" />
                  <span>{room.rating}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{room.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-2 w-4 h-4" />
                  <span>{room.capacity} Guests</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Bed className="mr-2 w-4 h-4" />
                  <span>{room.type}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                {room.amenities.slice(0, 3).map(amenity => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">
                  ₹{calculateDynamicPrice(
                    room.price, 
                    filters.startDate && filters.endDate 
                      ? calculateNights(filters.startDate, filters.endDate) 
                      : 1
                  )}
                </div>
                <Button onClick={() => handleRoomClick(room.id)} className="bg-orange-600">Book Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Rooms Found */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h4 className="text-2xl mb-4">No Rooms Found</h4>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
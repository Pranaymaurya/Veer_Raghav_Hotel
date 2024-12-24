import React, { useState, useMemo, useEffect } from 'react';
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
// import { rooms } from '@/data/room';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import ImageSlider from './components/ImageSlider';
import { useRoom } from '@/context/RoomContext';
import { useAuth } from '@/hooks/useAuth';

export default function RoomsPage() {
  const navigate = useNavigate();
  const { Rooms, getAllRooms, getImageUrl } = useRoom();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  // console.log(user);
  
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    type: "",
    capacity: "",
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    getAllRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    if (!Rooms.length) return [];
    return Rooms.filter(room => {
      const priceMatch = room.pricePerNight >= filters.priceRange[0] &&
        room.pricePerNight <= filters.priceRange[1];
      const typeMatch = !filters.type || room.type.toLowerCase() === filters.type.toLowerCase();
      const capacityMatch = !filters.capacity ||
        room.maxOccupancy >= parseInt(filters.capacity || "0");
      const searchMatch = !searchQuery ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.amenities.some(amenity =>
          amenity.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return priceMatch && typeMatch && capacityMatch && searchMatch;
    });
  }, [Rooms, filters, searchQuery]);

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
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Find Your Perfect Room
          </CardTitle>
          <CardDescription>
            Discover comfortable and stylish accommodations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {filters.startDate && filters.endDate
                    ? `${format(filters.startDate, 'PP')} - ${format(filters.endDate, 'PP')}`
                    : "Select Dates"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Dates</DialogTitle>
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

            <Select
              value={filters.type}
              onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Suite">Suite</SelectItem>
                <SelectItem value="Room">Room</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Input
                placeholder="Search rooms"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Price Range:</Label>
              <span className="text-sm text-gray-500">
                ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 5000]}
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
              min={0}
              max={5000}
              step={50}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room._id} className="hover:shadow-lg transition-shadow">
            <ImageSlider images={room.images} />
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{room.name}</h3>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1">{room.rating || "New"}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm">{room.description}</p>

              <div className="flex items-center justify-between text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{room.maxOccupancy} Guests</span>
                </div>
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-2" />
                  <span>{room.name}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {room.amenities.map(amenity => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">
                  ₹ {calculateDynamicPrice(
                    room.pricePerNight,
                    calculateNights(filters.startDate, filters.endDate)
                  )} <span className='text-sm font-normal'>/night</span>
                </div>
                <Button onClick={() => handleRoomClick(room._id)} className="bg-orange-600">Book Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <h4 className="text-2xl mb-4">No Rooms Found</h4>
          <p className="text-gray-600">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};
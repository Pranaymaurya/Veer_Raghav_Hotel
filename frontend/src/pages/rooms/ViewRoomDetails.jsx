import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import {
  Bed,
  Users,
  Star,
  ChevronLeft,
  Plus,
  Minus,
  Info,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { rooms } from '@/data/room';
import ImageSlider from './components/ImageSlider';

export default function ViewRoomDetails() {
  // Extract roomId from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();


  // Use search params to get initial date and guests
  const [searchParams] = useSearchParams();

  // Find the room based on the ID from URL
  const room = rooms.find(r => r.id === id);

  console.log(id);


  // Initialize state with search params or defaults
  const [guests, setGuests] = useState(() => {
    const guestsParam = searchParams.get('guests');
    return guestsParam ? parseInt(guestsParam) : 1;
  });

  const [date, setDate] = useState(() => {
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    if (startDateParam && endDateParam) {
      return {
        from: new Date(startDateParam),
        to: new Date(endDateParam)
      };
    }

    return {
      from: new Date(),
      to: new Date()
    };
  });

  const [roomCount, setRoomCount] = useState(1);
  const [dateError, setDateError] = useState('');

  // Add early return if room is not found
  if (!room) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Room Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The room you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => navigate('/rooms')}>
              Back to Rooms
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Wrap useEffect to handle date and room count calculations
  useEffect(() => {
    if (room && date.from && date.to) {
      const days = differenceInDays(date.to, date.from);

      if (days <= 0) {
        setDateError('Check-out date must be after check-in date');
      } else {
        setDateError('');
        // Safely calculate room count with default capacity
        setRoomCount(Math.ceil(guests / (room.capacity || 1)));
      }
    }
  }, [date, guests, room?.capacity]);

  const calculatePrice = () => {
    if (!date.from || !date.to || !room) return 0;
    const nights = differenceInDays(date.to, date.from);
    // Use default values if room or capacity is undefined
    return room.price * nights * Math.ceil(guests / (room.capacity || 1));
  };

  const getRoomQuality = (rating) => {
    if (rating > 4.5) return "Excellent";
    if (rating > 4) return "Very Good";
    if (rating >= 3.5) return "Good";
    return "Okay";
  };

  const handleBookNow = () => {
    if (!date.from || !date.to || !room) return;
    const nights = differenceInDays(date.to, date.from);
    const price = calculatePrice();
    const booking = {
      roomId: room.id,
      roomName: room.name,
      roomType: room.type,
      roomCapacity: room.capacity,
      roomPrice: room.price,
      startDate: date.from,
      endDate: date.to,
      guests: guests,
      nights,
      price,
    };
    navigate(`/booking/${room.id}`, { state: { booking } });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
          <Button
            variant="link"
            onClick={() => navigate('/rooms')}
            className="pl-0 text-gray-600 hover:text-primary"
          >
            <ChevronLeft className="mr-2" /> Back to Rooms
          </Button>
        </div>
        <div className="flex items-center">
          <Star className="text-yellow-500 mr-2" />
          <span className="font-semibold">{room.rating}</span>
          <span className="text-gray-500 ml-2">
            ({getRoomQuality(room.rating)})
          </span>
        </div>
      </div>

      {/* Room Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Carousel */}
        <div className="relative">
          <ImageSlider images={room.images} />
        </div>

        {/* Booking Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Book Your Stay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Room Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 flex items-center">
                  <Bed className="mr-2 text-primary" /> Room Type
                </h3>
                <p className="text-gray-600">{room.type}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 flex items-center">
                  <Users className="mr-2 text-primary" /> Capacity
                </h3>
                <p className="text-gray-600">{room.capacity} Guests</p>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Stay Dates
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date.from && "text-muted-foreground"
                    )}
                  >
                    {date.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              {dateError && (
                <div className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {dateError}
                </div>
              )}
            </div>

            {/* Guests and Rooms */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Guests
                </label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4">{guests}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setGuests(guests + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rooms Required
                </label>
                <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md">
                  {roomCount}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Total Price */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-xl font-bold text-primary mr-2">
                  ₹{calculatePrice()}
                </span>
                <Info
                  className="text-gray-500 h-4 w-4"
                  title="Total price for selected stay duration"
                />
              </div>
              <Button
                disabled={!!dateError}
                onClick={handleBookNow}
                className="w-full max-w-xs"
              >
                Book Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
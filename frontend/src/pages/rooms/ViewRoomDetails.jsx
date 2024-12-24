import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { Bed, Users, Star, ChevronLeft, Plus, Minus, Info, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRoom } from '@/context/RoomContext';
import ImageSlider from './components/ImageSlider';
import { useAuth } from '@/hooks/useAuth';

export default function ViewRoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useAuth();
  const { Rooms, getAllRooms } = useRoom();

  // State management
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState(() => {
    const guestsParam = searchParams.get('guests');
    return guestsParam ? parseInt(guestsParam) : 1;
  });
  const [date, setDate] = useState(() => {
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    return {
      from: startDateParam ? new Date(startDateParam) : new Date(),
      to: endDateParam ? new Date(endDateParam) : new Date()
    };
  });
  const [roomCount, setRoomCount] = useState(1);
  const [dateError, setDateError] = useState('');
  const [priceIncreased, setPriceIncreased] = useState(false);

  // Fetch all rooms and find the specific room
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        await getAllRooms();
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Find the current room from Rooms array
  const room = Rooms.find(room => room._id === id);

  // Handle date, guest, and room count calculations
  useEffect(() => {
    if (room && date.from && date.to) {
      const days = differenceInDays(date.to, date.from);

      if (days <= 0) {
        setDateError('Check-out date must be after check-in date');
      } else {
        setDateError('');
        const requiredRooms = Math.ceil(guests / room.maxOccupancy);
        setRoomCount(requiredRooms);
        setPriceIncreased(requiredRooms > 1);
      }
    }
  }, [date, guests, room?.maxOccupancy]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading room details...</p>
      </div>
    );
  }

  const handleLogin = () => {
    navigate('/auth/login');
  };

  // Room not found state
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

  const calculatePrice = () => {
    if (!date.from || !date.to || !room) return 0;
    const nights = differenceInDays(date.to, date.from);
    const basePrice = room.pricePerNight * nights;

    const requiredRooms = Math.ceil(guests / room.maxOccupancy);
    let totalPrice = basePrice * requiredRooms;

    // Apply dynamic pricing based on length of stay
    if (nights >= 5) return Math.round(totalPrice * 0.9); // 10% discount for 5+ nights
    if (nights > 1) return Math.round(totalPrice * 0.95); // 5% discount for 2-4 nights
    return totalPrice;
  };

  const getRoomQuality = (rating) => {
    if (!rating) return "Unrated";
    if (rating > 4.5) return "Excellent";
    if (rating > 4) return "Very Good";
    if (rating >= 3.5) return "Good";
    return "Okay";
  };

  // console.log(user);
  

  const handleBookNow = () => {
    if (!date.from || !date.to || !room) return;
    const nights = differenceInDays(date.to, date.from);
    const price = calculatePrice();
    const booking = {
      roomId: room._id,
      roomName: room.name,
      roomType: room.type,
      roomCapacity: room.maxOccupancy,
      roomPrice: room.pricePerNight,
      startDate: date.from,
      endDate: date.to,
      guests: guests,
      nights,
      price,
      roomCount,
    };
    navigate(`/booking/${room._id}`, { state: { booking } });
  };

  const handleGuestChange = (increment) => {
    const newGuestCount = Math.max(1, guests + increment);
    setGuests(newGuestCount);

    // Recalculate room count based on new guest count
    const newRoomCount = Math.ceil(newGuestCount / room.maxOccupancy);
    setRoomCount(newRoomCount);
    setPriceIncreased(newRoomCount > 1);
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
          <span className="font-semibold">{room.rating || "New"}</span>
          <span className="text-gray-500 ml-2">
            ({getRoomQuality(room.rating)})
          </span>
        </div>
      </div>

      {/* Room Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Carousel */}
        <div className="relative">
          {room.images && room.images.length > 0 ? (
            <ImageSlider images={room.images} />
          ) : (
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
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
                <p className="text-gray-600">{room.name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 flex items-center">
                  <Users className="mr-2 text-primary" /> Capacity
                </h3>
                <p className="text-gray-600">{room.maxOccupancy} Guests per room</p>
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
                    onClick={() => handleGuestChange(-1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4">{guests}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rooms Required
                </label>
                <div className="bg-orange-50 text-secondary-foreground px-4 py-2 rounded-md">
                  {roomCount}
                </div>
              </div>
            </div>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
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
            )}

            {/* Total Price */}
            <div className="space-y-2">
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
                {!user ?
                  <>
                  <Button
                      onClick={handleLogin}
                      className="w-full max-w-xs bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200"
                    >
                      Login to Book
                    </Button>
                  </>
                  :
                  <>
                    <Button
                      disabled={!!dateError || !date.from || !date.to || !room}
                      onClick={handleBookNow}
                      className="w-full max-w-xs"
                    >
                      Book Now
                    </Button>
                  </>
                }

              </div>
              {priceIncreased && (
                <p className="text-sm text-yellow-600 flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Price has increased due to multiple room allocation.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


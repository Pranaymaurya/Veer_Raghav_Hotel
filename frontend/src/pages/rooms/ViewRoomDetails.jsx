import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { format, differenceInDays, addDays, isBefore, isToday } from 'date-fns';
import {
  Bed, Users, Star, ChevronLeft, Plus, Minus, AlertCircle, Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRoom } from '@/context/RoomContext';
import ImageSlider from './components/ImageSlider';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import PriceDetails from './components/PriceDetails';
import HotelDetailsSections from './components/HotelDetailsSections';
import { useToast } from '@/hooks/use-toast';

const RoomDetailsSkeleton = () => (
  <div className="container mx-auto p-4 space-y-6">
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-6 w-24" />
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <Skeleton className="aspect-video rounded-lg" />
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-20" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function ViewRoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const { Rooms, getAllRooms, loading: roomsLoading, getRoomBookingDates } = useRoom();
  const { toast } = useToast();

  // UI States
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showHostInfo, setShowHostInfo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Popular Amenities');
  const [bookedDates, setBookedDates] = useState([]);

  // Get current room
  const room = Rooms?.find(room => room?._id === id);

  // Initialize states with URL parameters or defaults
  const [guests, setGuests] = useState(() => {
    const guestsParam = parseInt(searchParams.get('guests')) || location.state?.guests || 1;
    return Math.max(1, guestsParam);
  });

  const [roomCount, setRoomCount] = useState(() => {
    const roomsParam = parseInt(searchParams.get('rooms')) || location.state?.rooms || 1;
    return Math.max(1, roomsParam);
  });

  const [date, setDate] = useState(() => {
    const checkIn = searchParams.get('checkIn') || location.state?.startDate;
    const checkOut = searchParams.get('checkOut') || location.state?.endDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = addDays(today, 1);

    return {
      from: checkIn ? new Date(checkIn) : today,
      to: checkOut ? new Date(checkOut) : tomorrow,
      selecting: false
    };
  });

  const [dateError, setDateError] = useState('');
  const [priceIncreased, setPriceIncreased] = useState(false);

  // Effects
  useEffect(() => {
    getAllRooms();
  }, []);

  useEffect(() => {
    const fetchBookedDates = async () => {
      if (id) {
        try {
          const dates = await getRoomBookingDates(id);
          setBookedDates(dates.map(date => new Date(date)));
        } catch (error) {
          console.error('Error fetching booked dates:', error);
        }
      }
    };
    fetchBookedDates();
  }, [id, getRoomBookingDates]);

  useEffect(() => {
    if (room) {
      const requiredRooms = Math.ceil(guests / room.maxOccupancy);
      if (roomCount < requiredRooms) {
        setRoomCount(requiredRooms);
        setPriceIncreased(requiredRooms > 1);
      }
    }
  }, [room, guests]);

  useEffect(() => {
    if (date?.from && date?.to) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isBefore(date.from, today) && !isToday(date.from)) {
        setDateError('Check-in date cannot be in the past');
      } else if (isBefore(date.to, date.from)) {
        setDateError('Check-out date must be after check-in date');
      } else if (differenceInDays(date.to, date.from) < 1) {
        setDateError('Minimum stay is 1 night');
      } else {
        setDateError('');
      }
    }
  }, [date]);

  // Utility functions
  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate =>
      format(bookedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const isDateRangeAvailable = (startDate, endDate) => {
    if (!startDate || !endDate) return true;

    let currentDate = startDate;
    while (currentDate <= endDate) {
      if (isDateBooked(currentDate)) {
        return false;
      }
      currentDate = addDays(currentDate, 1);
    }
    return true;
  };

  const calculateTotalTaxes = (basePrice, nights, rooms) => {
    if (!room?.taxes) return 0;
    const totalBasePrice = basePrice * nights * rooms;
    const totalTaxPercentage = (room.taxes.vat || 0) + (room.taxes.serviceTax || 0) + (room.taxes.other || 0);
    return (totalBasePrice * totalTaxPercentage) / 100;
  };

  const calculateFinalPrice = () => {
    if (!room || !date.from || !date.to) return 0;

    const nights = differenceInDays(date.to, date.from);
    const basePrice = room.DiscountedPrice > 0 ? room.DiscountedPrice : room.pricePerNight;
    const totalBasePrice = basePrice * nights * roomCount;
    const totalTaxes = calculateTotalTaxes(basePrice, nights, roomCount);

    return totalBasePrice + totalTaxes;
  };

  const isValidDateRange = (dateRange) => {
    if (!dateRange || !dateRange.from || !dateRange.to) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    try {
      // Check if both dates are valid Date objects
      if (!(dateRange.from instanceof Date) || !(dateRange.to instanceof Date)) return false;
      if (isNaN(dateRange.from.getTime()) || isNaN(dateRange.to.getTime())) return false;
  
      // Check if dates are not in the past (allow today)
      if (isBefore(dateRange.from, today) && !isToday(dateRange.from)) return false;
  
      // Check if check-out is after check-in
      if (!isBefore(dateRange.from, dateRange.to)) return false;
  
      // Check if dates are within booking window (e.g., 1 year)
      const maxBookingDate = addDays(today, 365);
      if (isBefore(maxBookingDate, dateRange.to)) return false;
  
      // Verify minimum stay requirement (1 night)
      const nights = differenceInDays(dateRange.to, dateRange.from);
      if (nights < 1) return false;
  
      return true;
    } catch (error) {
      console.error('Error validating date range:', error);
      return false;
    }
  };
  
  // Format date range for display
  const formatDateRange = (dateRange) => {
    try {
      if (!isValidDateRange(dateRange)) {
        return "Select dates";
      }
      return `${format(dateRange.from, "EEE, MMM d, yyyy")} - ${format(dateRange.to, "EEE, MMM d, yyyy")}`;
    } catch (error) {
      console.error('Error formatting date range:', error);
      return "Select dates";
    }
  };
  
  // Calculate number of nights in a date range
  const calculateNights = (dateRange) => {
    try {
      if (!isValidDateRange(dateRange)) return 0;
      return differenceInDays(dateRange.to, dateRange.from);
    } catch (error) {
      console.error('Error calculating nights:', error);
      return 0;
    }
  };
  
  // Get error message for invalid date range
  const getDateRangeError = (dateRange) => {
    if (!dateRange || !dateRange.from || !dateRange.to) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    try {
      if (isBefore(dateRange.from, today) && !isToday(dateRange.from)) {
        return 'Check-in date cannot be in the past';
      }
  
      if (!isBefore(dateRange.from, dateRange.to)) {
        return 'Check-out date must be after check-in date';
      }
  
      const nights = differenceInDays(dateRange.to, dateRange.from);
      if (nights < 1) {
        return 'Minimum stay is 1 night';
      }
  
      const maxBookingDate = addDays(today, 365);
      if (isBefore(maxBookingDate, dateRange.to)) {
        return 'Cannot book more than 1 year in advance';
      }
  
      return '';
    } catch (error) {
      console.error('Error getting date range error:', error);
      return 'Invalid date selection';
    }
  };

  // Event handlers
  const handleDateSelect = (newDate) => {
    if (!newDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = addDays(today, 1);
      setDate({
        from: today,
        to: tomorrow,
        selecting: false
      });
      return;
    }

    const dateRange = {
      from: newDate.from,
      to: newDate.to,
      selecting: !newDate.to
    };

    if (newDate.from && newDate.to) {
      if (!isValidDateRange(dateRange)) {
        const error = getDateRangeError(dateRange);
        setDateError(error);
        return;
      }

      if (!isDateRangeAvailable(newDate.from, newDate.to)) {
        toast({
          title: "Dates Unavailable",
          description: "Some dates in your selection are already booked. Please choose different dates.",
          variant: "destructive",
        });
        return;
      }
    }

    setDate(dateRange);
    setDateError('');
  };

  const handleGuestChange = (increment) => {
    if (!room) return;

    const newGuestCount = Math.max(1, guests + increment);
    const requiredRooms = Math.ceil(newGuestCount / room.maxOccupancy);

    if (requiredRooms > room.availableSlots) {
      toast({
        title: "Maximum Capacity Reached",
        description: `Only ${room.availableSlots} rooms are available (${room.availableSlots * room.maxOccupancy} guests maximum)`,
        variant: "destructive",
      });
      return;
    }

    setGuests(newGuestCount);
    setRoomCount(requiredRooms);
    setPriceIncreased(requiredRooms > 1);
  };

  const handleLogin = () => {
    navigate('/auth/login', {
      state: {
        from: location,
        message: 'You need to be logged in to book a room.',
      },
    });
  };

  

const handleBookNow = () => {
  if (!date?.from || !date?.to || !room) return;

  const nights = differenceInDays(date.to, date.from);
  const basePrice = room.DiscountedPrice > 0 ? room.DiscountedPrice : room.pricePerNight;
  const totalTaxes = calculateTotalTaxes(basePrice, nights, roomCount);
  const finalPrice = (basePrice * nights * roomCount) + totalTaxes;

  const booking = {
    roomId: room._id,
    roomName: room.name,
    pricePerNight: basePrice,
    startDate: date.from,
    endDate: date.to,
    guests,
    nights,
    roomCount,
    totalPrice: finalPrice.toFixed(2),
    taxes: totalTaxes.toFixed(2),
    amenities: room.amenities,
    taxBreakdown: {
      vat: `${room.taxes?.vat || 0}%`,
      serviceTax: `${room.taxes?.serviceTax || 0}%`,
      other: `${room.taxes?.other || 0}%`,
    },
  };

  navigate(`/booking/${room._id}`, { state: { booking } });
};

// Loading and error states
if (roomsLoading) {
  return <RoomDetailsSkeleton />;
}

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



return (
  <div className="container mx-auto p-4">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{room?.name}</h1>
        <Button
          variant="link"
          onClick={() => navigate('/rooms')}
          className="pl-0 text-gray-600 hover:text-primary"
        >
          <ChevronLeft className="mr-2" /> Back to Rooms
        </Button>
      </div>
      <div className="flex items-center text-yellow-500">
        <Star className="w-4 h-4 fill-current" />
        <span className="ml-1">
          {room?.ratings?.length > 0
            ? (room?.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
              room?.ratings.length).toFixed(1)
            : "New"}
        </span>
        {room?.ratings?.length > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            {(() => {
              const avgRating =
                room.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                room.ratings.length;

              if (avgRating > 4.5) return "Excellent";
              if (avgRating > 4) return "Very Good";
              if (avgRating > 3.2) return "Good";
              return "Okay";
            })()}
          </span>
        )}
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {/* Left Section - 2/3 width */}
      <div className="md:col-span-2 space-y-6">
        {/* Image Slider */}
        <div className="relative">
          <ImageSlider images={room?.images || []} />
        </div>

        {/* Room Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-700 flex items-center">
              <Bed className="mr-2 text-primary" /> Room Type
            </h3>
            <p className="text-gray-600">{room?.name}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 flex items-center">
              <Users className="mr-2 text-primary" /> Capacity
            </h3>
            <p className="text-gray-600">
              {room?.amenities?.find(cat => cat.category === 'No of Bed')?.items[0]?.quantity || 1} Bed(s) •
              Fits {room?.maxOccupancy} Guests
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Description</h3>
          <p className="text-gray-600">
            {room?.description?.length > 150
              ? `${room?.description.slice(0, 150)}...`
              : room?.description}
            {room?.description?.length > 150 && (
              <Button
                variant="link"
                onClick={() => setShowFullDescription(true)}
                className="text-primary"
              >
                Read more
              </Button>
            )}
          </p>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Amenities</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {room?.amenities?.map((category, index) => (
              <Button

                key={index}
                variant={selectedCategory === category.category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.category)}
                className="whitespace-nowrap"
              >
                {category.category}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {room?.amenities
              ?.find(cat => cat.category === selectedCategory)
              ?.items.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <Check className="text-primary h-4 w-4" />
                  <span>{item.name} {item.quantity > 1 ? `(${item.quantity})` : ''}</span>
                </div>
              ))}
          </div>
        </div>

        <Separator />

        {/* Hotel Details */}
        <HotelDetailsSections onMessageHost={handleLogin} />

      </div>

      {/* Right Section - 1/3 width */}
      <div className="md:col-span-1">
        <Card className="sticky top-4">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-4">
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
                        !isValidDateRange(date) && "text-muted-foreground"
                      )}
                    >
                      {formatDateRange(date)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from || new Date()}
                      selected={{
                        from: date?.from,
                        to: date?.to
                      }}
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return (
                          isBefore(date, today) ||
                          isDateBooked(date)
                        );
                      }}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
                {dateError && (
                  <div className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {dateError}
                  </div>
                )}
                {calculateNights(date) > 0 && (
                  <p className="text-sm text-muted-foreground">
                    You have selected {calculateNights(date)} nights
                  </p>
                )}
              </div>

              {/* Guests and Rooms */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Guests
                </label>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange(-1)}
                    disabled={guests <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {room && (
                  <div className="text-sm text-muted-foreground">
                    {roomCount} room{roomCount !== 1 ? 's' : ''} will be booked
                    {room.availableSlots < roomCount && (
                      <div className="text-destructive mt-1">
                        Only {room.availableSlots} room{room.availableSlots !== 1 ? 's' : ''} available
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price Display */}
              <PriceDetails
                pricePerNight={room?.pricePerNight}
                discountedPrice={room?.DiscountedPrice}
                taxes={room?.taxes}
                roomCount={roomCount}
                date={date}
                finalPrice={calculateFinalPrice()}
                totalTaxes={calculateTotalTaxes(
                  room?.DiscountedPrice > 0 ? room?.DiscountedPrice : room?.pricePerNight,
                  date.from && date.to ? differenceInDays(date.to, date.from) : 0,
                  roomCount
                )}
              />


              {/* Book Now Button */}
              {!user ? (
                <Button
                  onClick={handleLogin}
                  className="w-full bg-orange-600 text-white hover:bg-orange-700"
                >
                  Login to Book
                </Button>
              ) : (
                <Button
                  disabled={!!dateError || !date?.from || !date?.to}
                  onClick={handleBookNow}
                  className="w-full bg-orange-600 text-white hover:bg-orange-700"
                >
                  Book Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Modals */}
    <Dialog open={showFullDescription} onOpenChange={setShowFullDescription}>
      <DialogContent className='textblack'>
        <DialogHeader>
          <DialogTitle>Room Description</DialogTitle>
        </DialogHeader>
        <Separator />
        <p className="text-gray-600">{room?.description}</p>
      </DialogContent>
    </Dialog>

    <Dialog open={showAllAmenities} onOpenChange={setShowAllAmenities}>
      <DialogContent className="textblack">
        <DialogHeader>
          <DialogTitle>All Amenities</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="space-y-6">
          {room?.amenities?.map(category => (
            <div key={category.category} className="space-y-2">
              <h4 className="font-semibold">{category.category}</h4>
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {category.items.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>{item.name} {item.quantity > 1 ? `(${item.quantity})` : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={showHostInfo} onOpenChange={setShowHostInfo}>
      <DialogContent className='textblack'>
        <DialogHeader>
          <DialogTitle>About Your Host</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="space-y-4">
          <p className="text-gray-600">
            During your stay, you will be hosted by Ankur. He has been hosting since 2024.
            Ankur is an affable person and loves hosting guests from various corners of the world.
            Besides hosting, Ankur likes travelling, listening to music, reading and playing sports.
            He has always been passionate about donning the hat of a perfect host.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Caretaker Services</h4>
            <ul className="space-y-2">
              <li>• Cleaning kitchen/utensils</li>
              <li>• Cab bookings</li>
              <li>• Car/bike rentals</li>
              <li>• Gardening</li>
              <li>• Help buying groceries</li>
              <li>• Restaurant reservations</li>
              <li>• Pick up and Drop services</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
);
}
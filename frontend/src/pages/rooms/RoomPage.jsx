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
  Users,
  Star,
  Search,
  RotateCcw,
  Bed,
  Home,
  Filter
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useRoom } from '@/context/RoomContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ImageSlider from './components/ImageSlider';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function RoomsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { Rooms, getAllRooms } = useRoom();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize filters from URL params
  const defaultFilters = {
    priceRange: [0, 10000],
    type: searchParams.get('roomType') || "",
    guests: searchParams.get('guests') || "",
    rooms: searchParams.get('rooms') || "1",
    startDate: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')) : null,
    endDate: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')) : null,
    searchQuery: searchParams.get('search') || ""
  };

  const [filters, setFilters] = useState(defaultFilters);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.type) params.set('roomType', filters.type);
    if (filters.guests) params.set('guests', filters.guests);
    if (filters.rooms) params.set('rooms', filters.rooms);
    if (filters.startDate) params.set('checkIn', filters.startDate.toISOString());
    if (filters.endDate) params.set('checkOut', filters.endDate.toISOString());
    if (filters.searchQuery) params.set('search', filters.searchQuery);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      type: "",
      guests: "",
      rooms: "1",
      startDate: null,
      endDate: null,
      searchQuery: ""
    });
    setSearchParams({});
  };

  const isAnyFilterActive = () => {
    return (
      filters.searchQuery !== "" ||
      filters.type !== "" ||
      filters.guests !== "" ||
      filters.startDate !== null ||
      filters.endDate !== null ||
      filters.priceRange[0] !== defaultFilters.priceRange[0] ||
      filters.priceRange[1] !== defaultFilters.priceRange[1]
    );
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        await getAllRooms();
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    if (!Rooms?.length) return [];

    return Rooms.filter(room => {
      const priceMatch = room.pricePerNight >= filters.priceRange[0] &&
        room.pricePerNight <= filters.priceRange[1];
      const typeMatch = !filters.type || room.name === filters.type;
      // const guestsMatch = !filters.guests ||
      //   room.maxOccupancy >= parseInt(filters.guests || "0");
      const availabilityMatch = room.isAvailable;
      const searchMatch = !filters.searchQuery ||
        room.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        room.amenities?.some(amenity =>
          amenity.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );

      return priceMatch && typeMatch
        // &&
        //  guestsMatch
        && availabilityMatch && searchMatch;
    });
  }, [Rooms, filters]);

  // Rest of your existing functions (calculateDynamicPrice, calculateNights, etc.)

  const calculateDynamicPrice = (basePrice, nights, roomCount = 1) => {
    // First multiply by number of rooms and nights
    let totalPrice = basePrice * nights * roomCount;

    // Then apply any length-of-stay discounts
    if (nights >= 5) {
      return Math.round(totalPrice * 0.9); // 10% discount for 5+ nights
    }
    if (nights > 1) {
      return Math.round(totalPrice * 0.95); // 5% discount for 2-4 nights
    }
    return totalPrice;
  };

  const calculateNights = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };


  const RoomSkeleton = () => (
    <Card className="h-[500px]">
      <Skeleton className="h-[200px] w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </CardContent>
    </Card>
  );

  const FilterControls = ({ filters, setFilters, resetFilters, isAnyFilterActive }) => (
    <div className="space-y-6 textblack">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn(
              "w-full justify-start text-left font-normal",
              !filters.startDate && "text-muted-foreground"
            )}>
              {filters.startDate ? (
                filters.endDate ? (
                  <>
                    {format(filters.startDate, "MMM d, y")} -
                    {format(filters.endDate, "MMM d, y")}
                  </>
                ) : format(filters.startDate, "MMM d, y")
              ) : (
                <span>Select dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.startDate}
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
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
  
        {/* Room Type Select */}
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Room Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Super Deluxe">Super Deluxe</SelectItem>
            <SelectItem value="Deluxe">Deluxe</SelectItem>
          </SelectContent>
        </Select>
  
        {/* Number of Rooms Select */}
        <Select
          value={filters.rooms}
          onValueChange={(value) => setFilters(prev => ({ ...prev, rooms: value }))}
        >
          <SelectTrigger className="flex items-center">
            <Home className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Rooms" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'Room' : 'Rooms'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  
        <div className="flex items-center justify-center border border-gray-300 rounded-md">
          <label className="mr-2">Guests</label>
          <Button
            variant="ghost"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                guests: Math.max(1, parseInt(prev.guests || "1") - 1),
              }))
            }
            className="p-2"
          >
            -
          </Button>
          <div className="mx-4 text-center w-8">{filters.guests || "1"}</div>
          <Button
            variant="ghost"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                guests: parseInt(prev.guests || "1") + 1,
              }))
            }
            className="p-2"
          >
            +
          </Button>
        </div>
  
        {/* Search Input */}
        <div className="relative col-span-1 sm:col-span-2">
          <Input
            placeholder="Search rooms or amenities"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
  
      {/* Price Range Slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Price Range:</Label>
          <span className="text-sm text-gray-500">
            ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[0, 10000]}
          value={filters.priceRange}
          onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
          min={0}
          max={10000}
          step={100}
          className="py-4"
        />
      </div>
  
      {isAnyFilterActive() && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 space-y-6 sm:space-y-8">
    {/* Mobile Filter Button */}
    <div className="lg:hidden mb-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full textblack">
            <Filter className="mr-2 h-4 w-4 " /> Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              resetFilters={resetFilters}
              isAnyFilterActive={isAnyFilterActive}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>

    {/* Desktop Filters */}
    <Card className="hidden lg:block">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
          Find Your Perfect Room
        </CardTitle>
        <CardDescription>
          Discover comfortable and stylish accommodations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FilterControls
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          isAnyFilterActive={isAnyFilterActive}
        />
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {isLoading ? (
        Array(6).fill(null).map((_, index) => (
          <RoomSkeleton key={index} />
        ))
      ) : filteredRooms.length > 0 ? (
        filteredRooms.map((room) => (
          <Card key={room?._id} className="hover:shadow-lg transition-shadow">
            <ImageSlider images={room?.images} />
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold">{room?.name}</h3>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1">
                    {room?.ratings?.length > 0
                      ? (room?.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                        room?.ratings.length).toFixed(1)
                      : "New"}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                {room?.description?.length > 100
                  ? `${room?.description.slice(0, 100)}...`
                  : room?.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-500 gap-2">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{room?.maxOccupancy} Guests</span>
                </div>
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-2" />
                  <span>{room?.name}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {room?.amenities?.slice(0, 3).map((amenity) => (
                  <span key={amenity} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs sm:text-sm">
                    {amenity}
                  </span>
                ))}
                {room?.amenities?.length > 3 && (
                  <Button
                    variant="outline"
                    className="text-primary text-xs sm:text-sm"
                  >
                    +{room?.amenities.length - 3} more
                  </Button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  ₹{calculateDynamicPrice(
                    room?.pricePerNight,
                    calculateNights(filters.startDate, filters.endDate),
                    parseInt(filters.rooms)
                  )} 
                  <span className="text-xs sm:text-sm font-normal block sm:inline">
                    {parseInt(filters.rooms) > 1 ? `/night for ${filters.rooms} rooms` : '/night'}
                  </span>
                </div>
                <Button
                  onClick={() => navigate(`/rooms/${room?._id}`, {
                    state: {
                      startDate: filters.startDate,
                      endDate: filters.endDate,
                      guests: filters.guests,
                      rooms: filters.rooms
                    }
                  })}
                  className="bg-orange-600 w-full sm:w-auto"
                  disabled={!room?.isAvailable}
                >
                  {room?.isAvailable ? 'Book Now' : 'Not Available'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 sm:py-12 bg-gray-100 rounded-lg">
          <h4 className="text-xl sm:text-2xl mb-4">No Rooms Found</h4>
          <p className="text-gray-600">
            Try adjusting your search or filters
          </p>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="flex items-center gap-2 mt-4 bg-orange-700 hover:bg-orange-600 text-white"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
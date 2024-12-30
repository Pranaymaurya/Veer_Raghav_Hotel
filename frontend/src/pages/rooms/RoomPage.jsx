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
  Search,
  SortAsc,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import ImageSlider from './components/ImageSlider';
import { useRoom } from '@/context/RoomContext';
import { useNavigate } from 'react-router-dom';

export default function RoomsPage() {
  const navigate = useNavigate();
  const { Rooms, getAllRooms } = useRoom();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const defaultFilters = {
    priceRange: [0, 10000],
    type: "",
    capacity: "",
    amenities: [],
    startDate: null,
    endDate: null
  };

  const [filters, setFilters] = useState(defaultFilters);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery("");
    setSortBy("");
  };

  const isAnyFilterActive = () => {
    return (
      searchQuery !== "" ||
      sortBy !== "" ||
      filters.type !== "" ||
      filters.amenities.length > 0 ||
      filters.startDate !== null ||
      filters.endDate !== null ||
      filters.priceRange[0] !== defaultFilters.priceRange[0] ||
      filters.priceRange[1] !== defaultFilters.priceRange[1]
    );
  };

  const availableAmenities = useMemo(() => {
    const uniqueAmenities = new Set();
    Rooms.forEach(room => {
      room.amenities?.forEach(amenity => uniqueAmenities.add(amenity));
    });
    return Array.from(uniqueAmenities);
  }, [Rooms]);

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

  const filteredAndSortedRooms = useMemo(() => {
    if (!Rooms?.length) return [];

    let filtered = Rooms.filter(room => {
      const priceMatch = room.pricePerNight >= filters.priceRange[0] &&
        room.pricePerNight <= filters.priceRange[1];
      const typeMatch = !filters.type || room.name === filters.type;
      const capacityMatch = !filters.capacity ||
        room.maxOccupancy >= parseInt(filters.capacity || "0");
      const amenitiesMatch = filters.amenities.length === 0 ||
        filters.amenities.every(amenity => room.amenities?.includes(amenity));
      const availabilityMatch = room.isAvailable;
      const searchMatch = !searchQuery ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.amenities?.some(amenity =>
          amenity.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return priceMatch && typeMatch && capacityMatch &&
        amenitiesMatch && availabilityMatch && searchMatch;
    });

    // Sort rooms based on selected criteria
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "rating-desc") {
      filtered.sort((a, b) => {
        const aRating = a.ratings?.length
          ? a.ratings.reduce((acc, curr) => acc + curr.rating, 0) / a.ratings.length
          : 0;
        const bRating = b.ratings?.length
          ? b.ratings.reduce((acc, curr) => acc + curr.rating, 0) / b.ratings.length
          : 0;
        return bRating - aRating;
      });
    }

    return filtered;
  }, [Rooms, filters, searchQuery, sortBy]);

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
          <div className="grid md:grid-cols-5 gap-4">
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

            {/* Sort Select */}
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            {/* Amenities Select */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between",
                    filters.amenities.length > 0 && "text-primary font-medium"
                  )}
                >
                  {filters.amenities.length > 0
                    ? `${filters.amenities.length} selected`
                    : "Amenities"}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    {/* Show message if no amenities are available */}
                    {availableAmenities.length === 0 ? (
                      <div className="text-center text-gray-500 py-2">
                        No amenities available
                      </div>
                    ) : (
                      <>
                        {/* Add "Select All" option */}
                        <div className="flex items-center space-x-2 border-b pb-2">
                          <Checkbox
                            checked={filters.amenities.length === availableAmenities.length}
                            onCheckedChange={(checked) => {
                              setFilters(prev => ({
                                ...prev,
                                amenities: checked ? [...availableAmenities] : []
                              }));
                            }}
                          />
                          <Label className="font-medium">Select All</Label>
                        </div>

                        {/* List all available amenities */}
                        {availableAmenities.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters.amenities.includes(amenity)}
                              onCheckedChange={(checked) => {
                                setFilters(prev => ({
                                  ...prev,
                                  amenities: checked
                                    ? [...prev.amenities, amenity]
                                    : prev.amenities.filter(a => a !== amenity)
                                }));
                              }}
                            />
                            <Label className="uppercase">{amenity}</Label>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Search Input */}
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
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(null).map((_, index) => (
            <RoomSkeleton key={index} />
          ))
        ) : filteredAndSortedRooms.length > 0 ? (
          filteredAndSortedRooms.map((room) => (
            <Card key={room._id} className="hover:shadow-lg transition-shadow">
              <ImageSlider images={room.images} />
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{room.name}</h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1">
                      {room.ratings?.length > 0
                        ? (room.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                          room.ratings.length).toFixed(1)
                        : "New"}
                    </span>
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
                  {room.amenities?.map(amenity => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold">
                    ₹{calculateDynamicPrice(
                      room.pricePerNight,
                      calculateNights(filters.startDate, filters.endDate)
                    )} <span className="text-sm font-normal">/night</span>
                  </div>
                  <Button
                    onClick={() => navigate(`/rooms/${room._id}`)}
                    className="bg-orange-600"
                    disabled={!room.isAvailable}
                  >
                    {room.isAvailable ? 'Book Now' : 'Not Available'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-gray-100 rounded-lg">
            <h4 className="text-2xl mb-4">No Rooms Found</h4>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
            <div className='flex justify-center'>

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
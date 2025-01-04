import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarDays, Users, Wifi, Tv, IndianRupee, X, AlertTriangle, Filter, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageSlider from '@/pages/rooms/components/ImageSlider';
import DownloadReceipt from '@/components/DownloadReceipt';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from '@/components/ui/label';

const UserBookings = () => {
  const { user } = useAuth();
  const { getBookingsByUserId, userBookings, cancelBooking } = useBooking();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  console.log(user);
  

  React.useEffect(() => {
    getBookingsByUserId(user);
  }, [user]);

  

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateRefundAmount = (checkInDate) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const daysUntilCheckIn = Math.ceil((checkIn - today) / (1000 * 60 * 60 * 24));
    return daysUntilCheckIn >= 10 ? 100 : 95;
  };

  const getFilteredAndSortedBookings = () => {
    let filtered = [...userBookings];

    // Date filtering
    if (filterStartDate) {
      filtered = filtered.filter(booking =>
        new Date(booking.checkInDate) >= filterStartDate
      );
    }
    if (filterEndDate) {
      filtered = filtered.filter(booking =>
        new Date(booking.checkOutDate) <= filterEndDate
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return b.totalPrice - a.totalPrice;
        case 'price-low':
          return a.totalPrice - b.totalPrice;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filteredBookings = getFilteredAndSortedBookings();
    return Math.ceil(filteredBookings.length / itemsPerPage);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
        variant: "success",
      });
      setShowCancelConfirm(false);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter controls component
  const FilterControls = () => (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-end">
      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Filter by Date Range</label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                {filterStartDate ? formatDate(filterStartDate) : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filterStartDate}
                onSelect={setFilterStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                {filterEndDate ? formatDate(filterEndDate) : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filterEndDate}
                onSelect={setFilterEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="w-full sm:w-[200px] space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Sort bookings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-[200px] space-y-2">
        <Label htmlFor="itemsPerPage" className="text-sm font-medium">Items per page</Label>
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
          <SelectTrigger id="itemsPerPage">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(filterStartDate || filterEndDate) && (
        <Button
          variant="outline"
          onClick={() => {
            setFilterStartDate(null);
            setFilterEndDate(null);
          }}
        >
          Clear Dates
        </Button>
      )}
    </div>
  );

  const BookingCard = ({ booking, isDetailed = false }) => (
    <div className={`space-y-4 ${isDetailed ? 'p-4' : ''} textblack`}>
      {/* Booking Dates */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarDays className="h-4 w-4" />
          <span className="font-medium">Check-in:</span>
          {formatDate(booking.checkInDate)}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarDays className="h-4 w-4" />
          <span className="font-medium">Check-out:</span>
          {formatDate(booking.checkOutDate)}
        </div>
      </div>

      {/* Room Details */}
      <div className="space-y-2 pt-2 border-t">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-600" />
          <span>Max Occupancy: {booking.room.maxOccupancy}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Amenities:</span>
          <div className="flex gap-2">
            {booking.room.amenities.includes('wifi') &&
              <Wifi className="h-4 w-4 text-gray-600" />}
            {booking.room.amenities.includes('tv') &&
              <Tv className="h-4 w-4 text-gray-600" />}
          </div>
        </div>
        

        {isDetailed && (
          <p className="text-gray-600">{booking.room.description}</p>
        )}
        {isDetailed && (
          <div className="flex items-center text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="ml-1">
            {booking.room.ratings?.length > 0
              ? (room.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                room.ratings.length).toFixed(1)
              : "New"}
          </span>
        </div>
        )}
      </div>

      {/* Price Information */}
      <div className="pt-2 border-t">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total Paid:</span>
          <div className="flex items-center gap-1">
            <IndianRupee className="h-4 w-4" />
            <span className="text-lg font-bold">
              {booking.totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="pt-2 border-t space-y-1 text-sm text-gray-600">
        <p>Booked by: {booking.user.name}</p>
        <p>Contact: {booking.user.phoneno}</p>
        <p>Email: {booking.user.email}</p>
      </div>

      {isDetailed && (
        <Card>
          <CardHeader>
            <CardTitle>Download Receipt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Download your booking receipt to present during check-in. This receipt contains all the necessary booking details.
            </p>
            <DownloadReceipt booking={booking} />
          </CardContent>
        </Card>
      )}

      {isDetailed && (
        <div className="pt-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowCancelConfirm(true)}
          >
            Cancel Booking
          </Button>
        </div>
      )}
    </div>
  );

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };



  return (
    <div className="p-6 space-y-6 textblack">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold underline">Your Bookings</h1>
        <Badge variant="outline" className="text-sm">
          {getFilteredAndSortedBookings().length} Bookings
        </Badge>
      </div>

      <FilterControls />

      <div className="space-y-6">
        {getFilteredAndSortedBookings().length > 0 ? (
          <>
            {getFilteredAndSortedBookings().map((booking) => (
              <Card
                key={booking._id}
                className="w-full cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedBooking(booking);
                  setIsDialogOpen(true);
                }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{booking.room.name}</CardTitle>
                    <Badge
                      variant={booking.status === 'Pending' ? 'warning' : 'success'}
                      className="ml-2"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <BookingCard booking={booking} />
                  <div className="space-y-4 border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Download your booking receipt to present during check-in.
                    </p>
                    <DownloadReceipt booking={booking} />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Pagination
              currentPage={currentPage}
              totalPages={getTotalPages()}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="col-span-2 text-center py-12">
            <div className="rounded-full bg-gray-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <X className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Detailed Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedBooking && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mt-5">
              <DialogTitle className="flex justify-between items-center">
                <span>{selectedBooking.room.name}</span>
                <Badge variant={selectedBooking.status === 'Pending' ? 'warning' : 'success'}>
                  {selectedBooking.status}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            {/* Room Images */}
            <div className="">
              <ImageSlider images={selectedBooking.room.images} />
            </div>

            <BookingCard booking={selectedBooking} isDetailed={true} />
          </DialogContent>
        )}
      </Dialog>

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  {calculateRefundAmount(selectedBooking.checkInDate) === 100
                    ? "You will receive a full refund as your cancellation is more than 10 days before check-in."
                    : "A 5% cancellation fee will be charged as your cancellation is less than 10 days before check-in."}
                </AlertDescription>
              </Alert>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Keep Booking</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => handleCancelBooking(selectedBooking._id)}
                >
                  Confirm Cancellation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserBookings;

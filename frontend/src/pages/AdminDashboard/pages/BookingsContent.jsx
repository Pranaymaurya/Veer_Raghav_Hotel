import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useBooking } from '@/context/BookingContext';
import { useAdminContext } from '@/context/AdminContext';
import { useRoom } from '@/context/RoomContext';
import BookingDetailsDialog from '../components/BookingDetailsDialog';
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const BookingsContent = () => {
  const { getAllBookings, updateBookingStatus, deleteBooking } = useBooking();
  const { fetchUsers, Guests } = useAdminContext();
  const { Rooms, getAllRooms } = useRoom();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('date-desc');

  const ITEMS_PER_PAGE = 10;

  // Separate data fetching for better control
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch all required data in parallel
        const [bookingsResponse, usersResponse, roomsResponse] = await Promise.all([
          getAllBookings(),
          fetchUsers(),
          getAllRooms()
        ]);

        // Process bookings with user and room details
        const processedBookings = processBookingData(bookingsResponse, usersResponse, roomsResponse);
        setBookings(processedBookings);
        setTotalPages(Math.ceil(processedBookings.length / ITEMS_PER_PAGE)); // Updated to use ITEMS_PER_PAGE
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Only run on mount

  // Separate function to process booking data
  const processBookingData = (bookingsData, users, rooms) => {
    if (!Array.isArray(bookingsData)) {
      console.error('Bookings data is not an array:', bookingsData);
      return [];
    }

    return bookingsData.map(booking => {
      const user = users.find(u => u._id === booking.user?._id);
      const room = rooms.find(r => r._id === booking.room?._id);
      
      return {
        ...booking,
        id: booking._id || booking.id,
        guestName: user?.name || booking.user?.name || 'Unknown',
        roomNumber: room?.name || booking.room?.name || 'Unknown',
        roomImage: room?.images?.[0] || null,
        totalPrice: booking.totalPrice || 0,
        status: booking.status || 'Pending'
      };
    });
  };

  // Filter bookings based on search and status
  const getFilteredBookings = () => {
    return bookings
      .filter(booking => {
        const matchesSearch = booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.roomNumber?.toString().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || 
          booking.status.toLowerCase() === statusFilter.toLowerCase();
        
        const matchesDate = (!dateFilter.from || new Date(booking.checkInDate) >= dateFilter.from) &&
          (!dateFilter.to || new Date(booking.checkInDate) <= dateFilter.to);
        
        const matchesPrice = (!priceRange.min || booking.totalPrice >= Number(priceRange.min)) &&
          (!priceRange.max || booking.totalPrice <= Number(priceRange.max));

        return matchesSearch && matchesStatus && matchesDate && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-desc':
            return new Date(b.checkInDate) - new Date(a.checkInDate);
          case 'date-asc':
            return new Date(a.checkInDate) - new Date(b.checkInDate);
          case 'price-desc':
            return b.totalPrice - a.totalPrice;
          case 'price-asc':
            return a.totalPrice - b.totalPrice;
          default:
            return 0;
        }
      });
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      const updatedBookings = await getAllBookings();
      const processedBookings = processBookingData(updatedBookings, Guests, Rooms);
      setBookings(processedBookings);
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const handleDeleteBooking = async () => {
    if (selectedBooking) {
      try {
        await deleteBooking(selectedBooking.id);
        const updatedBookings = await getAllBookings();
        const processedBookings = processBookingData(updatedBookings, Guests, Rooms);
        setBookings(processedBookings);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error('Failed to delete booking:', error);
      }
    }
  };

  const getPaginatedData = () => {
    const filtered = getFilteredBookings();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const filtered = getFilteredBookings();
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE)); // Updated to use ITEMS_PER_PAGE
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, dateFilter, statusFilter, priceRange, sortBy, bookings]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
        <div className="border rounded-lg">
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-[250px]" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
                <div className="mt-2 flex justify-between">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter({ from: null, to: null });
    setStatusFilter('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('date-desc');
  };


  const FilterBar = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 flex-grow">
        <Input
          placeholder="Search by guest name or room"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-[180px]">
              {dateFilter.from ? format(dateFilter.from, 'PP') : 'Filter by date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateFilter.from}
              selected={{ from: dateFilter.from, to: dateFilter.to }}
              onSelect={(range) => setDateFilter(range || { from: null, to: null })}
            />
          </PopoverContent>
        </Popover>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="checked-in">Checked In</SelectItem>
            <SelectItem value="checked-out">Checked Out</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min price"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            className="w-24"
          />
          <Input
            type="number"
            placeholder="Max price"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            className="w-24"
          />
        </div>

        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="ml-4"
        >
          Clear Filters
        </Button>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="price-desc">Highest Price</SelectItem>
            <SelectItem value="price-asc">Lowest Price</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );


  return (
    <div className="rounded-lg p-6 space-y-6 text-black">
      <h2 className="text-2xl font-semibold mb-4">Bookings Management</h2>

      <FilterBar />

      <Table>
    
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Guest Name</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Check-in Date</TableHead>
            <TableHead>Check-out Date</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.guestName}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>Room {booking.roomNumber}</span>
                </div>
              </TableCell>
              <TableCell>{format(new Date(booking.checkInDate), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{format(new Date(booking.checkOutDate), 'dd/MM/yyyy')}</TableCell>
              <TableCell>₹ {booking.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Select 
                  value={booking.status} 
                  onValueChange={(value) => handleStatusChange(booking.id, value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <BookingDetailsDialog booking={booking} />
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this booking?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete the booking
                          and remove the data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteBooking}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink 
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default BookingsContent;


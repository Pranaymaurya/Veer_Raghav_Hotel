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

const BookingsContent = () => {
  const { getAllBookings, updateBookingStatus, deleteBooking } = useBooking();
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      const response = await getAllBookings(currentPage, 10);
      setBookings(response.bookings);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      fetchBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const handleDeleteBooking = async () => {
    if (selectedBooking) {
      try {
        await deleteBooking(selectedBooking.id);
        setIsDeleteDialogOpen(false);
        fetchBookings();
      } catch (error) {
        console.error('Failed to delete booking:', error);
      }
    }
  };

  const filteredBookings = bookings.filter(booking => 
    (booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     booking.roomNumber.toString().includes(searchTerm)) &&
    (statusFilter === 'all' || booking.status === statusFilter)
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Bookings Management</h2>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by guest name or room number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
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

      <Table>
        <TableCaption>A list of all bookings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Guest Name</TableHead>
            <TableHead>Room Number</TableHead>
            <TableHead>Check-in Date</TableHead>
            <TableHead>Check-out Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.guestName}</TableCell>
              <TableCell>{booking.roomNumber}</TableCell>
              <TableCell>{format(new Date(booking.checkInDate), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{format(new Date(booking.checkOutDate), 'dd/MM/yyyy')}</TableCell>
              <TableCell>
                <Select 
                  value={booking.status} 
                  onValueChange={(value) => handleStatusChange(booking.id, value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="checked-in">Checked In</SelectItem>
                    <SelectItem value="checked-out">Checked Out</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
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


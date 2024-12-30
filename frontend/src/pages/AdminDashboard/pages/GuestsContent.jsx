import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/context/AdminContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";

export default function GuestContent() {
  const { fetchUsers, Guests, deleteUser, updateUser, addUser, loading } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredAndSortedGuests = Guests
    .filter(guest => guest.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    })
    .map(guest => ({
      ...guest,
      isBooked: true // Setting default isBooked to true as requested
    }));

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedGuests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGuests = filteredAndSortedGuests.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async () => {
    if (deletingUser) {
      const success = await deleteUser(deletingUser._id);
      if (success) {
        setDeletingUser(null);
        await fetchUsers();
        toast({
          title: "User deleted",
          description: "The user has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the user. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="w-[200px] h-[32px] mb-4" />
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="w-[200px] h-[40px]" />
          <Skeleton className="w-[180px] h-[40px]" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-full h-[52px]" />
          ))}
        </div>
      </div>
    );
  }

  if (Guests.length === 0) {
    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>No Users Found</CardTitle>
          <CardDescription>There are currently no users in the system or matching your search criteria.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Guest List</h1>
      <p className="mb-4 text-gray-600 text-sm italic">In here the guest list is shown that who's are booked the rooms</p>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by join date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Oldest first</SelectItem>
            <SelectItem value="desc">Newest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Join Date</TableHead>
            {/* <TableHead>Booking Status</TableHead> */}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedGuests.map((guest) => (
            <TableRow key={guest._id}>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell>{new Date(guest.createdAt).toLocaleDateString()}</TableCell>
              {/* <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${guest.isBooked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {guest.isBooked ? 'Booked' : 'Not Booked'}
                </span>
              </TableCell> */}
              <TableCell>
                <Button variant="destructive" onClick={() => setDeletingUser(guest)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              variant={currentPage === index + 1 ? "default" : "outline"}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setDeletingUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
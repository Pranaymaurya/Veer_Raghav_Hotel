import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/context/AdminContext';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GuestContent() {
  const { fetchUsers, Guests, deleteUser, updateUser, addUser } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'guest' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredAndSortedGuests = Guests
    .filter(guest => guest.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.joinDate);
      const dateB = new Date(b.joinDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const handleDelete = async () => {
    if (deletingUser) {
      const success = await deleteUser(deletingUser._id);
      if (success) {
        toast({
          title: "User deleted",
          description: "The user has been successfully deleted.",
        });
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the user. Please try again.",
          variant: "destructive",
        });
      }
      setDeletingUser(null);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdate = async () => {
    const success = await updateUser(editingUser);
    if (success) {
      setEditingUser(null);
      toast({
        title: "User updated",
        description: "The user information has been successfully updated.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update the user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async () => {
    const success = await addUser(newUser);
    if (success) {
      setNewUser({ name: '', email: '', role: 'guest' });
      toast({
        title: "User added",
        description: "The new user has been successfully added.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add the new user. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Guest List</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={(value) => setSortOrder(value)}>
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedGuests.map((guest) => (
            <TableRow key={guest._id}>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell>{new Date(guest.joinDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => setDeletingUser(guest)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Make changes to the user information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdate}>Update User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
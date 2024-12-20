import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, Bed, Users, DollarSign, Star, CheckCircle2, XCircle, Edit } from 'lucide-react';
import { rooms } from '@/data/room';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

// Importing the rooms data


const CustomizeRooms = () => {
    const [roomsData, setRoomsData] = useState(rooms);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDeleteRoom = () => {
        if (roomToDelete) {
            setRoomsData(roomsData.filter(room => room.id !== roomToDelete.id));
            setIsDeleteDialogOpen(false);
            setRoomToDelete(null);
            // Here you would typically make an API call to delete the room
            // For example: await deleteRoom(roomToDelete.id);
        }
    };

    const filteredRooms = roomsData.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleAvailability = (roomId) => {
        setRoomsList(roomsList.map(room =>
            room.id === roomId
                ? { ...room, isAvailable: !room.isAvailable }
                : room
        ));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Customize Rooms</h1>
                <Link to="/dashboard/rooms/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add New Room
                    </Button>
                </Link>
            </div>

            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden">
                        <CardHeader className="p-0">
                            <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-full h-48 object-cover"
                            />
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <CardTitle className="text-xl">{room.name}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={room.isAvailable ? "success" : "secondary"}>
                                            {room.isAvailable ?
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> :
                                                <XCircle className="w-3 h-3 mr-1" />
                                            }
                                            {room.isAvailable ? 'Available' : 'Not Available'}
                                        </Badge>
                                        <Badge variant="secondary">{room.type}</Badge>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{room.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>${room.price}/night</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>{room.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>Fits {room.capacity}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 p-4 pt-0">
                            <div className="flex items-center justify-between w-full">
                                <span className="text-sm">Availability</span>
                                {room.isAvailable ? (
                                    <span className="text-sm text-green-500">Available</span>
                                ) : (
                                    <span className="text-sm text-red-500">Not Available</span>
                                )}
                            </div>
                            <div className="flex justify-end gap-2 w-full">
                                <Link to={`${room.id}`}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    className="flex items-center gap-2"
                                    onClick={() => confirmDelete(room.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this room?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the room
                            and remove the data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteRoom}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CustomizeRooms;


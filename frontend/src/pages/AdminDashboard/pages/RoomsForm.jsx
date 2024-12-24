import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Loader2, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRoom } from '@/context/RoomContext';
import { useAuth } from '@/hooks/useAuth';
// import { toast } from '@/components/ui/use-toast';

const RoomsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRoom, updateRoom, getRoomById, addImagesToRoom, getImageUrl, deleteRoom } = useRoom();
  const { user } = useAuth();
  const isNewRoom = !id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    maxOccupancy: '',
    images: [],
    existingImages: [],
    amenities: [''],
    isAvailable: true
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const fetchRoom = async () => {
      if (!isNewRoom) {
        try {
          const roomData = await getRoomById(id);
          setFormData({
            ...roomData,
            pricePerNight: roomData.pricePerNight.toString(),
            maxOccupancy: roomData.maxOccupancy.toString(),
            existingImages: roomData.images || [],
            images: [],
          });
        } catch (error) {
          if (error.message === 'Authentication required. Please log in again.') {
            navigate('/login', { state: { from: location.pathname } });
          } else {
            navigate('/dashboard/rooms');
          }
        }
      }
    };

    fetchRoom();
  }, [id, isNewRoom, getRoomById, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const roomData = {
        ...formData,
        pricePerNight: parseFloat(formData.pricePerNight),
        maxOccupancy: parseInt(formData.maxOccupancy),
        amenities: formData.amenities.filter(amenity => amenity.trim() !== ''),
        images: formData.existingImages
      };

      if (isNewRoom) {
        // For new rooms, send everything including new images to addRoom
        const newRoom = await addRoom({...roomData, images: [...roomData.images, ...formData.images]});
        toast({
          title: "Success",
          description: "Room created successfully",
        });
        
      navigate(`/dashboard/rooms/`);
      } else {
        // For existing rooms, first update the room data
        await updateRoom(id, roomData);
        
        // Then handle any new images separately
        if (formData.images.length > 0) {
          await addImagesToRoom(id, formData.images);
        }
        
        toast({
          title: "Success",
          description: "Room updated successfully",
        });
      }
      console.log('Room updated successfully');
      
      navigate('/dashboard/rooms');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save room details.",
        variant: "destructive",
      });
      
      if (error.message === 'Authentication required. Please log in again.') {
        navigate('/login', { state: { from: location.pathname } });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addAmenity = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, '']
    }));
  };

  const updateAmenity = (index, value) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map((amenity, i) => 
        i === index ? value : amenity
      )
    }));
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom();
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      navigate('/dashboard/rooms');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete room.",
        variant: "destructive",
      });
      if (error.message === 'Authentication required. Please log in again.') {
        navigate('/login', { state: { from: location.pathname } });
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => navigate('/dashboard/rooms')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </Button>
          <h1 className="text-2xl font-bold">
            {isNewRoom ? 'Add New Room' : 'Edit Room'}
          </h1>
        </div>
        {!isNewRoom && (
          <Badge variant={formData.isAvailable ? "success" : "secondary"}>
            {formData.isAvailable ? 'Available' : 'Not Available'}
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Availability Toggle */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5">
                <Label>Room Availability</Label>
                <div className="text-sm text-muted-foreground">
                  Control whether this room can be booked by guests
                </div>
              </div>
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isAvailable: checked }))
                }
              />
            </div>

            {/* Basic Information */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Room Type *</Label>
                <Select
                  value={formData.name}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    name: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Super Deluxe">Super Deluxe</SelectItem>
                    <SelectItem value="Deluxe">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Describe the room and its features"
                  required
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Room Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pricePerNight">Price per Night ($) *</Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter the price per night"
                  value={formData.pricePerNight}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricePerNight: e.target.value
                  }))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxOccupancy">Max Occupancy *</Label>
                <Input
                  id="maxOccupancy"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Enter the maximum occupancy"
                  value={formData.maxOccupancy}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    maxOccupancy: e.target.value
                  }))}
                  required
                />
              </div>
            </div>

            {/* Images */}
            <div className="grid gap-4">
              <Label>Room Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.existingImages.map((image, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={getImageUrl(image)}
                      alt={`Room ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          existingImages: prev.existingImages.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.images.map((image, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New Room ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <label className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm font-medium">Upload Images</span>
                    <span className="text-xs">Drag & drop or click</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div className="grid gap-4">
              <Label>Amenities</Label>
              <div className="space-y-2">
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={amenity}
                      onChange={(e) => updateAmenity(index, e.target.value)}
                      placeholder="Enter amenity (e.g., WiFi, TV, Mini Bar)"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAmenity(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={addAmenity}
                >
                  <Plus className="w-4 h-4" />
                  Add Amenity
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/rooms')}
          >
            Cancel
          </Button>
          {!isNewRoom && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Room
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isNewRoom ? 'Create Room' : 'Update Room'}
          </Button>
        </div>
      </form>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this room?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the room
              and remove all associated data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
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

export default RoomsForm;


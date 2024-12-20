import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Plus,
  X,
  Upload,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { rooms } from '@/data/room';

const RoomsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewRoom = id === 'new';
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Room',
    price: '',
    capacity: '' || 1,
    rating: '' || 0,
    images: [],
    amenities: [''],
    isAvailable: true
  });

  useEffect(() => {
    if (!isNewRoom) {
      // In a real app, you would fetch the room data from an API
      const existingRoom = rooms.find(room => room.id === id);
      if (existingRoom) {
        setFormData(existingRoom);
      }
    }
  }, [id, isNewRoom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving room:', formData);
      navigate('/dashboard/rooms');
    } catch (error) {
      console.error('Error saving room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
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
      ).filter(amenity => amenity !== '')
    }));
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
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
                <Label htmlFor="name">Room Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Enter room name"
                  required
                />
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Room Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    type: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Room">Standard Room</SelectItem>
                    <SelectItem value="Suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price per Night ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    price: e.target.value
                  }))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    capacity: e.target.value
                  }))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rating">Rating *</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  disabled
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    rating: e.target.value
                  }))}
                  required
                />
              </div>
            </div>

            {/* Images */}
            <div className="grid gap-4">
              <Label>Room Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Room ${index + 1}`}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isNewRoom ? 'Create Room' : 'Update Room'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoomsForm;
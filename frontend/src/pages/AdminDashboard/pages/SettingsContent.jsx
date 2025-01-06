import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Mail, Phone, MapPin, Image, Plus, Trash2, Settings, Edit, X, Loader2, AlertCircle } from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRoom } from '@/context/RoomContext';
// import { validateHotelData } from '../components/hotelValidation';


const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const SkeletonLoader = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const SettingsContent = () => {
  const { hotel, isLoading, createHotel, updateHotel, uploadLogo } = useSettings();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileError, setFileError] = useState('');
  const {getImageUrl} = useRoom();

  const [formData, setFormData] = useState({
    name: '',
    contactNumbers: [''],
    address: '',
    checkInTime: '',
    checkOutTime: '',
  });
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (Array.isArray(hotel) && hotel.length > 0) {
      const hotelData = hotel[0];
      setFormData({
        name: hotelData.name || '',
        contactNumbers: hotelData.contactNumbers || [''],
        address: hotelData.address || '',
        checkInTime: hotelData.checkInTime || '',
        checkOutTime: hotelData.checkOutTime || '',
      });
    }
  }, []);


  const validateLogoFile = (file) => {
    setFileError('');

    if (file.size > MAX_FILE_SIZE) {
      setFileError('Logo file size must be less than 2MB');
      return false;
    }

    // Create an image element to check dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);

    return new Promise((resolve) => {
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width > 200 || img.height > 200) {
          setFileError('Image dimensions must be 200x200 pixels or smaller');
          resolve(false);
        }
        resolve(true);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        setFileError('Invalid image file');
        resolve(false);
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.contactNumbers];
    newPhones[index] = value;
    setFormData(prev => ({ ...prev, contactNumbers: newPhones }));
  };

  const addPhone = () => {
    setFormData(prev => ({ ...prev, contactNumbers: [...prev.contactNumbers, ''] }));
  };

  const removePhone = (index) => {
    const newPhones = formData.contactNumbers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, contactNumbers: newPhones }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValid = await validateLogoFile(file);
      if (isValid) {
        setLogo(file);
      } else {
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let response;

      const hotelData = {
        name: formData.name,
        contactNumbers: formData.contactNumbers.filter(num => num.trim() !== ''),
        address: formData.address,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
      };

      if (Array.isArray(hotel) && hotel.length > 0) {
        const hotelId = hotel[0]._id;
        response = await updateHotel(hotelId, hotelData);
      } else {
        response = await createHotel(hotelData);
      }

      if (logo && response?.hotel?._id) {
        const logoFormData = new FormData();
        logoFormData.append('logo', logo);
        await uploadLogo(logoFormData);
      }

      // Simulate a longer loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: hotel?.length > 0 ? "Hotel Updated" : "Hotel Created",
        description: hotel?.length > 0 ? "Your changes have been saved successfully." : "New hotel has been created successfully.",
      });
      setIsEditing(false);
      // window.location.reload();
    } catch (error) {
      console.error('Failed to save hotel:', error);
      toast({
        title: "Error",
        description: `Failed to ${hotel?.length > 0 ? 'update' : 'create'} hotel. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (Array.isArray(hotel) && hotel.length > 0) {
      const hotelData = hotel[0];
      setFormData({
        name: hotelData.name || '',
        contactNumbers: hotelData.contactNumbers || [''],
        address: hotelData.address || '',
        checkInTime: hotelData.checkInTime || '',
        checkOutTime: hotelData.checkOutTime || '',
      });
    }
    setIsEditing(false);
  };

  if (isLoading || isSaving) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span className="text-xl font-semibold">
            {isSaving ? 'Saving changes...' : 'Loading...'}
          </span>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  const renderValue = (label, value) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-lg">{value || 'Not set'}</span>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Hotel Information
            </CardTitle>
            <CardDescription className="mt-1">
              {isEditing ? 'Edit your hotel settings' : 'View your hotel settings'}
            </CardDescription>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full sm:w-auto">
                <Edit className="mr-2 h-4 w-4" />
                Edit Settings
              </Button>
            ) : (
              <>
                <Button onClick={handleCancel} variant="outline" className="w-full sm:w-auto">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit} type="submit" className="w-full sm:w-auto">
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full flex flex-col md:flex-row gap-2 h-full mb-5 sm:mb-6 bg-orange-50">
              <TabsTrigger value="general" className="w-full">General</TabsTrigger>
              <TabsTrigger value="booking" className="w-full">Booking</TabsTrigger>
              <TabsTrigger value="appearance" className="w-full">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl sm:text-2xl">General Information</CardTitle>
                  <CardDescription>Basic details about your hotel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base sm:text-lg font-semibold">Hotel Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter hotel name"
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-base sm:text-lg font-semibold">Contact Numbers</Label>
                        {formData.contactNumbers.map((phone, index) => (
                          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <div className="flex-1 flex items-center w-full gap-2">
                              <Phone className="flex-shrink-0 text-gray-500" />
                              <Input
                                value={phone}
                                onChange={(e) => handlePhoneChange(index, e.target.value)}
                                placeholder="Enter contact phone"
                                className="flex-1"
                              />
                            </div>
                            {index > 0 && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removePhone(index)}
                                className="flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addPhone} className="w-full sm:w-auto">
                          <Plus className="mr-2 h-4 w-4" /> Add Phone
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-base sm:text-lg font-semibold">Address</Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="flex-shrink-0 text-gray-500" />
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter hotel address"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Hotel Name</span>
                        <p className="text-base sm:text-lg">{formData.name || 'Not set'}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm text-gray-500">Contact Numbers</span>
                        <div className="space-y-2">
                          {formData.contactNumbers.map((phone, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Phone className="flex-shrink-0 text-gray-500" />
                              <span className="text-base sm:text-lg">{phone}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Address</span>
                        <div className="flex items-center gap-2">
                          <MapPin className="flex-shrink-0 text-gray-500" />
                          <p className="text-base sm:text-lg">{formData.address || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booking">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl sm:text-2xl">Booking Configuration</CardTitle>
                  <CardDescription>Set up your booking preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="checkInTime" className="text-base sm:text-lg font-semibold">Check-in Time</Label>
                          <div className="flex items-center gap-2">
                            <Clock className="flex-shrink-0 text-gray-500" />
                            <Input
                              id="checkInTime"
                              name="checkInTime"
                              type="time"
                              value={formData.checkInTime}
                              onChange={handleInputChange}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="checkOutTime" className="text-base sm:text-lg font-semibold">Check-out Time</Label>
                          <div className="flex items-center gap-2">
                            <Clock className="flex-shrink-0 text-gray-500" />
                            <Input
                              id="checkOutTime"
                              name="checkOutTime"
                              type="time"
                              value={formData.checkOutTime}
                              onChange={handleInputChange}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <span className="text-sm text-gray-500">Check-in Time</span>
                          <div className="flex items-center gap-2">
                            <Clock className="flex-shrink-0 text-gray-500" />
                            <span className="text-base sm:text-lg">{formData.checkInTime || 'Not set'}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm text-gray-500">Check-out Time</span>
                          <div className="flex items-center gap-2">
                            <Clock className="flex-shrink-0 text-gray-500" />
                            <span className="text-base sm:text-lg">{formData.checkOutTime || 'Not set'}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl sm:text-2xl">Appearance Settings</CardTitle>
                  <CardDescription>Customize your hotel's visual identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="logo" className="text-base sm:text-lg font-semibold">Hotel Logo</Label>
                    {fileError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{fileError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-1/3">
                        {hotel?.[0]?.logo ? (
                          <img
                          src={getImageUrl(hotel[0].logo)}
                            alt="Hotel Logo"
                            className="w-full max-w-[200px] h-auto object-contain rounded-lg border mx-auto sm:mx-0"
                          />
                        ) : (
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-full max-w-[200px] h-[200px] bg-muted rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                              <Image className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <span className="text-muted-foreground text-sm italic text-center sm:text-left">
                              {isEditing ? 'Upload a logo' : 'No logo uploaded'}
                            </span>
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="w-full sm:w-2/3 space-y-4">
                          <Input
                            id="logo"
                            type="file"
                            onChange={handleLogoChange}
                            accept="image/*"
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Requirements:</p>
                            <ul className="list-disc list-inside ml-2">
                              <li>Maximum file size: 2MB</li>
                              <li>Maximum dimensions: 200x200 pixels</li>
                              <li>Accepted formats: PNG, JPG, JPEG</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsContent;
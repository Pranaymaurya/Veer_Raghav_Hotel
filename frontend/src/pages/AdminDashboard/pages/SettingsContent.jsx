import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Mail, Phone, MapPin, Image, Plus, Trash2, Settings } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { useToast } from '@/hooks/use-toast';
import { validateHotelData } from '../components/hotelValidation';


const SettingsContent = () => {
  const { hotel, isLoading, createHotel, updateHotel, uploadLogo } = useSettings();
  const [formData, setFormData] = useState({
    hotelName: '',
    // contactEmails: [''],
    contactPhones: [''],
    address: '',
    checkInTime: '',
    checkOutTime: '',
    // enableBooking: false,
  });
  const [logoFile, setLogoFile] = useState(null);
  const { toast } = useToast();


  console.log("Hotel Data:", hotel?.length);
  

  useEffect(() => {
    if (hotel?.length > 0) {
      setFormData({
        hotelName: hotel.hotelName || '',
        // contactEmails: hotel.contactEmails || [''],
        contactPhones: hotel.contactPhones || [''],
        address: hotel.address || '',
        checkInTime: hotel.checkInTime || '',
        checkOutTime: hotel.checkOutTime || '',
        // enableBooking: hotel.enableBooking || false,
      });
    }
  }, [hotel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const handleEmailChange = (index, value) => {
  //   const newEmails = [...formData.contactEmails];
  //   newEmails[index] = value;
  //   setFormData(prev => ({ ...prev, contactEmails: newEmails }));
  // };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.contactPhones];
    newPhones[index] = value;
    setFormData(prev => ({ ...prev, contactPhones: newPhones }));
  };

  // const addEmail = () => {
  //   setFormData(prev => ({ ...prev, contactEmails: [...prev.contactEmails, ''] }));
  // };

  const addPhone = () => {
    setFormData(prev => ({ ...prev, contactPhones: [...prev.contactPhones, ''] }));
  };

  // const removeEmail = (index) => {
  //   const newEmails = formData.contactEmails.filter((_, i) => i !== index);
  //   setFormData(prev => ({ ...prev, contactEmails: newEmails }));
  // };

  const removePhone = (index) => {
    const newPhones = formData.contactPhones.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, contactPhones: newPhones }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (hotel?.length > 0) {
        response = await updateHotel(formData);
      } else {
        response = await createHotel(formData);
      }

      if (logoFile) {
        await uploadLogo(logoFile);
      }

      toast({
        title: hotel?.length > 0 ? "Hotel Updated" : "Hotel Created",
        description: hotel?.length > 0 ? "Your changes have been saved successfully." : "New hotel has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to save hotel:', error);
      toast({
        title: "Error",
        description: `Failed to ${hotel ? 'update' : 'create'} hotel. Please try again.`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {hotel?.length > 0 ? 'Update Hotel Information' : 'Create New Hotel'}
          </CardTitle>
          <CardDescription>
            {hotel?.length > 0 ? 'Manage your hotel\'s configuration and appearance' : 'Set up your new hotel'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <TabsTrigger value="general" className="w-full">General</TabsTrigger>
                <TabsTrigger value="booking" className="w-full">Booking</TabsTrigger>
                <TabsTrigger value="appearance" className="w-full">Appearance</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Basic details about your hotel</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="hotelName" className="text-lg font-semibold">Hotel Name</Label>
                      <Input
                        id="hotelName"
                        name="hotelName"
                        value={formData.hotelName}
                        onChange={handleInputChange}
                        placeholder="Enter hotel name"
                        className="flex-grow"
                        required
                      />
                    </div>
                    {/* <div className="flex flex-col space-y-2">
                      <Label className="text-lg font-semibold">Contact Emails</Label>
                      {formData.contactEmails.map((email, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Mail className="text-gray-500" />
                          <Input
                            value={email}
                            onChange={(e) => handleEmailChange(index, e.target.value)}
                            placeholder="Enter contact email"
                            className="flex-grow"
                            type="email"
                            required
                          />
                          {index > 0 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addEmail}>
                        <Plus className="mr-2 h-4 w-4" /> Add Email
                      </Button>
                    </div> */}
                    <div className="flex flex-col space-y-2">
                      <Label className="text-lg font-semibold">Contact Phones</Label>
                      {formData.contactPhones.map((phone, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Phone className="text-gray-500" />
                          <Input
                            value={phone}
                            onChange={(e) => handlePhoneChange(index, e.target.value)}
                            placeholder="Enter contact phone"
                            className="flex-grow"
                            required
                          />
                          {index > 0 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addPhone}>
                        <Plus className="mr-2 h-4 w-4" /> Add Phone
                      </Button>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="address" className="text-lg font-semibold">Address</Label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="text-gray-500" />
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter hotel address"
                          className="flex-grow"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="booking">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Configuration</CardTitle>
                    <CardDescription>Set up your booking preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="checkInTime" className="text-lg font-semibold">Check-in Time</Label>
                        <div className="flex items-center space-x-2">
                          <Clock className="text-gray-500" />
                          <Input
                            id="checkInTime"
                            name="checkInTime"
                            type="time"
                            value={formData.checkInTime}
                            onChange={handleInputChange}
                            className="flex-grow"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="checkOutTime" className="text-lg font-semibold">Check-out Time</Label>
                        <div className="flex items-center space-x-2">
                          <Clock className="text-gray-500" />
                          <Input
                            id="checkOutTime"
                            name="checkOutTime"
                            type="time"
                            value={formData.checkOutTime}
                            onChange={handleInputChange}
                            className="flex-grow"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <Switch
                        id="enableBooking"
                        checked={formData.enableBooking}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableBooking: checked }))}
                      />
                      <Label htmlFor="enableBooking" className="text-lg font-semibold">Enable Booking</Label>
                    </div> */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize your hotel's visual identity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="logo" className="text-lg font-semibold">Hotel Logo</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Image className="text-gray-500 w-16 h-16" />
                        </div>
                        <div className="flex-grow">
                          <Input
                            id="logo"
                            type="file"
                            onChange={handleLogoChange}
                            accept="image/*"
                            className="w-full"
                          />
                          <p className="text-sm text-gray-500 mt-2">
                            Recommended size: 200x200 pixels, Max file size: 2MB
                          </p>
                        </div>
                        {hotel?.length > 0 && hotel.logoUrl && (
                          <img
                            src={hotel.logoUrl}
                            alt="Current Logo"
                            className="w-16 h-16 object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <Separator className="my-6" />
              <div className="flex justify-end">
                <Button type="submit" size="lg">
                  {hotel?.length > 0 ? 'Update Hotel' : 'Create Hotel'}
                </Button>
              </div>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsContent;


import React, { useState } from 'react';
// import { useSettings } from '../contexts/SettingsContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "@/components/ui/use-toast";
import { Clock, Mail, Phone, MapPin, DollarSign, Image, Bell } from 'lucide-react';
import { useSettings } from '../SettingsContext';

const SettingsContent = () => {
  const { settings, updateSettings, uploadLogo } = useSettings();
  const [logoFile, setLogoFile] = useState(null);
  const [formData, setFormData] = useState({
    hotelName: settings.hotelName || 'Veer Raghav Hotel',
    contactEmail: settings.contactEmail || 'veer.raghav@pm.me',
    contactPhone: settings.contactPhone || '',
    address: settings.address || '',
    checkInTime: settings.checkInTime || '',
    checkOutTime: settings.checkOutTime || '',
    enableBooking: settings.enableBooking || false,
    currencySymbol: settings.currencySymbol || '$',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({ ...prev, enableBooking: checked }));
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
      await updateSettings(formData);
      if (logoFile) {
        await uploadLogo(logoFile);
      }
      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Admin Settings</CardTitle>
          <CardDescription>Manage your hotel's configuration and appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <TabsTrigger value="general" className="w-full">General</TabsTrigger>
              <TabsTrigger value="booking" className="w-full">Booking</TabsTrigger>
              <TabsTrigger value="appearance" className="w-full">Appearance</TabsTrigger>
              <TabsTrigger value="notifications" className="w-full">Notifications</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit}>
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Basic details about your hotel</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="hotelName" className="text-lg font-semibold">Hotel Name</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="hotelName"
                          name="hotelName"
                          value={formData.hotelName}
                          onChange={handleInputChange}
                          placeholder="Enter hotel name"
                          className="flex-grow"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="contactEmail" className="text-lg font-semibold">Contact Email</Label>
                        <div className="flex items-center space-x-2">
                          <Mail className="text-gray-500" />
                          <Input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            placeholder="Enter contact email"
                            className="flex-grow"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="contactPhone" className="text-lg font-semibold">Contact Phone</Label>
                        <div className="flex items-center space-x-2">
                          <Phone className="text-gray-500" />
                          <Input
                            id="contactPhone"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            placeholder="Enter contact phone"
                            className="flex-grow"
                          />
                        </div>
                      </div>
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
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="currencySymbol" className="text-lg font-semibold">Currency Symbol</Label>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="text-gray-500" />
                        <Input
                          id="currencySymbol"
                          name="currencySymbol"
                          value={formData.currencySymbol}
                          onChange={handleInputChange}
                          placeholder="Enter currency symbol"
                          className="flex-grow"
                        />
                      </div>
                    </div>
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
                        {settings.logoUrl && (
                          <img
                            src={settings.logoUrl}
                            alt="Current Logo"
                            className="w-16 h-16 object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage your notification settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Bell className="text-gray-500" />
                      <p className="text-lg text-gray-700">
                        Notification settings will be implemented in a future update.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <Separator className="my-6" />
              <div className="flex justify-end">
                <Button type="submit" size="lg">Save All Changes</Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsContent;


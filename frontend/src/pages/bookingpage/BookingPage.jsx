import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Calendar,
  CreditCard, 
  UserCircle, 
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  CalendarCheck,
  Building,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/hooks/useAuth';

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [isManualBooking, setIsManualBooking] = useState(false);
  
  const isAdmin = user.role === 'admin';

  // Updated form state to use single name field
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const calculateTaxesAndFees = (basePrice) => {
    const gst = basePrice * 0.18;
    const serviceFee = basePrice * 0.05;
    const municipalTax = basePrice * 0.02;
    
    return {
      gst,
      serviceFee,
      municipalTax,
      total: gst + serviceFee + municipalTax
    };
  };

  useEffect(() => {
    if (location.state?.booking) {
      setBookingData(location.state.booking);
    } else {
      navigate('/rooms');
    }

    // Pre-fill form data with single name field
    if (user && !isAdmin) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [location, navigate, user, isAdmin]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingDetails = {
      roomId: bookingData.roomId,
      roomName: bookingData.roomName,
      roomType: bookingData.roomType,
      roomCapacity: bookingData.roomCapacity,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      nights: bookingData.nights,
      guests: bookingData.guests,
      price: bookingData.price,
      customerInfo: formData,
      taxesAndFees: calculateTaxesAndFees(bookingData.price)
    };
    
    navigate('/payment', { state: bookingDetails });
  };

  if (!bookingData) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Loading booking details...</h2>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const taxesAndFees = calculateTaxesAndFees(bookingData.price);
  const totalAmount = bookingData.price + taxesAndFees.total;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(`/rooms/${bookingData.roomId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Room Details
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl">Guest Information</CardTitle>
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="manual-booking">Manual Booking</Label>
                  <Switch
                    id="manual-booking"
                    checked={isManualBooking}
                    onCheckedChange={setIsManualBooking}
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isAdmin && (
                <Alert className="mb-6">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Admin Booking Mode</AlertTitle>
                  <AlertDescription>
                    You are making a booking as an administrator. {isManualBooking ? 'Manual booking enabled.' : 'Using your admin profile.'}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertTitle>Free Cancellation</AlertTitle>
                  <AlertDescription>
                    Cancel before {format(new Date(bookingData.startDate), 'PP')} for a full refund
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full">
                  Proceed to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{bookingData.roomName}</h3>
                <p className="text-muted-foreground">{bookingData.roomType}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    <span>Check-in</span>
                  </div>
                  <span className="font-medium">
                    {format(new Date(bookingData.startDate), 'PP')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Check-out</span>
                  </div>
                  <span className="font-medium">
                    {format(new Date(bookingData.endDate), 'PP')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Guests</span>
                  </div>
                  <span className="font-medium">{bookingData.guests}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Rooms</span>
                  </div>
                  <span className="font-medium">
                    {Math.ceil(bookingData.guests / bookingData.roomCapacity)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room Rate ({bookingData.nights} nights)</span>
                  <span>₹{bookingData.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>₹{taxesAndFees.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee (5%)</span>
                  <span>₹{taxesAndFees.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Municipal Tax (2%)</span>
                  <span>₹{taxesAndFees.municipalTax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CreditCard, Clock, Shield, CheckCircle2, ArrowLeft, Building, User, CalendarCheck, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentProcessingModal } from './PaymentProcessingModal';
import { useBooking } from '@/context/BookingContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createBooking } = useBooking();
  const { user } = useAuth();
  // console.log(user._id);
  
  const [bookingData, setBookingData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (location.state && location.state.roomId) {
      setBookingData(location.state);
    } else {
      navigate('/rooms');
    }
  }, [location, navigate]);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = value.replace(/\s/g, '')
                           .match(/.{1,4}/g)?.join(' ') || '';
    }
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '')
                           .match(/.{1,2}/g)?.join('/') || '';
    }
    if (name === 'cvv') {
      formattedValue = value.slice(0, 4);
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!bookingData?.roomId) {
      toast({
        title: "Error",
        description: "Room ID is missing. Please try booking again.",
        variant: "destructive",
      });
      return;
    }
    setShowPaymentModal(true);
  };

  // console.log('bookingData.roomId', bookingData.roomId, 'userId', user.userId);
  

  const handleBookingSuccess = async () => {
    try {
      const bookingPayload = {
        userId: user?._id,
        roomId: bookingData?.roomId,
        checkInDate: bookingData?.startDate,
        checkOutDate: bookingData?.endDate,
        totalPrice: bookingData?.price + bookingData?.taxesAndFees.total,
      };
  
      const response = await createBooking(bookingPayload);
      
      if (response.success) {
        setShowPaymentModal(false);
        
        toast({
          title: "Booking Success",
          description: "Your booking has been successfully created.",
          variant: "default",
          className: "bg-green-200 border-green-400 text-black"
        });
  
        navigate('/booking/success', {
          state: {
            ...response.booking,
            roomName: bookingData.roomName,
            roomType: bookingData.roomType
          }
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setShowPaymentModal(false);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!bookingData) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Loading payment details...</h2>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Secure Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card">Card Payment</TabsTrigger>
                  <TabsTrigger value="upi">UPI Payment</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card">
                  <form onSubmit={handlePayment} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="number"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={handleCardInputChange}
                        maxLength="19"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        name="name"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={handleCardInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={handleCardInputChange}
                          maxLength="5"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="password"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange}
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                    >
                      Pay ₹{(bookingData.price + bookingData.taxesAndFees.total).toFixed(2)}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="upi">
                  <form onSubmit={handlePayment} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="username@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                    >
                      Pay ₹{(bookingData.price + bookingData.taxesAndFees.total).toFixed(2)}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Your payment is secured with industry-standard encryption</span>
              </div>
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
                  <span>₹{bookingData.taxesAndFees.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>₹{bookingData.taxesAndFees.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Municipal Tax</span>
                  <span>₹{bookingData.taxesAndFees.municipalTax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>₹{(bookingData.price + bookingData.taxesAndFees.total).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Secure SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Protected by Bank-level Security</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentProcessingModal 
        isOpen={showPaymentModal}
        bookingData={bookingData}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}


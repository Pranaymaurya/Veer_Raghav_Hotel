import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  CheckCircle2,
  CalendarCheck,
  Clock,
  User,
  Building,
  Phone,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { IoLogoWhatsapp } from 'react-icons/io5';

export default function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  useEffect(() => {
    if (!location.state) {
      navigate('/rooms');
    }
  }, [location, navigate]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate('/rooms')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Booking ID: {bookingData.bookingId}
          </p>
        </div>

        <Alert className="bg-green-50">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your booking has been confirmed. You will receive updates about your booking on WhatsApp and email.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{bookingData.roomName}</h3>
              <p className="text-muted-foreground">{bookingData.roomType}</p>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  <span>Check-in</span>
                </div>
                <span className="font-medium">
                  {format(new Date(bookingData.startDate), 'PPP')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Check-out</span>
                </div>
                <span className="font-medium">
                  {format(new Date(bookingData.endDate), 'PPP')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Guests</span>
                </div>
                <span className="font-medium">{bookingData.guests}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Room Rate ({bookingData.nights} nights)</span>
                <span>₹{bookingData.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes & Fees</span>
                <span>₹{bookingData.taxesAndFees.total.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount Paid</span>
                <span>₹{(bookingData.price + bookingData.taxesAndFees.total).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <IoLogoWhatsapp className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">WhatsApp Updates</p>
                <p className="text-sm text-muted-foreground">You'll receive booking updates and reminders on your registered WhatsApp number</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-muted-foreground">Booking confirmation and updates will be sent to your email address</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
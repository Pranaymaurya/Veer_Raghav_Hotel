import React, { useEffect, useRef, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  BookOpen,
  Settings,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Edit,
  Trash2,
  Camera,
  Bell,
  Command,
} from "lucide-react";
import { FcBusinessman } from "react-icons/fc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import UserProfile from "./components/UserProfile";
const UserProfileLayout = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const bookingsRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modifiedBooking, setModifiedBooking] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneno || "",
    address: user?.address || "N/A",
    age: user?.age || "",
    avatar: user?.avatar || "/api/placeholder/150/150",
  });
  const sampleBookings = [
    {
      id: "BK001",
      roomname: "Deluxe",
      checkInDate: "2024-12-28",
      checkOutDate: "2024-12-29",
      status: "Pending",
      totalPrice: "$85.00",
    },
    {
      id: "BK001",
      roomname: "Deluxe",
      checkInDate: "2024-12-28",
      checkOutDate: "2024-12-29",
      status: "Pending",
      totalPrice: "$85.00",
    },
    {
      id: "BK001",
      roomname: "Deluxe",
      checkInDate: "2024-12-28",
      checkOutDate: "2024-12-29",
      status: "Pending",
      totalPrice: "$85.00",
    },
    {
      id: "BK001",
      roomname: "Deluxe",
      checkInDate: "2024-12-28",
      checkOutDate: "2024-12-29",
      status: "completed",
      totalPrice: "$85.00",
    },
  ];
  const handleModifyClick = (booking) => {
    setSelectedBooking(booking);
    setModifiedBooking({ ...booking });
    setShowModifyDialog(true);
  };
  const handleModifyBooking = () => {
    // Implement your booking modification logic here
    console.log("Modified booking:", modifiedBooking);
    setShowModifyDialog(false);
  };

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  useEffect(() => {
    if (location.hash === "#mybookings" && bookingsRef.current) {
      const scrollToBookings = () => {
        bookingsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      };
      scrollToBookings();
      const timer = setTimeout(scrollToBookings, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user.role !== "user") {
    return <Navigate to="/" replace />;
  }

  const handleUpdateProfile = () => {
    // Implement profile update logic here
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    setShowDeleteDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg p-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {/* <img
                src={userDetails.avatar}
                alt={userDetails.name}
                className="w-24 h-24 rounded-full border-4 border-white"
              /> */}

              <FcBusinessman
              className="w-24 h-24 rounded-full border-4 border-white" />
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-orange-600 hover:bg-gray-100">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userDetails.name}</h1>
              <p className="text-blue-100">
                Member since{" "}
                {new Date(userDetails.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <UserProfile />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditing ? (
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name
                        </label>
                        <Input
                          value={userDetails.name}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={userDetails.email}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Phone
                        </label>
                        <Input
                          value={userDetails.phone}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Age
                        </label>
                        <Input
                          value={userDetails.age}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              age: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Address
                        </label>
                        <Input
                          value={userDetails.address}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button onClick={handleUpdateProfile}>
                        Save Changes
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{userDetails.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{userDetails.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{userDetails.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Command className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{userDetails.age}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{userDetails.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bookings Section */}
            <Card ref={bookingsRef} id="mybookings">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  My Room Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sampleBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {booking.roomname} Room
                          </h3>
                          <p className="text-gray-600">
                            Booking ID: {booking.id}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Check-in Date</p>
                          <p className="font-medium">
                            {new Date(booking.checkInDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Check-out Date</p>
                          <p className="font-medium">
                            {new Date(booking.checkOutDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <span className="font-semibold text-lg">
                          Total: {booking.totalPrice}
                        </span>
                        <div className="space-x-2">
                          {booking.status.toLowerCase() === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleModifyClick(booking)}
                              >
                                Modify Booking
                              </Button>
                              <Button variant="destructive" size="sm">
                                Cancel
                              </Button>
                            </>
                          )}
                          {booking.status.toLowerCase() === "confirmed" && (
                            <Button variant="outline" size="sm">
                              Download Invoice
                            </Button>
                          )}
                        </div>
                        <Dialog
                          open={showModifyDialog}
                          onOpenChange={setShowModifyDialog}
                        >
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Modify Booking</DialogTitle>
                              <DialogDescription>
                                Update your booking details below
                              </DialogDescription>
                            </DialogHeader>

                            {modifiedBooking && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="bookingId">
                                      Booking ID
                                    </Label>
                                    <Input
                                      id="bookingId"
                                      value={modifiedBooking.id}
                                      disabled
                                      className="bg-gray-50"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="roomType">Room Type</Label>
                                    <Input
                                      id="roomType"
                                      value={modifiedBooking.roomname}
                                      onChange={(e) =>
                                        setModifiedBooking({
                                          ...modifiedBooking,
                                          roomname: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="checkIn">
                                      Check-in Date
                                    </Label>
                                    <Input
                                      id="checkIn"
                                      type="date"
                                      value={modifiedBooking.checkInDate}
                                      onChange={(e) =>
                                        setModifiedBooking({
                                          ...modifiedBooking,
                                          checkInDate: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="checkOut">
                                      Check-out Date
                                    </Label>
                                    <Input
                                      id="checkOut"
                                      type="date"
                                      value={modifiedBooking.checkOutDate}
                                      onChange={(e) =>
                                        setModifiedBooking({
                                          ...modifiedBooking,
                                          checkOutDate: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Input
                                      id="status"
                                      value={modifiedBooking.status}
                                      disabled
                                      className="bg-gray-50"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="price">Total Price</Label>
                                    <Input
                                      id="price"
                                      value={modifiedBooking.totalPrice}
                                      disabled
                                      className="bg-gray-50"
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => setShowModifyDialog(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button onClick={handleModifyBooking}>
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings and Account Management */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Preferences
                  </Button>
                  <Dialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete your account? This
                          action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                        >
                          Delete Account
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertDescription>
                Need help? Contact our support team for assistance.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileLayout;

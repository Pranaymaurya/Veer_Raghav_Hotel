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
import UserBookings from "./components/UserBookings";
import UserSettings from "./components/UserSettings";
import { Separator } from "@/components/ui/separator";
const UserProfileLayout = () => {
  const { user, loading, deleteAccount } = useAuth();
  const location = useLocation();
  const bookingsRef = useRef(null);
  

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
  }, [location.hash, location.pathname, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // if (user.role !== "user") {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div className="min-h-screen">
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
              <h1 className="text-3xl font-bold capitalize">{user?.name}</h1>
              <p className="text-blue-100">
                Member since{" "}
                {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex gap-8">
            {/* Profile Information */}

            <UserProfile />

            {/* Settings */}
            <div className="hidden md:block">
              <UserSettings />
            </div>
          </div>

          <Separator className="my-8" />

          <div ref={bookingsRef}>
            <UserBookings />
          </div>

          <Separator className="my-8" />
          
          <div className="block md:hidden pt-10">
            <UserSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileLayout;

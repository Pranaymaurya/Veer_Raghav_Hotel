// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, Navigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import {
//   BookOpen,
//   Settings,
//   User,
//   Mail,
//   Phone,
//   Calendar,
//   MapPin,
//   Shield,
//   Edit,
//   Trash2,
//   Camera,
//   Bell,
//   Command,
// } from "lucide-react";
// import { FcBusinessman } from "react-icons/fc";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Label } from "@/components/ui/label";
// import UserProfile from "./components/UserProfile";
// import UserBookings from "./components/UserBookings";
// import UserSettings from "./components/UserSettings";
// import { Separator } from "@/components/ui/separator";
// const UserProfileLayout = () => {
//   const { user, loading, deleteAccount } = useAuth();
//   const location = useLocation();
//   const bookingsRef = useRef(null);


//   useEffect(() => {
//     if (location.hash === "#mybookings" && bookingsRef.current) {
//       const scrollToBookings = () => {
//         bookingsRef.current?.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       };
//       scrollToBookings();
//       const timer = setTimeout(scrollToBookings, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [location.hash, location.pathname, user]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   // if (!user) {
//   //   return <Navigate to="/" replace />;
//   // }

//   // if (user.role !== "user") {
//   //   return <Navigate to="/" replace />;
//   // }

//   return (
//     <div className="min-h-screen">
//       <div className="container mx-auto px-4 py-8">
//         {/* Hero Section */}
//         <div className="relative mb-8 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg p-8 text-white">
//           <div className="flex items-center space-x-6">
//             <div className="relative">
//               {/* <img
//                 src={userDetails.avatar}
//                 alt={userDetails.name}
//                 className="w-24 h-24 rounded-full border-4 border-white"
//               /> */}

//               <FcBusinessman
//                 className="w-24 h-24 rounded-full border-4 border-white" />
//               <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-orange-600 hover:bg-gray-100">
//                 <Camera className="w-4 h-4" />
//               </button>
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold capitalize">{user?.name}</h1>
//               <p className="text-blue-100">
//                 Member since{" "}
//                 {new Date(user?.createdAt).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col">
//           <div className="flex gap-8">
//             {/* Profile Information */}

//             <UserProfile />

//             {/* Settings */}
//             <div className="hidden md:block">
//               <UserSettings />
//             </div>
//           </div>

//           <Separator className="my-8" />

//           <div ref={bookingsRef}>
//             <UserBookings />
//           </div>

//           <Separator className="my-8" />

//           <div className="block md:hidden pt-10">
//             <UserSettings />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfileLayout;


import React from "react";
import { useLocation, NavLink, Routes, Route, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Camera,
  User,
  Calendar,
  Menu
} from "lucide-react";
import { FcBusinessman } from "react-icons/fc";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const UserProfileLayout = () => {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      title: "Profile",
      icon: User,
      path: "/profile"
    },
    {
      title: "My Bookings",
      icon: Calendar,
      path: "/profile/bookings"
    }
  ];

  const isLinkActive = (path) => {
    if (path === "/profile") {
      return location.pathname === "/profile";
    }
    return location.pathname === path;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderSidebarContent = () => (
    <div className="w-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={
                  cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-orange-100 hover:text-orange-600",
                    isLinkActive(item.path) ? "bg-orange-100 text-orange-600" : "text-gray-500"
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Rest of the component remains the same
  return (
    <div className="min-h-screen bg-white border-t">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white shadow-sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        <div className="hidden lg:flex lg:flex-col w-72 h-screen bg-white border-r border-gray-200">
          <div className="flex-shrink-0 flex items-center h-16 px-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">My Account</h1>
          </div>
          {renderSidebarContent()}
        </div>

        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative mb-8 bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-8 shadow-lg">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full p-1">
                    <FcBusinessman className="w-full h-full rounded-full" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-orange-600 hover:bg-gray-100 shadow-md transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h1 className="text-3xl font-bold capitalize text-white mb-1">{user?.name}</h1>
                  <p className="text-orange-100">
                    Member since{" "}
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="text-sm">
                    <Link className="text-orange-100 underline italic hover:no-underline" to="/profile/bookings">Go to My Bookings</Link>
                  </div>
                </div>
              </div>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfileLayout;
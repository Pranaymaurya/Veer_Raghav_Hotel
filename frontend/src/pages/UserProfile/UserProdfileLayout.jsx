import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Camera } from "lucide-react";
import { FcBusinessman } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";

import UserProfile from "./components/UserProfile";
import UserBookings from "./components/UserBookings";
import UserSettings from "./components/UserSettings";

const UserProfileLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const bookingsRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#mybookings" && bookingsRef.current) {
      const scrollToBookings = () => {
        bookingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      scrollToBookings();
      return () => clearTimeout(setTimeout(scrollToBookings, 100));
    }
  }, [location.hash]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-8 shadow-lg">
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
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <UserProfile />
            </div>
            <div className="hidden md:block">
              <UserSettings />
            </div>
          </div>

          <Separator />

          <div ref={bookingsRef}>
            <UserBookings />
          </div>

          <Separator />
          
          <div className="md:hidden">
            <UserSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileLayout;



// import React from "react";
// import { useLocation, NavLink, Routes, Route } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import {
//   Camera,
//   User,
//   Calendar,
//   Menu
// } from "lucide-react";
// import { FcBusinessman } from "react-icons/fc";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// import UserProfile from "./components/UserProfile";
// import UserBookings from "./components/UserBookings";
// import UserSettings from "./components/UserSettings";

// const UserProfileLayout = () => {
//   const { user, loading } = useAuth();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

//   const navigationItems = [
//     {
//       title: "Profile",
//       icon: User,
//       path: "/profile"
//     },
//     {
//       title: "My Bookings",
//       icon: Calendar,
//       path: "/profile/bookings"
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   const renderSidebarContent = () => (
//     <div className="w-full">
//       <div className="space-y-4 py-4">
//         <div className="px-3 py-2">
//           <div className="space-y-1">
//             {navigationItems.map((item) => (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   cn(
//                     "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-orange-100 hover:text-orange-600",
//                     isActive ? "bg-orange-100 text-orange-600" : "text-gray-500"
//                   )
//                 }
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <item.icon className="mr-3 h-4 w-4" />
//                 {item.title}
//               </NavLink>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="lg:hidden fixed top-4 left-4 z-50">
//         <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
//           <SheetTrigger asChild>
//             <Button variant="outline" size="icon" className="bg-white shadow-sm">
//               <Menu className="h-5 w-5" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-64">
//             {renderSidebarContent()}
//           </SheetContent>
//         </Sheet>
//       </div>

//       <div className="flex">
//         <div className="hidden lg:flex lg:flex-col w-72 h-screen bg-white border-r border-gray-200">
//           <div className="flex-shrink-0 flex items-center h-16 px-6 border-b">
//             <h1 className="text-xl font-bold text-gray-900">My Account</h1>
//           </div>
//           {renderSidebarContent()}
//         </div>

//         <main className="flex-1">
//           <div className="px-4 sm:px-6 lg:px-8 py-8">
//             <div className="relative mb-8 bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-8 shadow-lg">
//               <div className="flex items-center space-x-6">
//                 <div className="relative">
//                   <div className="w-24 h-24 bg-white rounded-full p-1">
//                     <FcBusinessman className="w-full h-full rounded-full" />
//                   </div>
//                   <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-orange-600 hover:bg-gray-100 shadow-md transition-colors">
//                     <Camera className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold capitalize text-white mb-1">{user?.name}</h1>
//                   <p className="text-orange-100">
//                     Member since{" "}
//                     {new Date(user?.createdAt).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <Routes>
//               <Route
//                 path="/"
//                 element={
//                   <div className="grid lg:grid-cols-3 gap-8">
//                     <div className="lg:col-span-2">
//                       <UserProfile />
//                     </div>
//                     <div>
//                       <UserSettings />
//                     </div>
//                   </div>
//                 }
//               />
//               <Route path="/bookings" element={<UserBookings />} />
//             </Routes>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UserProfileLayout;
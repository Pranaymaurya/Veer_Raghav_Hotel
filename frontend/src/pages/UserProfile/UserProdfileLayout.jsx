import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Camera,
} from "lucide-react";
import { FcBusinessman } from "react-icons/fc";

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

  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

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




// import React, { useEffect, useRef } from "react";
// import { useLocation, NavLink, Routes, Route } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import {
//   Camera,
//   User,
//   Calendar,
//   Menu,
//   X
// } from "lucide-react";
// import { FcBusinessman } from "react-icons/fc";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Separator } from "@/components/ui/separator";

// import UserProfile from "./components/UserProfile";
// import UserBookings from "./components/UserBookings";
// import UserSettings from "./components/UserSettings";

// const UserProfileLayout = () => {
//   const { user, loading } = useAuth();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
//   const location = useLocation();

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
//                     "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-orange-100 hover:text-orange-600",
//                     isActive ? "bg-orange-100 text-orange-600" : "text-gray-500"
//                   )
//                 }
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <item.icon className="mr-2 h-4 w-4" />
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
//       {/* Mobile Menu Button */}
//       <div className="lg:hidden fixed top-4 left-4 z-50">
//         <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <Menu className="h-6 w-6" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-64">
//             {renderSidebarContent()}
//           </SheetContent>
//         </Sheet>
//       </div>

//       <div className="">
//         {/* Sidebar - Desktop */}
//         <div className="hidden lg:flex lg:flex-col inset">
//           <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
//             <div className="flex-shrink-0 flex items-center h-16 px-4">
//               <h1 className="text-xl font-bold text-gray-900">My Account</h1>
//             </div>
//             {renderSidebarContent()}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="lg:pl-64 flex ">
//             {/* <div className="">
//               <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
//                 <div className="flex-shrink-0 flex items-center h-16 px-4">
//                   <h1 className="text-xl font-bold text-gray-900">My Account</h1>
//                 </div>
//                 {renderSidebarContent()}
//               </div>
//             </div> */}
//           <div className="container mx-auto px-4 py-8">
//             {/* Hero Section */}
//             <div className="relative mb-8 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg p-8 text-white">
//               <div className="flex items-center space-x-6">
//                 <div className="relative">
//                   <FcBusinessman className="w-24 h-24 rounded-full border-4 border-white" />
//                   <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-orange-600 hover:bg-gray-100">
//                     <Camera className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold capitalize">{user?.name}</h1>
//                   <p className="text-blue-100">
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

//             {/* Routes */}
//             <Routes>
//               <Route
//                 path="/"
//                 element={
//                   <div className="flex flex-col lg:flex-row gap-8">
//                     <div className="flex-1">
//                       <UserProfile />
//                     </div>
//                     <div className="w-full lg:w-1/3">
//                       <UserSettings />
//                     </div>
//                   </div>
//                 }
//               />
//               <Route
//                 path="/bookings"
//                 element={<UserBookings />}
//               />
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfileLayout;
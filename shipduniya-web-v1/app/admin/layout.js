"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";

import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/custom/Sidebar";
import { getGreeting } from "./utils";
import {
  MenuIcon,
  Package,
  Ticket,
  User,
  Ship,
  Settings,
  ArrowLeftRight,
  CalculatorIcon,
  ArrowRight,
  Cross,
  LayoutDashboard,
  Minus,
  Users,
  Weight,
} from "lucide-react";
// import TrackOrder from "./_components/TrackOrder";
// import OrderBalance from "./_components/OrderBalance";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const navItems = useMemo(
    () => [
      { name: "Dashboard", icon: LayoutDashboard, url: "/admin/dashboard" },
      { name: "Users", icon: Users, url: "/admin/users" },
      { name: "Staff", icon: Users, url: "/admin/staff" },
      { name: "Shipments", icon: Ship, url: "/admin/shipments" },
      { name: "Pending Pickup", icon: Ship, url: "/admin/pending-pickups" },
      { name: "RTO/RTC", icon: Cross, url: "/admin/rto-rtc" },
      { name: "Analytics", icon: Cross, url: "/admin/analytics" },
      { name: "Remittance", icon: ArrowRight, url: "/admin/cod-remittance" },
      { name: "Weight Reconciliation", icon: Weight, url: "/admin/weightReconciliation" },
      {
        name: "Transactions",
        icon: ArrowLeftRight,
        url: "/admin/transactions",
      },
    ],
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/users/profile", {
          signal: controller.signal,
        });
        setUserData(response.data);
      } catch (err) {
        if (err.name === "CanceledError") {
          // Request was canceled – no further action needed.
        } else {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      controller.abort();
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    router.push("/admin/profile");
  };

  const handleLogout = async() => {
   const res = await Cookies.remove("token");
   console.log('res:',res)
    setIsDropdownOpen(false);
    window.location.href = "/login";
  };

  return (
    <html lang="en">
      <body className="flex flex-col bg-gray-100">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex gap-2 items-center justify-center bg-white rounded-lg ">
            <Image
              src="https://storage.googleapis.com/shipduniya/shipDuniyaIcon.jpg"
              height={60}
              width={60}
              alt="Ship Duniya Logo"
              unoptimized
            />
            <Image
              src="https://storage.googleapis.com/shipduniya/shipDuniyaName.png"
              height={130}
              width={130}
              alt="Ship Duniya Logo"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold flex gap-2">
              {getGreeting()}{" "}
              {loading ? "Loading..." : <span>{userData?.name}</span>}
            </h2>
            <span className="flex text-base text-primary gap-2">
              <Minus className="text-primary" /> Welcome to Ship Duniya
            </span>
            {error && (
              <span className="text-xs font-semibold text-red-500">
                {error}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* <TrackOrder />
              <OrderBalance /> */}
            <div className="relative">
              <Button
                variant="ghost"
                className="h-10 bg-gray-100 hover:bg-gray-300"
                onClick={handleDropdownToggle}
              >
                <User className="h-6 w-6" />
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleProfileClick}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button onClick={toggleSidebar} className="block lg:hidden">
              <MenuIcon size={24} />
            </button>
          </div>
        </header>

        <div className="flex overflow-hidden">
          <Sidebar
            sidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            navItems={navItems}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 px-6 py-2">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

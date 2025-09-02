"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowLeft,
  Star,
  Search,
  Sparkles,
  TrendingUp,
  Truck,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Building,
  Weight,
  Ruler,
  Badge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressBar } from "./progress-bar";
import { Timeline } from "./timeline";
import { RatingWidget } from "./rating-widget";
import { TrackingForm } from "./tracking-form";
import Delhivery from "./../../../public/delhivery-logo.svg";
import Xpressbess from "./../../../public/id7P8Xw-H6_1754569773172.png";
import Logo from "./../../../public/shipDuniya.png";
import Image from "next/image";
import axios from "axios";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";

export function TrackingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [partner, setPartner] = useState();
  const [user, setUser] = useState();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [trackingDetails, setTrackingDetails] = useState();

  const [shipmentDetails, setShipmentDetails] = useState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fetchUserDetails = async (awbNumber) => {
    if (!awbNumber) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/user-by-awb`,
        {
          awb: awbNumber,
        }
      );
      setUser(res.data.user);
      setShipmentDetails(res.data.shipment);
      console.log(
        "shipement address check : ",
        res.data.shipment.orderIds[0].consigneeAddress1
      );
      console.log("User Data : ", res.data);

      return res.data;
    } catch (error) {
      console.log("Failed to fetch User Data !", error.message);
    }
  };

  function capitalizeWords(str) {
    if (!str || typeof str !== "string") return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function replaceCourierName(str) {
    if (!str) return "";

    return str
      .replace(/xpressbees/gi, "Shipduniya XB")
      .replace(/delhivery/gi, "Shipduniya DL");
  }

  function replaceFirstAndRemoveRemaining(RaworiginalString) {
    const originalString = replaceCourierName(RaworiginalString);

    const targetWord = originalString.includes("Shipduniya XB")
      ? "Shipduniya XB"
      : "Shipduniya DL";
    const firstIndex = originalString.indexOf(targetWord);

    if (firstIndex === -1) {
      return originalString;
    }

    const partBefore = originalString.substring(0, firstIndex);

    const partAfter = originalString.substring(firstIndex + targetWord.length);

    const cleanedPartAfter = partAfter.replace(new RegExp(targetWord, "g"), "");

    return partBefore + targetWord + cleanedPartAfter;
  }

  const getStatusColor = (status) => {
    const normalizedStatus = status?.trim().toLowerCase();

    switch (normalizedStatus) {
      case "delivered":
        return "text-green-500 0";
      case "rto":
        return "text-rose-400 ";
      case "rto delivered":
        return "text-rose-400 ";
      case "rto lost":
        return "text-rose-400 ";
      case "rto received":
        return "text-rose-400 ";
      case "pending":
        return "text-yellow-500 00";
      case "booked":
        return "text-yellow-500 00";
      case "pending pickup":
        return "text-yellow-500 00";
      case "in transit":
        return "text-blue-500 ";
      case "canceled":
        return "text-red-500";
      case "cancelled":
        return "text-red-500 ";
      case "out for delivery":
        return "text-blue-500 ";
      default:
        return "text-gray-500 ";
    }
  };

  const handleTrackOrder = async (partner, awbNumber) => {
    setIsLoading(true);
    setPartner(partner);

    const userDetails = await fetchUserDetails(awbNumber);
    console.log("User data In handleTrack Order : ", userDetails);

    const response = await axiosInstance.post("/shipping/track-without-login", {
      courier: partner,
      awb: awbNumber,
    });
    const { data } = response;
    setTrackingDetails(data);

    console.log("fetched Response For tracking details : ", data);

    let history = [];
    let status = null;

    if (partner === "xpressbees") {
      history = data?.trackingDetails?.history || [];
    } else if (partner === "ecom") {
      history =
        data?.trackingDetails?.ShipmentData?.[0]?.Shipment?.Scans?.map(
          (scan) => ({
            status_code: scan?.ScanDetail?.StatusCode || "N/A",
            message: scan?.ScanDetail?.Scan || "No message",
            location: scan?.ScanDetail?.ScannedLocation || "Unknown",
            event_time: scan?.ScanDetail?.ScanDateTime || "Unknown time",
          })
        ) || [];
    } else if (partner === "delhivery") {
      // Example assumption: delhivery uses 'scan_type', 'remark', 'location', 'datetime'
      history =
        data?.trackingDetails?.ShipmentData?.[0]?.Shipment?.Scans?.map(
          (scan) => ({
            status_code: scan?.ScanDetail?.StatusCode || "N/A",
            status: scan?.ScanDetail?.Scan,
            message: scan?.ScanDetail?.Instructions || "No message",
            location: scan?.ScanDetail?.ScannedLocation || "Unknown",
            event_time: scan?.ScanDetail?.ScanDateTime || "Unknown time",
          })
        ).reverse() || [];

      status = history[0]?.status;
      console.log("Status  Saving ", status);
      console.log("History in handle TrackOrder Details :", history);
    }

    const timelineEvents =
      history?.map((event, idx) => ({
        id: idx + 1,
        status: capitalizeWords(event.message),
        date: new Date(event.event_time).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: new Date(event.event_time).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: event.location,
        message: capitalizeWords(event.message),
        status_code: event.status_code,
        isActive: idx === 0, // first event as active
      })) || [];

    console.log("timeline Events:", timelineEvents);
    // Build tracking data
    const Build_Data = {
      trackingNumber: awbNumber || data.awb,
      courier: partner,
      courierLogo:
        partner?.toLowerCase() === "xpressbees" ? Xpressbess : Delhivery,
      status:
        capitalizeWords(data?.trackingDetails?.status) || status || "Unknown",
      statusMessage: timelineEvents.length
        ? timelineEvents[0].message
        : "No updates yet",
      status_Code: timelineEvents.length
        ? timelineEvents[0]?.status_code
        : "no code ",
      deliveryDate:
        new Date(data?.trackingDetails.pdd).toLocaleDateString() || null,
      pod_link: data.trackingDetails?.pod_link || null,
      lastUpdated: timelineEvents.length
        ? `${timelineEvents[0].date}, ${timelineEvents[0].time}`
        : "",
      progress:
        userDetails?.shipment?.status?.toLowerCase() === "delivered" ? 100 : 75,
      customer: {
        name: userDetails?.shipment?.orderIds[0].consignee,
        contact: `+91 ${userDetails?.user?.phone}`,
        address: userDetails?.shipment?.orderIds[0]?.consigneeAddress1 || "",
      },
      seller: {
        name: userDetails?.user?.name,
        contact: `+91 ${userDetails?.user?.phone}`,
        address: userDetails?.user?.address || "",
      },
      packageDetails: {
        weight:
          userDetails?.shipment?.orderIds[0]?.actualWeight >
          userDetails?.shipment?.orderIds[0]?.volumetricWeight
            ? userDetails?.shipment?.orderIds[0]?.actualWeight
            : userDetails?.shipment?.orderIds[0]?.volumetricWeight || "N/A",
        dimensions:
          `${userDetails?.shipment?.orderIds[0]?.length} X ${userDetails?.shipment?.orderIds[0]?.breadth} X ${userDetails?.shipment?.orderIds[0]?.height}` ||
          "N/A",
        value: userDetails?.shipment?.orderIds[0]?.collectableValue || 0,
        paymentMode: userDetails?.shipment?.orderIds[0]?.orderType || "N/A",
        serviceType: userDetails?.shipment?.partnerDetails?.name || "N/A",
      },
      timeline: timelineEvents,
    };

    setTrackingData(Build_Data);
    setIsLoading(false);
  };

  const handleNewSearch = () => {
    if (pathname !== "/tracking") {
      router.push("/tracking");
    }
    setTimeout(() => {
      setTrackingData(null);
    }, 1000);
  };

  useEffect(() => {
    if (user?.avatar?.data?.data) {
      const byteArray = new Uint8Array(user.avatar.data.data);
      const base64String = btoa(
        byteArray.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      const contentType = user.avatar.contentType || "image/jpeg";
      const imageUrl = `data:${contentType};base64,${base64String}`;
      setAvatarUrl(imageUrl);
    }
  }, [user]);

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/10 to-slate-100/5 loginBackground relative overflow-hidden flex items-center justify-center">
        {/* Subtle geometric background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-teal-100/30 rounded-full blur-3xl bg-transparent" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/30 to-pink-100/30 rounded-full blur-3xl bg-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            y: isLoaded ? 0 : 20,
            scale: isLoaded ? 1 : 0.97,
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10"
        >
          <Suspense fallback={<div>Loading tracking form...</div>}>
            <TrackingForm onTrack={handleTrackOrder} isLoading={isLoading} />
          </Suspense>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative loginBackgorund h-full w-full bg-transparent overflow-hidden">
      {/* Subtle geometric background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-teal-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/30 to-pink-100/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10"
      >
        <Card className="w-full  mx-auto shadow-xl border-0 rounded-md backdrop-blur-sm">
          {/* Header with New Search Button */}
          <div className="px-6 py-2 border-b border-slate-200/60   flex border-r-2  items-center justify-between">
            <Image src={Logo} alt="Shipduniya.in" width={150} />
            <Button
              variant="outline"
              onClick={handleNewSearch}
              className="hover:shadow-md transition-shadow  p-2 min-w-[180px]"
            >
              <Search className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[30%_70%]  min-h-[calc(100vh-120px)]">
            {/* Left Column - Customer & Seller Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="p-8 bg-slate-50/50 border-r border-slate-200/60"
            >
              <div className="space-y-8">
                {/* Seller Logo */}
                <div className="flex items-center">
                  <Image
                    src={
                      avatarUrl ||
                      "https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg"
                    }
                    alt="Seller Logo"
                    width={120}
                    height={100}
                    className="min-w-32 h-32 rounded-2xl object-cover border-2 border-gray-300 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-blue-300"
                  />
                </div>

                <div className="space-y-8">
                  {/* FROM Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                      From:
                    </h2>

                    {/* Seller Logo */}
                    <div className="flex items-center "></div>

                    {/* Seller Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-slate-600">
                          Seller Name
                        </h3>
                        <p className="text-slate-900 font-medium">
                          {trackingData.seller.name}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-slate-600">
                          Seller Contact
                        </h3>
                        <div className="flex items-center gap-2 text-slate-900">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span>
                            {trackingData?.seller?.contact
                              ? trackingData.seller.contact.replace(
                                  /\d(?=\d{4})/g,
                                  "X"
                                )
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TO Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                      To:
                    </h2>

                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-slate-600">
                          Customer Name
                        </h3>
                        <p className="text-slate-900 font-medium">
                          {trackingData.customer.name}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-slate-600">
                          Delivery Address
                        </h3>
                        <div className="flex items-start gap-2 text-slate-900">
                          <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm leading-relaxed">
                            {trackingData.customer.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* {trackingData.pod_link && (
      <div className="rounded-lg overflow-hidden border items-center justify-center border-slate-200 w-fit shadow-sm hover:shadow-md transition">
        <a 
          href={trackingData.pod_link}
          >
        <Image
          src={trackingData.pod_link}
          alt="Delivery Proof"
          width={250}
          height={200}
          className="object-contain max-h-[200px]"
        />
        </a>
      </div>
    )} */}

                <hr className="border-slate-200" />

                {/* Seller Info */}
                {/* Package Details Card */}
                <div className="animate-stagger">
                  <Card className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-black rounded-xl">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700">
                        Package Details
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 flex items-center gap-2">
                          <Weight className="w-4 h-4" />
                          Weight
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {trackingData?.packageDetails?.weight}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 flex items-center gap-2">
                          <Ruler className="w-4 h-4" />
                          Dimensions
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {trackingData?.packageDetails?.dimensions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Collectable Value
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {trackingData?.packageDetails?.value}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Payment</span>
                        <div className="flex ">
                          <Badge
                            variant={
                              (trackingData?.packageDetails?.paymentMode).toLowerCase() ===
                              "prepaid"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs mr-2"
                          ></Badge>
                          <span className="text-sm">
                            {trackingData?.packageDetails?.paymentMode}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Service</span>
                        <span className="text-sm font-medium text-slate-700">
                          {replaceFirstAndRemoveRemaining(
                            trackingData?.packageDetails?.serviceType
                          )}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Main Tracking View */}
            <div className="px-8 py-4 space-y-8  ">
              {/* Header with Tracking Number and Courier */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-slate-600">AWB Number.</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {trackingData.trackingNumber}
                  </p>
                </div>
                <div className="text-right">
                  <Image
                    src={
                      partner?.toLowerCase() === "xpressbees"
                        ? Xpressbess
                        : partner?.toLowerCase() === "delhivery"
                        ? Delhivery
                        : "/placeholder.svg"
                    }
                    alt={trackingData.courier}
                    className="h-8 w-auto object-contain bg-white p-1 rounded"
                  />
                </div>
              </motion.div>

              {/* Status Block */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.4,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-center space-y-4"
              >
                <div className="space-y-2">
                  <h1
                    className={`text-5xl ${getStatusColor(
                      trackingData.status
                    )} font-bold text-slate-900 tracking-tight`}
                  >
                    {trackingData.status}
                  </h1>
                  <p className="text-lg text-slate-600">
                    {`${trackingData.statusMessage} (${trackingData.status_Code})`}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" />
                    {trackingData.lastUpdated}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center  justify-center gap-4 pt-4">
                  <Link
                    href="mailto:shipduniya@gmail.com?subject=Contact%20from%20website"
                    passHref
                  >
                    <Button
                      variant="outline"
                      className="hover:shadow-md transition-shadow"
                    >
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </motion.div>
              {/* Delivery Date & PDD Image */}
              {(trackingData.deliveryDate || trackingData.pdd_link) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="flex flex-col items-center gap-3 mt-4"
                >
                  {trackingData.deliveryDate && (
                    <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>
                        Expected Delivery: {trackingData.deliveryDate}
                      </span>
                    </div>
                  )}
                  {trackingData.pod_link && (
                    <div className="rounded-lg overflow-hidden border items-center justify-center border-slate-200 w-fit shadow-sm hover:shadow-md transition">
                      <a href={trackingData.pod_link}>
                        <Image
                          src={trackingData.pod_link}
                          alt="Delivery Proof"
                          width={250}
                          height={200}
                          className="object-contain max-h-[200px]"
                        />
                      </a>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <ProgressBar status={trackingData.status} />
              </motion.div>

              {/* Rating Widget - only show if delivered */}
              {trackingData.status === "Delivered" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <RatingWidget />
                </motion.div>
              )}

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <Timeline events={trackingData.timeline} />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

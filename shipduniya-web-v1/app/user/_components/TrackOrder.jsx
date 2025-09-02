"use client";

import { useState } from "react";
import { Package, Loader2, MapPin, Truck, PhoneCall, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios";
import Link from "next/link";

export default function TrackParcelDialog() {
  // States for the first dialog
  const [isOpen, setIsOpen] = useState(false);
  const [awbNumber, setAwbNumber] = useState("");
  const [shippingPartner, setShippingPartner] = useState("");
  const [loading, setLoading] = useState(false);
  const [isParcelDetailsOpen, setIsParcelDetailsOpen] = useState(false);
  const [track, setTrackingDetails] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/shipping/track-without-login",
        { courier: shippingPartner, awb: awbNumber }
      );
      console.log(response.data)
      setTrackingDetails(response.data);
      setIsParcelDetailsOpen(true);
    } catch (error) {
      console.error("Error tracking parcel:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} >
        {/* //onOpenChange={setIsOpen}  add this line to dialog tag for the Track Popup in dashboard*/}
        <DialogTrigger asChild>
          <Link href="/tracking" target="_blank" rel="noopener noreferrer">
            <Button
              className="flex h-10 gap-2 bg-primary text-white"
            >
              <Package className=" h-4 w-4" />
              Track
            </Button>
          </Link>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] h-[300px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Track Parcel
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Select value={shippingPartner} onValueChange={setShippingPartner}>
              <SelectTrigger>
                <SelectValue placeholder="Select shipping partner" />
              </SelectTrigger>
              <SelectContent>
                {["xpressbees", "ecom", "delhivery"].map((partner) => (
                  <SelectItem key={partner} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              value={awbNumber}
              onChange={(e) => setAwbNumber(e.target.value.trim())}
              className="w-full outline-none focus:ring-2 focus:ring-offset-2"
              placeholder="Enter AWB Number"
            />
          </div>

          <DialogFooter className="flex justify-around">
            <Button
              onClick={handleSubmit}
              className="bg-primary text-white mx-auto"
              disabled={loading || !awbNumber.trim() || !shippingPartner}
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  Track Parcel
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isParcelDetailsOpen} onOpenChange={setIsParcelDetailsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              Tracking Details
            </DialogTitle>
          </DialogHeader>
          <h2 className="text-gray-600">AWB: {track?.awb}</h2>
          <p className="text-gray-600">Courier Partner: {track?.courier}</p>
          {Array.isArray(track?.trackingDetails?.history) &&
            track.trackingDetails.history.map((scan, index) => (
              <div
                key={index}
                className="flex gap-2 items-start mb-4 p-3 border rounded-md shadow-sm bg-white"
              >
                {/* Icon */}
                {scan.status_code === "IT" ? (
                  <Truck className="text-blue-500 mt-1" />
                ) : scan.status_code === "OFD" ? (
                  <PhoneCall className="text-green-500 mt-1" />
                ) : scan.status_code === "RAD" ? (
                  <Clock className="text-yellow-500 mt-1" />
                ) : scan.status_code === "DL" ? (
                  <CheckCircle className="text-purple-600 mt-1" />
                ) : (
                  <MapPin className="text-gray-500 mt-1" />
                )}

                {/* Scan Info */}
                <div className="flex flex-col text-sm">
                  <p>
                    <span className="font-bold text-gray-800">Status Code:</span>{" "}
                    <span className="text-blue-600">{scan.status_code}</span>
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">Message:</span>{" "}
                    {scan.message}
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">Location:</span>{" "}
                    {scan.location}
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">Date & Time:</span>{" "}
                    {scan.event_time}
                  </p>
                </div>
              </div>
            ))}
          <DialogFooter className="flex justify-around">
            <Button
              onClick={() => setIsParcelDetailsOpen(false)}
              className="w-full bg-red-600 text-white mt-2"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

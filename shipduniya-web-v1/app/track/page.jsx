"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Loader2,
  MapPin,
  Truck,
  PhoneCall,
  Clock,
  CheckCircle,
} from "lucide-react";
import { ArrowLeft, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios";

export default function TrackParcelPage({ AWB_Number = "", courier = "" }) {
  if (courier) {
    courier = courier.toString().trim().toLowerCase();

    if (courier.includes("xpressbees")) {
      courier = "xpressbees";
    } else if (courier.includes("ecom")) {
      courier = "ecom";
    } else if (courier.includes("delhivery")) {
      courier = "delhivery";
    } else {
      courier = null;
    }

    console.log("Final courier:", courier);
  }

  const [awbNumber, setAwbNumber] = useState(AWB_Number || "");
  const [shippingPartner, setShippingPartner] = useState(courier || "");
  const [loading, setLoading] = useState(false);
  const [track, setTrackingDetails] = useState(null);

  useEffect(() => {
    if (AWB_Number && courier) {
      handleSubmit();
    }
  }, [AWB_Number, courier]);

  const handleSubmit = async () => {
    if (!awbNumber.trim() || !shippingPartner) return;
    console.log(shippingPartner);
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/shipping/track-without-login",
        { courier: shippingPartner, awb: awbNumber }
      );
      const { data } = response;
      setTrackingDetails(data);
    } catch (error) {
      console.error("Error tracking parcel:", error);
    } finally {
      setLoading(false);
    }
  };
  const renderTrackingHistory = () => {
    let history = [];

    if (shippingPartner === "xpressbees") {
      history = track?.trackingDetails?.history || [];
    } else if (shippingPartner === "ecom") {
      history =
        track?.trackingDetails?.ShipmentData?.[0]?.Shipment?.Scans?.map(
          (scan) => ({
            status_code: scan?.ScanDetail?.StatusCode || "N/A",
            message: scan?.ScanDetail?.Scan || "No message",
            location: scan?.ScanDetail?.ScannedLocation || "Unknown",
            event_time: scan?.ScanDetail?.ScanDateTime || "Unknown time",
          })
        ) || [];
    } else if (shippingPartner === "delhivery") {
      // Example assumption: delhivery uses 'scan_type', 'remark', 'location', 'datetime'
      history =
        track.trackingDetails?.ShipmentData?.[0]?.Shipment?.Scans?.map(
          (scan) => ({
            status_code: scan?.ScanDetail?.StatusCode || "N/A",
            status: scan?.ScanDetail?.Scan,
            message: scan?.ScanDetail?.Instructions || "No message",
            location: scan?.ScanDetail?.ScannedLocation || "Unknown",
            event_time: scan?.ScanDetail?.ScanDateTime || "Unknown time",
          })
        ).reverse() || [];
    }

    return history.map((scan, index) => (
      <div
        key={index}
        className="flex gap-2 items-start mb-4 p-3 border rounded-md shadow-sm"
      >
        {scan.status_code === "IT" || scan.status == "In Transit" ? (
          <Truck className="text-blue-500 mt-1" />
        ) : scan.status_code === "OFD" || scan.status == "Dispatched" ? (
          <PhoneCall className="text-green-500 mt-1" />
        ) : scan.status_code === "RAD" || scan.status == "Pending" ? (
          <Clock className="text-yellow-500 mt-1" />
        ) : scan.status_code === "DL" || scan.status == "Delivered" ? (
          <CheckCircle className="text-purple-600 mt-1" />
        ) : (
          <MapPin className="text-gray-500 mt-1" />
        )}

        <div className="flex flex-col text-sm">
          <p>
            <span className="font-bold">Status Code:</span>{" "}
            <span className="text-blue-600">{scan.status_code}</span>
          </p>
          <p>
            <span className="font-bold">Message:</span> {scan.message}
          </p>
          <p>
            <span className="font-bold">Location:</span> {scan.location}
          </p>
          <p>
            <span className="font-bold">Date & Time:</span> {scan.event_time}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Track Your Parcel</h1>

      <div className="flex flex-col gap-4 mb-6">
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
          onChange={(e) => setAwbNumber(e.target.value)}
          className="w-full"
          placeholder="Enter AWB Number"
        />

        <Button
          onClick={handleSubmit}
          className="bg-primary text-white"
          disabled={loading || !awbNumber.trim() || !shippingPartner}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Tracking...
            </>
          ) : (
            <>
              <Package className="mr-2 h-4 w-4" />
              Track Parcel
            </>
          )}
        </Button>
      </div>

      {track && (
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Tracking Details
          </h2>
          <p className="text-gray-600">AWB: {track?.awb}</p>
          <p className="text-gray-600 mb-2">
            Courier Partner: {track?.courier}
          </p>
       <div className="flex items-center gap-x-4  mb-4 text-gray-600">
  <p className="text-gray-600">PDD: {track?.trackingDetails?.pdd}</p>
  {track?.trackingDetails?.pod_link && (
    <a
      href={track.trackingDetails.pod_link}
      download
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="outline" className="flex text-sm items-center gap-2">
        <Download className="h-4 w-4" />
        Download POD
      </Button>
    </a>
  )}
</div>


          {renderTrackingHistory()}
        </div>
      )}
    </div>
  );
}

"use client";

import {
  MapPin,
  Truck,
  PhoneCall,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function TrackingCard({ scan }) {
  const getIcon = () => {
    if (scan.status_code === "IT" || scan.status === "In Transit") {
      return <Truck className="text-blue-500 mt-1" />;
    } else if (scan.status_code === "OFD" || scan.status === "Dispatched") {
      return <PhoneCall className="text-green-500 mt-1" />;
    } else if (scan.status_code === "RAD" || scan.status === "Pending") {
      return <Clock className="text-yellow-500 mt-1" />;
    } else if (scan.status_code === "DL" || scan.status === "Delivered") {
      return <CheckCircle className="text-purple-600 mt-1" />;
    } else {
      return <MapPin className="text-gray-500 mt-1" />;
    }
  };

  return (
    <div className="flex gap-2 items-start mb-4 p-3 border rounded-md shadow-sm">
      {getIcon()}
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
  );
}

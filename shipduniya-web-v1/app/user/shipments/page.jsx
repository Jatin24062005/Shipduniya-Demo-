"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "@/utils/axios";
import ShipmentTable from "./ShipmentTable";
import ShipmentDetails from "../_components/ShipmentDetails";
import Pagination from "@/components/custom/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [viewTracking, setViewTracking] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState(null);
  const [pageSize, setPageSize] = useState(50);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/shipping/userShipments");
      for (const shipment of response.data) {
        if (shipment.partnerDetails && shipment.partnerDetails.name) {
          const nameParts = shipment.partnerDetails.name.split(" ");
          shipment.partnerDetails.name = nameParts.slice(1).join(" ");
        }
      }
      setShipments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setError("Failed to fetch shipments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

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

  const fetchLocation = async (pincode) => {
    if (!pincode || pincode.length !== 6) return {};
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      if (data && data[0]?.PostOffice?.length) {
        const { District, State } = data[0].PostOffice[0];
        return { District, State };
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
    return {};
  };

  const populateCityState = async () => {
    for (const shipment of shipments) {
      // Fetch pickup location
      if (
        shipment.pickupAddress &&
        shipment.pickupAddress.pincode &&
        (!shipment.pickupAddress.city || !shipment.pickupAddress.state)
      ) {
        const pickupLoc = await fetchLocation(shipment.pickupAddress.pincode);
        if (pickupLoc.District)
          shipment.pickupAddress.city = pickupLoc.District;
        if (pickupLoc.State) shipment.pickupAddress.state = pickupLoc.State;
      }
      // Fetch return/drop location
      if (
        shipment.returnAddress &&
        shipment.returnAddress.pincode &&
        (!shipment.returnAddress.city || !shipment.returnAddress.state)
      ) {
        const dropLoc = await fetchLocation(shipment.returnAddress.pincode);
        if (dropLoc.District) shipment.returnAddress.city = dropLoc.District;
        if (dropLoc.State) shipment.returnAddress.state = dropLoc.State;
      }
    }
  };

  

  useEffect(() => {
    populateCityState();
  }, [shipments]);

  const handleBackToList = useCallback(() => {
    setSelectedShipments([]);
    setViewDetails(false);
    setViewTracking(false);
  }, []);

  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return shipments.slice(startIndex, startIndex + pageSize);
  }, [shipments, currentPage, pageSize]);

  const renderView = () => {
    if (viewDetails || viewTracking) {
      return (
        <ShipmentDetails
          details={selectedShipments}
          isTracking={viewTracking}
          handleBackToList={handleBackToList}
        />
      );
    }
    return (
      <div className="flex flex-col">
        <div className="flex-grow">
          <ShipmentTable
            userData={userData}
            shipments={paginatedShipments}
            loading={loading}
            fetchShipments={fetchShipments}
            selectedShipments={selectedShipments}
            setSelectedShipments={setSelectedShipments}
            setViewTracking={setViewTracking}
            setViewDetails={setViewDetails}
          />
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center px-4 py-2">
            {/* Left: Page Size Selector */}
            <div className="w-[100px] mt-5">
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  const newSize = Number(value);
                  const maxSize = shipments.length - 1;

                  setPageSize(newSize > maxSize ? maxSize : newSize);
                  setCurrentPage(1); // Reset to page 1 on change
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Page Size" />
                </SelectTrigger>
                <SelectContent>
                  {[50, 100, 200, 500, 1000].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Center: Pagination */}
            <div className="flex-1 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalItems={shipments.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return <>{renderView()}</>;
};

export default ShipmentsPage;

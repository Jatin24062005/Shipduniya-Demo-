"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import axiosInstance from "@/utils/axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "../_components/DashboardCard";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  const [shippingPartner, setShippingPartner] = useState("All");

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/shipping/userShipments");
      setShipments(response.data || []);
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

const counts = useMemo(() => {
  if (!shipments || shipments.length === 0) {
    return {
      totalDeliveredCount: 0,
      totalInTransitCount: 0,
      totalLostCount: 0,
      totalPendingPickupCount: 0,
      totalRTOCount: 0,
      totalParcelsCount: 0,
    };
  }

  const parseDate = (iso) => new Date(iso);
  const filterShipments = (statuses) =>
    shipments.filter((item) => {
      if (!item.createdAt || !item.status) return false;
  
      const itemDate = parseDate(item.createdAt);
      const inDateRange =
        itemDate >= dateRange.from && itemDate <= dateRange.to;
  
      const partnerMatch =
        shippingPartner === "All" ||
        item.partnerDetails?.name
          ?.toLowerCase()
          .includes(shippingPartner.toLowerCase());
  
      // Convert single status into array if needed
      const statusArray = Array.isArray(statuses) ? statuses : [statuses];
  
      return (
        inDateRange &&
        partnerMatch &&
        statusArray.includes(item.status.toLowerCase())
      );
    }).length;
  

  const allMatchingParcels = shipments.filter((item) => {
    if (!item.createdAt) return false;
    const itemDate = parseDate(item.createdAt);
    const inDateRange =
      itemDate >= dateRange.from && itemDate <= dateRange.to;

    const partnerMatch =
      shippingPartner === "All" ||
      item.partnerDetails?.name
        ?.toLowerCase()
        .includes(shippingPartner.toLowerCase());

    return inDateRange && partnerMatch;
  });
  return {
    totalDeliveredCount: filterShipments("delivered"),
    totalInTransitCount: filterShipments("in transit"),
    totalLostCount: filterShipments("out for delivery"),
    totalPendingPickupCount: filterShipments("pending pickup"),
    totalRTOCount: filterShipments([
      "rto",
      "rto lost",
      "rto intransit",
      "rto delivered",

    ]),
    totalParcelsCount: allMatchingParcels?.filter(
      (s) => s.status !== "cancelled" && s.status !== "canceled"
    ).length,
  };
  
}, [shipments, dateRange, shippingPartner]);


  const pieData = [
    { name: "Delivered", value: counts.totalDeliveredCount },
    { name: "RTO", value: counts.totalRTOCount },
    { name: "Pending-Pickup", value: counts.totalPendingPickupCount },
    { name: "In-Transit", value: counts.totalInTransitCount },
    { name: "OFD", value: counts.totalLostCount },
  ];

  const percentageData = pieData.map((item) => ({
    name: item.name,
    value:
      counts.totalParcelsCount > 0
        ? parseFloat(((item.value / counts.totalParcelsCount) * 100).toFixed(1))
        : 0,
  }));

  const COLORS = ["#28A745", "#FF6347", "#FFD700", "#007BFF", "#DC3545"];

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="mt-4">
          <div className="text-center py-10">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="mt-4">
          <div className="text-center py-10 text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="mt-4">
     <div className="flex flex-wrap items-center justify-between mb-3">
  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
  <div className="w-[228px]">
    <Select value={shippingPartner} onValueChange={setShippingPartner}>
      <SelectTrigger>
        <SelectValue placeholder="Select shipping partner" />
      </SelectTrigger>
      <SelectContent>
        {["All", "Xpressbees", "Delhivery"].map((partner) => {
          let displayName = partner;
          if (partner === "Xpressbees") displayName = "Ship Duniya XB";
          else if (partner === "Delhivery") displayName = "Ship Duniya DL";

          return (
            <SelectItem key={partner} value={partner}>
              {displayName}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  </div>
</div>


        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="Total Parcels" value={counts.totalParcelsCount} />
          <DashboardCard title="Delivered" value={counts.totalDeliveredCount} />
          <DashboardCard title="RTO" value={counts.totalRTOCount} />
          <DashboardCard title="Pending Pickup" value={counts.totalPendingPickupCount} />
          <DashboardCard title="In-Transit" value={counts.totalInTransitCount} />
          <DashboardCard title="OFD" value={counts.totalLostCount} />
        </div>

        <div className="h-[400px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={percentageData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {percentageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;

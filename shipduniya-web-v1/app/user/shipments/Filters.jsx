import { CardTitle } from "@/components/ui/card";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button";

const Filters = ({
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  orderType,
  setOrderType,
  partnerType,
  setPartnerType,
  setShipmentStatus,
  open,
  setOpen,
  shipments,
  setIsExporting
}) => {


  const handleSelect = (type) => {
    setShipmentStatus(type); // Set status
    setOpen(false); // Close dropdown
  };


  const statusCounts = shipments.reduce((acc, shipment) => {
    let key = shipment.status?.trim().toLowerCase();
    if (key === "booked" || key === "pending" || key === "pending pickup") key = "pendingPickup";
    else if (key === "delivered") key = "delivered";
    else if (key === "rto") key = "rto";
    else if (key === "canceled" || key === "cancelled") key = "cancelled";
    else if (key === "in transit") key = "inTransit";
    else if (key === "out for delivery") key = "outForDelivery";
    else key = key || "other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

console.log("Shipments",shipments);
  console.log("Status count",statusCounts);
  return (
    <>
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Shipments</CardTitle>
        <input
          type="text"
          placeholder="Search by consignee name, awb number or orderId"
          className="border rounded-lg px-4 py-2 text-sm w-[50%] focus:outline-none focus:ring focus:ring-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="export"
          size="lg"
          onClick={() => setIsExporting((prev) => !prev)}
        >
          <span className="text-lg">+ Export </span>
        </Button>
      </div>
      <div className="flex justify-between items-center mb-4 pt-2">
        <div className="flex items-center flex-wrap gap-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />

          <div className="w-[130px]">
            <Select
              value={orderType}
              onValueChange={(value) => setOrderType(value)}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Order type" />
              </SelectTrigger>
              <SelectContent>
                {["All", "prepaid", "COD"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
         <div className="w-[180px]">
  <Select
    value={partnerType}
    onValueChange={(value) => setPartnerType(value)}
  >
    <SelectTrigger>
      <SelectValue
        placeholder="Choose courier partner"
        children={
          partnerType === "Xpressbees"
            ? "Ship Duniya XB"
            : partnerType === "Delhivery"
            ? "Ship Duniya DL"
            : partnerType === "Ecom"
            ? "Ecom"
            : "All"
        }
      />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="All">All</SelectItem>
      <SelectItem value="Xpressbees">Ship Duniya XB</SelectItem>
      <SelectItem value="Delhivery">Ship Duniya DL</SelectItem>
    </SelectContent>
  </Select>
</div>

        </div>
      </div>
      <div className="flex justify-between  flex-row-reverse pt-2 h-10">
        <div className="flex item-center gap-2">
          <div className="my-1 flex item-center gap-2">
            <Button
              onClick={() => setShipmentStatus("")}
              className="bg-gray-200 text-black"
            >
              All ({shipments.length})
            </Button>

            <Button
              onClick={() => setShipmentStatus(["Pending Pickup","booked","pending","pending pickup"])}
              className="text-sm font-semibold px-4 py-2 rounded-lg border border-yellow-400 text-yellow-400"
            >
              Pending Pickup ({statusCounts.pendingPickup || 0})
            </Button>

            <Button
              onClick={() => setShipmentStatus("delivered")}
              className="text-sm font-semibold px-4 py-2 rounded-lg border border-green-500 text-green-500"
            >
              Delivered( {statusCounts.delivered || 0})
            </Button>

            <Button
              onClick={() => setShipmentStatus("in transit")}
              className="text-sm font-semibold px-4 py-2 rounded-lg border border-blue-500 text-blue-500"
            >
              In-Transit ({statusCounts.inTransit || 0})
            </Button>
            <Button
              onClick={() => setShipmentStatus("out for delivery")}
              className="text-sm font-semibold px-4 py-2 rounded-lg border border-blue-500 text-blue-500"
            >
              Out for Delivery ({statusCounts.outForDelivery || 0})
            </Button>
            <Button
              onClick={() => setShipmentStatus("canceled")}
              className="text-sm font-semibold px-4 py-2 rounded-lg border border-red-500 text-red-500"
            >
              Cancelled ({statusCounts.cancelled || 0})
            </Button>
          </div>
          <Select open={open} onOpenChange={setOpen}>
            <SelectTrigger>
              <SelectValue placeholder="More ..." />
            </SelectTrigger>
            <SelectContent>
              <div className="flex flex-col gap-2">
                {[{ label: "RTO-All", value: "rto" }, { label: "Lost", value: "rto lost" }, { label: "RTO-In-Transit", value: "rto intransit"}, {label: "RTO-Delivered", value: "rto delivered"}, {label: "NDR", value: "exception"}].map((type) => (
                  <Button
                    size="sm"
                    variant="outline"
                    key={type.value}
                    onClick={() => handleSelect(type.value)}
                  >
                    <span className="text-sm">{type.label}</span>
                  </Button>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default Filters;

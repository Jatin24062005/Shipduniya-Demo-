"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import RemittanceTable from "@/app/user/_components/RemetanceTable";
import UserRemittance from "../_components/UserRemittance";
import { error } from "pdf-lib";

const RemetanceCard = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className="rounded-lg bg-white p-6 shadow cursor-pointer hover:shadow-md transition"
  >
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-semibold text-gray-700">{value}</p>
  </div>
);

const Remetences = () => {
  const [dashboard, setDashboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [shippingPartner, setShippingPartner] = useState("All");
  const [showOrderRemittance, setShowOrderRemittance] = useState(false);
  const [data, setData] = useState([]);
  const [totalPaidRemittance, setTotalPaidRemittance ] = useState(0);
  const [nextExpectedRemittance, setNextExpectedRemittance ] = useState(0);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users/codremittance", {
        params: {
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
          partner: shippingPartner,
        },
      });
      setDashboard(response.data);
      console.log("Dashboard data:", response.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async ()=>{
    try{

      const res =await axiosInstance.get("/shipping/cod-new-remittance");
      console.log("Response for Main remittance : ", res.data);
      setData(res.data.data);

    }catch(err){
     console.log(error);
    }
  }

  useEffect(() => {
    fetchDashboard();
    fetchData()

  }, [dateRange, shippingPartner]);

  const totalRemittance = dashboard.length>0 ? dashboard.reduce(
    (sum, item) => sum + (item.codAmount || 0),
    0
  ):0;

  const paidRemittance = ()=>{
    const paidOrder =data?.filter(item => item.remittanceRequestIds.length>0 && item.status === "paid")

    const total = paidOrder.reduce((acc, order) => {
      return acc + (order.totalDeliveredCod || 0); // fallback to 0 if undefined
    }, 0);

    console.log("total Paid Remittance ", total)
  
    setTotalPaidRemittance(total);
  }

  const nextRemittance=()=>{
   const pendingOrders = data?.filter(item => item.remittanceRequestIds.length>0 && item.status === "approval_pending");
   const total = pendingOrders.reduce((acc, order) => {
    return acc + (order.totalDeliveredCod || 0); // fallback to 0 if undefined
  }, 0);

  console.log("total Paid Remittance ", total)

  setNextExpectedRemittance(total);

  }

  const remainingRemittance = totalRemittance - totalPaidRemittance;

  const viewDetails = (shipment) => {
    console.log("View details:", shipment);
  };
  useEffect(() => {
    if (data.length > 0) {
      paidRemittance();
      nextRemittance()
    }
  }, [data]);
  

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="mb-4">COD Remittance</CardTitle>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <RemetanceCard
                title="Total Remittance"
                value={`₹${totalRemittance.toLocaleString()}`}
                onClick={() => setShowOrderRemittance(!showOrderRemittance)}
              />
              <RemetanceCard
                title="Paid Remittance"
                value={`₹${totalPaidRemittance.toLocaleString()}`}
              />
              <RemetanceCard
                title="Next Expected Remittance"
                value={`₹${nextExpectedRemittance.toLocaleString()}`}
              />
              <RemetanceCard
                title="Remaining Remittance"
                value={`₹${remainingRemittance.toLocaleString()}`}
              />
            </div>

            <div>
              {showOrderRemittance ? (
                <RemittanceTable
                  Remittances={dashboard}
                  viewDetails={viewDetails}
                  dateRange={dateRange}
                  shippingPartner={shippingPartner}
                />
              ) : (
                <UserRemittance data={data} />
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Remetences;

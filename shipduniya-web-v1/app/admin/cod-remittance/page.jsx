"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios";
import DeliveredCODTable from "../_components/DeliveredCODTable";
import ApprovalPendingTable from "../_components/ApprovalPendingTable";
import PaidRemittanceTable from "../_components/PaidRemittanceTable";
import { useToast } from "@/hooks/use-toast";

function RemetanceCard({ title, value }) {
  return (
    <div className="rounded-lg bg-pr p-6 shadow hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-700">{value}</p>
    </div>
  );
}

const Remetences = () => {
  const [dashboard, setDashboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });
  const [shippingPartner, setShippingPartner] = useState("All");
  const [userDetails, setUserDetails] = useState(null);
  const [data, setData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setUserDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          "/shipping/cod-admin-remittance-summary"
        );
        setDashboard(response.data.data);
        console.log("Response for Remittance Request: ", response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/remittance/getRemittances");
        setData(res.data.Remittances || []);
        console.log("Data fetched in Paid COd: ", res.data);
      } catch (err) {
        toast({
          title: "Failed to fetch remittance data",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  const filteredData = () => {
    if (!dashboard) {
      return {
        TotalRemetence: 0,
        PaidRemetence: 0,
        NextExpectedRemetence: 0,
        RemainingRemetence: 0,
      };
    }
    const total = dashboard.totalRemittance || 0;
    const paid = dashboard.paidRemittance || 0;
    const next = dashboard.nextExpectedRemittance || 0;
    return {
      TotalRemetence: total,
      PaidRemetence: paid,
      NextExpectedRemetence: next,
      RemainingRemetence: total - paid,
    };
  };

  const counts = filteredData();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="mb-4 font-bold text-2xl">
          COD Remittance
        </CardTitle>
        <div className="flex flex-wrap align-center justify-between">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <div className="w-[228px]">
            {/* <Select
              value={shippingPartner}
              onValueChange={(value) => setShippingPartner(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shipping partner" />
              </SelectTrigger>
              <SelectContent>
                {["All", "xpressbees", "ECom", "Delhivery"].map((partner) => (
                  <SelectItem key={partner} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <RemetanceCard title="Total Remittance" value={counts.TotalRemetence} />
          <RemetanceCard title="Paid Remittance" value={counts.PaidRemetence} />
          <RemetanceCard title="Next Expected Remittance" value={counts.NextExpectedRemetence} />
          <RemetanceCard title="Remaining Remittance" value={counts.RemainingRemetence} />
        </div> */}

        <Tabs defaultValue="delivered" className="w-full">
          <div className="flex justify-center mt-6 w-full">
            <TabsList
              className="flex gap-4 bg-white/20 backdrop-blur-md shadow-md
 border-slate-800"
            >
              <TabsTrigger
                value="delivered"
                className="w-[160px] text-center  data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                All COD Delivered
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="w-[160px] text-center  data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Approval Pending
              </TabsTrigger>
              <TabsTrigger
                value="paid"
                className="w-[160px] text-center  data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Paid
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="delivered">
            <DeliveredCODTable data={dashboard} userDetails={userDetails} />
          </TabsContent>

          <TabsContent value="pending">
            <ApprovalPendingTable
              data={dashboard || []}
              userDetails={userDetails}
            />
          </TabsContent>

          <TabsContent value="paid">
            <PaidRemittanceTable
              data={data}
              userDetails={userDetails}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Remetences;

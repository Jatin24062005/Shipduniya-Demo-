"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/utils/axios";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ApprovalPendingTable from "../_components/ApprovalPendingTable";
import PaidRemittanceTable from "../_components/PaidRemittanceTable";
import AdminDetailCard from "../_components/AdminDetailedCard";
import { useToast } from "@/hooks/use-toast";

const Remetance = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [shippingPartner, setShippingPartner] = useState("All");
  const [dashboard, setDashboard] = useState(null);
  const [approved, setApproved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [data,setData] = useState([]);
  const {toast} = useToast()
useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/remittance/getSuperRemittances");
        setDashboard(res.data.data || []);
        console.log("superAdmin Approval Pending Data: ", res);
        const data = <res className="data data"></res>;
      } catch (err) {
        toast({
          title: "Failed to fetch remittance data",
          variant: "destructive",
        });
      }
    };
      fetchData();
  }, []);

  console.log("dashboard :", dashboard);


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
  
  useEffect(() => {
    
    fetchData();
  }, []);

  // const approvedRemetance = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axiosInstance.patch(
  //       "/shipping/approve-remittance/${orderId}"
  //     );
  //     console.log("approve res : ", response.data);
  //     setApproved(response.data);
  //   } catch (error) {
  //     setError("Failed to fetch table!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const approvedRemetance = async (orderId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `/shipping/approve-remittance/${orderId}`
      );
      console.log("Approve response:", response.data);

      // Update UI optimistically
      setDashboard((prev) =>
        prev.map((item) =>
          item.orderId === orderId ? { ...item, status: "Approved" } : item
        )
      );
    } catch (error) {
      setError("Failed to approve remittance!");
    } finally {
      setLoading(false);
      setOpenDialog(false); // Close the dialog after approval
    }
  };

  useEffect(() => {
    approvedRemetance();
  }, []);

  const handleApprove = (orderId) => {
    approvedRemetance(orderId);
    console.log("Approved remittance for order ID:", orderId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="mb-4 font-bold text-2xl">
          COD Remittance
        </CardTitle>
        {!selectedAdmin && (
          <>
            <div className="flex flex-wrap align-center justify-between ">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              <div className="w-[228px]">
                <Select
                  value={shippingPartner}
                  onValueChange={(value) => setShippingPartner(value)}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select shipping partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {["All", "Expressbeez", "ECom", "Delhivery"].map((partner) => (
                      <SelectItem key={partner} value={partner}>
                        {partner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Tabs defaultValue="pending" className="w-full">
              <div className="flex justify-center mt-6 w-full">
                <TabsList
                  className="flex gap-4 bg-white/20 backdrop-blur-md shadow-md
 border-slate-800"
                >
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

              <TabsContent value="pending">
                <ApprovalPendingTable
                  data={Array.isArray(dashboard) ? dashboard : dashboard ? [dashboard] : []}
                  onAdminClick={setSelectedAdmin}
                />
              </TabsContent>

              <TabsContent value="paid">
                <PaidRemittanceTable
                  data={Array.isArray(data) ? data : data ? [data] : []}
                  userDetails={{}}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
        {selectedAdmin && (
          <AdminDetailCard
            admin={selectedAdmin}
            onBack={() => setSelectedAdmin(null)}
          />
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3"></CardContent>
    </Card>
  );
};

export default Remetance;

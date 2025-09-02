"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axiosInstance from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import * as XLSX from "xlsx";
import { filter } from "jszip";

// Create context
const OrdersContext = createContext();

// Custom hook
export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

// Provider component
export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isShipping, setIsShipping] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({ pickUp: "", rto: "" });
  const [shippingPartners, setShippingPartners] = useState([]);
  const [wareHouses, setWareHouses] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const pathname = usePathname();

  const { toast } = useToast();
  let token = Cookies.get("token");

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    if (!token) {
      setLoading(false);
      console.log("Token Doesn't Exist yet")
      return;
    }

    try {
      const response = await axiosInstance.get("/orders");
      const sorted = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let token = Cookies.get("token");
    console.log(pathname);
    if (pathname === "/user/orders" && token) {
      fetchOrders();
    }
  }, [pathname, token, fetchOrders]);

  // Fetch Warehouses
  const fetchWarehouses = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/warehouses");
      setWareHouses(res.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      toast({
        title: "Error fetching warehouses",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch Shipping Partners
  const fetchShippingPartners = useCallback(
    async (pickup, rto) => {
      if (!pickup || !rto) return;
      setShippingLoading(true);
      try {
        const res = await axiosInstance.post("/shipping/partners", {
          pickup,
          rto,
        });
        setShippingPartners(res.data);
      } catch (error) {
        console.error("Error fetching shipping partners:", error);
        toast({
          title: "Error fetching shipping partners",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setShippingLoading(false);
      }
    },
    [toast]
  );

  // Book Shipment
  const handleBookShipment = useCallback(
    async (selectedPartner, shippingInfo, selectedOrders, orders) => {
      if (!selectedPartner) return;
      setShippingLoading(true);

      console.log("COD Charges:", selectedPartner.codCharge);

      try {
        const res = await axiosInstance.post(
          "/shipping/create-forward-shipping",
          {
            courierId: selectedPartner.serviceId,
            orderIds: selectedOrders,
            pickup: shippingInfo.pickUp,
            rto: shippingInfo.rto,
            totalPrice: selectedPartner.totalPrice,
            cod_charges: selectedPartner.codCharge,
            ShipOrders:selectedPartner.orders,
            selectedPartner: `${selectedPartner.carrierName} ${selectedPartner.serviceType}`,
          }
        );
        console.log("handleBookShipment Button Response:", res.data);
        if (res.status === 200) {
          toast({ title: "Shipment booked successfully!", variant: "success" });
          fetchOrders();
          setIsShipping(false);
          setSelectedOrders([]);
        }
      } catch (error) {
        console.error("Error booking shipment:", error);
        toast({
          title: "Failed to book shipment",
          description:
            error.response?.data?.message || "Please try again later",
          variant: "destructive",
        });
      } finally {
        setShippingLoading(false);
      }
    },
    [fetchOrders, toast]
  );

  // Handle Forward Bulk Upload
  const handleForwardBulkOrder = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post(
        "/orders/create-forward-order",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast({
          title: "Bulk upload successful",
          description: res.data.message,
          variant: "success",
        });
        fetchOrders();
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast({
        title: "Bulk upload failed",
        description: error.response?.data?.details?.join(", ") || "Error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Reverse Bulk Upload
  const handleReverseBulkOrder = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post(
        "/orders/bulk-upload-reverse",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast({
          title: "Bulk upload successful",
          description: `${res.data.count} reverse orders created`,
          variant: "success",
        });
        fetchOrders();
      }
    } catch (error) {
      console.error("Reverse bulk upload error:", error);
      toast({
        title: "Bulk upload failed",
        description:
          error.response?.data?.message ||
          "Please check your file and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadEditBulkOrder = async (file, orders) => {
    try {
      setLoading(true);

      // Step 1: Read the file using FileReader
      const data = await file.arrayBuffer();
      console.log("Data:", data);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Step 2: Iterate each row (each representing an order to update)
      const updatePromises = jsonData.map((order) => {
        console.log("Order IN Excel", order);
        const orderId =
          order._id || order.orderId || order.Order_ID || order["Order ID"];
        console.log("orderId from the excel: ", orderId); // Adjust based on your column name
        if (!orderId) return Promise.resolve(); // Skip if no ID
        const filteredOrder = orders.find((order) => order.orderId === orderId);
        console.log("filteredOrder", filteredOrder);
        const order_Id = filteredOrder?._id;

        // Remove ID from payload if necessary
        const { _id, orderId: id, ...updateFields } = order;

        const formattedObject = {
          orderId: updateFields["Order ID"],
          createdAt: updateFields["Order date"],
          orderType: updateFields["Method"],
          collectableValue: updateFields["Collectable amount"],
          invoiceNumber: updateFields["Invoice number"],
          consignee: updateFields["Consignee"],
          consigneeAddress1: updateFields["Address1"],
          consigneeAddress2: updateFields["Address2"],
          city: updateFields["City"],
          state: updateFields["State"],
          pincode: updateFields["Pincode"],
          channelPartner: updateFields["Channel Partner"],
          insurance: updateFields["Insurance"],
          itemDescription: updateFields["Item Description"],
          mobile: updateFields["Phone"],
          actualWeight: updateFields["Actual weight (gm)"],
          volumetricWeight: updateFields["Volumetric weight (gm)"],
          length: updateFields["Length (cm)"],
          breadth: updateFields["breadth (cm)"],
          height: updateFields["Height (cm)"],
          quantity: updateFields["Quantity"],
          status: updateFields["Status"],
        };

        return axiosInstance.put(`/orders/${order_Id}`, formattedObject);
      });

      // Step 3: Wait for all updates
      const responses = await Promise.allSettled(updatePromises);

      const successCount = responses.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failureCount = responses.length - successCount;

      toast({
        title: "Bulk Edit Complete",
        description: `✅ ${successCount} updated, ❌ ${failureCount} failed`,
        variant: failureCount === 0 ? "success" : "destructive",
      });

      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Bulk edit failed:", error);
      toast({
        title: "Edit Bulk upload failed",
        description: error.message || "Error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtered Orders (latest on top)
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchSearch =
          searchQuery === "" ||
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order?.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.consignee?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchType =
          orderType === "All" ||
          order.orderType?.toLowerCase() === orderType.toLowerCase();

        return matchSearch && matchType;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, searchQuery, orderType]);

  // Effects
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (shippingInfo.pickUp && shippingInfo.rto) {
      fetchShippingPartners(shippingInfo.pickUp, shippingInfo.rto);
    }
  }, [shippingInfo, fetchShippingPartners]);

  // Context value
  const value = {
    orders,
    loading,
    setLoading,
    searchQuery,
    setSearchQuery,
    orderType,
    setOrderType,
    selectedOrders,
    setSelectedOrders,
    isShipping,
    setIsShipping,
    selectedOrder,
    setSelectedOrder,
    shippingInfo,
    setShippingInfo,
    shippingPartners,
    wareHouses,
    selectedPartner,
    setSelectedPartner,
    shippingLoading,
    fetchOrders,
    fetchWarehouses,
    handleBookShipment,
    handleForwardBulkOrder,
    handleReverseBulkOrder,
    filteredOrders,
    setOrders,
    handleUploadEditBulkOrder,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

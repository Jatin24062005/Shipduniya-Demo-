"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useMemo, useRef } from "react";
import { toast, useToast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/custom/Pagination";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ShipOrders from "../_components/ShipOrders";
import BulkOrder from "../_components/BulkOrder";
import OrdersTable from "../_components/OrdersTable";
import OrderView from "../_components/OrderView";
import OrderForm from "./create/page";
import { useRouter } from "next/navigation";
import { useOrders } from "@/context/OrdersContext";
import axiosInstance from "@/utils/axios";
import Cookies from "js-cookie";
import autoTable from "jspdf-autotable";


const OrdersPage = () => {
  const [userType, setUserType] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });
  const [viewShipped, setViewShipped] = useState(false);
  const [viewNotShipped, setViewNotShipped] = useState(false);
  const [viewCancelled, setViewCancelled] = useState(false);
  const [createForwardSingleOrder, setCreateForwardSingleOrder] =
    useState(false);
  const [createReverseSingleOrder, setCreateReverseSingleOrder] =
    useState(false);
  const [createForwardBulkOrder, setCreateForwardBulkOrder] = useState(false);
  const [createReverseBulkOrder, setCreateReverseBulkOrder] = useState(false);
  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const router = useRouter();
 let token = Cookies.get("token");
  // Use the OrdersContext
  const {
    loading,
    searchQuery,
    setSearchQuery,
    orderType,
    fetchOrders,
    setOrderType,
    selectedOrders,
    setSelectedOrders,
    isShipping,
    setIsShipping,
    selectedOrder,
    setSelectedOrder,
    filteredOrders,
    handleForwardBulkOrder,
    handleReverseBulkOrder,
    handleBookShipment
  } = useOrders();

  // Get user type from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserType(userData.userType);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Calculate paginated orders
  const paginatedOrders = useMemo(() => {
    // Start with the full list of filtered orders from the OrdersContext
    let filteredOrdersWithStatus = [...filteredOrders];

    // Apply status filters
    if (viewCancelled) {
      // When viewing cancelled, show orders that are cancelled
      filteredOrdersWithStatus = filteredOrdersWithStatus.filter(
        (order) => order.isCancelled
      );
    } else if (viewShipped) {
      // When viewing shipped, show orders that are booked (shipped)
      filteredOrdersWithStatus = filteredOrdersWithStatus.filter(
        (order) => order.shipped
      );
    } else if (viewNotShipped) {
      // When viewing not shipped, show orders that are not shipped and not cancelled
      filteredOrdersWithStatus = filteredOrdersWithStatus.filter(
        (order) => !order.shipped && !order.isCancelled
      );
    }

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);

      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);

      filteredOrdersWithStatus = filteredOrdersWithStatus.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }

    // Sort the filtered orders
    // For example, for not shipped orders we sort by weight, and for the rest we sort by date
    const sortedOrders = [...filteredOrdersWithStatus].sort((a, b) => {

      // Default: sort by date descending
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedOrders.slice(startIndex, endIndex);
  }, [
    filteredOrders,
    currentPage,
    pageSize,
    viewShipped,
    viewNotShipped,
    viewCancelled,
    dateRange,
    token,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, orderType, viewShipped, viewNotShipped, dateRange]);

  const handleOrderSelect = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleShipSelected = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "No orders selected",
        description: "Please select at least one order to ship",
        variant: "destructive",
      });
      return;
    }
    setIsShipping(true);
  };


const countRef = useRef(0);



// useEffect(() => {
//   try {
//     if (!loading && filteredOrders.length === 0 && countRef.current <= 5) {
//       console.log("Refetching orders...");
//       console.log(filteredOrders)

//       fetchOrders(); // ✅ Call the function directly
//       countRef.current++;
//     } else {
//       countRef.current = 0;
//     }
//   } catch (error) {
//     console.error("Error in useEffect fetching orders:", error);
//   }
// }, [filteredOrders, loading, fetchOrders]);




  const handleDownloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders");

      // Define headers (exact order & labels like the screenshot)
      const headers = [
        "Order ID",
        "Order date",
        "Method",
        "Collectable amount",
        "Invoice number",
        "Consignee",
        "Address1",
        "Address2",
        "City",
        "State",
        "Pincode",
        "Channel Partner",
        "Insurance",
        "Item Description",
        "Phone",
        "Actual weight",
        "Volumetric weight",
        "Length",
        "breadth",
        "Height",
        "Quantity",
        "Status",
      ];

      // Add styled header row
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FDE9D9" },
        };
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
      // Add data rows
      filteredOrders.forEach((order) => {
        const row = worksheet.addRow([
          order.orderId,
          new Date(order.createdAt).toLocaleDateString(),     // Order date
          order.orderType || "PREPAID",
          order.collectableAmount || 0,
          order.invoiceNumber || "",
          order.consignee,
          order.consigneeAddress1,
          order.consigneeAddress2,
          order.city,
          order.state,
          order.pincode,
          order.channelPartner,
          order.insurance,
          order.itemDescription,
          order.mobile,
          order.actualWeight,
          order.volumetricWeight,
          order.length,
          order.breadth,
          order.height,
          order.quantity,
          order.isCancelled ? "Cancelled" : order.shipped ? "Shipped" : "Not Shipped",
        ]);
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };
        });
      });

      worksheet.columns = headers.map((header) => ({
        header,
        width: Math.max(15, header.length + 2),
      }));
      // Export as Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "orders.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export Excel");
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();

      const tableColumn = [
        "Order ID",
        "Date",
        "Method",
        "Consignee",
        "Pincode",
        "Description",
        "Phone",
        "Weight",
        "Quantity",
        "Status",
      ];

      const tableRows = filteredOrders.map((order) => [
        order.orderId,
        new Date(order.createdAt).toLocaleDateString(),
        order.orderType || "PREPAID",
        order.consignee,
        order.pincode,
        order.itemDescription || "",
        order.mobile || order.phone || "",
        Math.max(order.actualWeight || 0, order.volumetricWeight || 0),
        order.quantity,
        order.isCancelled ? "Cancelled" : order.shipped ? "Shipped" : "Not Shipped",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [253, 233, 217], // Light peach (FDE9D9)
        },
      });

      doc.save("orders.pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  let filteredOrdersWithStatus = [...filteredOrders];

  
  const calculateStatusNumbers = {
    cancelled: filteredOrdersWithStatus.filter((order) => order.isCancelled).length,
    notShipped: filteredOrdersWithStatus.filter(
      (order) => !order.shipped && !order.isCancelled
    ).length,
    shipped: filteredOrdersWithStatus.filter((order) => order.shipped).length,
  };
  
  useEffect(() => {
    console.log("Status numbers:", calculateStatusNumbers);
  }, [fetchOrders, filteredOrdersWithStatus]);
  
  const renderOrderList = () => (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Orders</CardTitle>
          <input
            type="text"
            placeholder="Search by order Id or consignee name"
            className="border rounded-lg px-4 py-2 text-sm w-[50%] focus:outline-none focus:ring focus:ring-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="export"
            size="lg"
            className="h-10"
            onClick={() => setIsExportDialogOpen((prev) => !prev)}
          >
            <span className="text-lg">+ Export </span>
          </Button>
          <Dialog
            open={isExportDialogOpen}
            onOpenChange={setIsExportDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export</DialogTitle>
                <DialogDescription>Download Excel or PDF.</DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-around">
                <Button
                  variant="outline"
                  onClick={handleDownloadExcel}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                <div className="w-[120px]">
                  <Select
                    value={orderType}
                    onValueChange={(value) => setOrderType(value)}
                  >
                    <SelectTrigger>
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
                <button
                  className={`text-sm font-semibold px-4 py-2 rounded-lg border border-green-500 text-green-500`}
                  onClick={() => {
                    setViewShipped(!viewShipped);
                    setViewNotShipped(false);
                    setViewCancelled(false);
                  }}
                >
                  View Booked  (<span className="text-xs">{calculateStatusNumbers.shipped}</span>)
                </button>
                <button
                  className={`text-sm font-semibold px-4 py-2 rounded-lg border border-primary text-primary`}
                  onClick={() => {
                    setViewNotShipped(!viewNotShipped);
                    setViewShipped(false);
                    setViewCancelled(false);
                  }}
                >
                  View Not Shipped  (<span className="text-xs">{calculateStatusNumbers.notShipped}</span>)
                </button>
                <button
                  className={`text-sm font-semibold px-4 py-2 rounded-lg border border-destructive text-destructive`}
                  onClick={() => {
                    setViewCancelled(!viewCancelled);
                    setViewShipped(false);
                    setViewNotShipped(false);
                  }}
                >
                  View Cancelled (<span className="text-xs">{calculateStatusNumbers.cancelled}</span>)
                </button>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="export"
                  className="h-8"
                  onClick={() => {
                    setCreateForwardSingleOrder(true);
                    router.push("/user/orders/create");
                  }}
                >
                  <span>+ Create Order </span>
                </Button>
                <Button
                  variant="export"
                  className="h-8"
                  onClick={() => setCreateForwardBulkOrder(true)}
                >
                  <span>+ Bulk Upload </span>
                </Button>
              </div>
            </div>
            <OrdersTable
              orders={paginatedOrders}
              loading={loading}
              setLoading={() => { }}
              setViewDetails={setViewDetails}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              setIsShipping={setIsShipping}
              fetchOrders={fetchOrders}
            />
            <div className="flex justify-between items-center px-4 py-2">
              {/* Left: Page Size Selector */}
              <div className="w-[100px] mt-7">
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    const newSize = Number(value);
                    const maxSize = filteredOrders.length ;

                    setPageSize(newSize > maxSize ? maxSize : newSize);
                    setCurrentPage(1); // Reset to page 1 on change
                  }}

                >
                  <SelectTrigger>
                    <SelectValue placeholder="Page Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[50, 100, 200,500,1000].map((size) => (
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
                  totalItems={filteredOrders.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>


          </>
        )}
      </CardContent>
    </Card>
  );

  const renderView = () => {
    if (createForwardSingleOrder) {
      return <OrderForm />;
    }
    if (createReverseSingleOrder) {
      return (
        <OrderForm
          onSubmit={createReverseOrder}
          setIsAddingOrder={setCreateReverseSingleOrder}
        />
      );
    }
    if (viewDetails) {
      return (
        <OrderView order={selectedOrder} handleBackToList={handleBackToList} />
      );
    }
    if (isShipping) {
      return (
        <ShipOrders
          setIsShipping={setIsShipping}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          userType={userType}
          handleBookShipment={handleBookShipment}
        />
      );
    }
    return renderOrderList();
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setViewDetails(false);
  };

  return (
    <div className="space-y-6">
      {renderView()}
      <BulkOrder
        isOpen={createForwardBulkOrder}
        setIsOpen={setCreateForwardBulkOrder}
        onUpload={handleForwardBulkOrder}
      />
      <BulkOrder
        isOpen={createReverseBulkOrder}
        setIsOpen={setCreateReverseBulkOrder}
        onUpload={handleReverseBulkOrder}
      />
    </div>
  );
};

export default OrdersPage;

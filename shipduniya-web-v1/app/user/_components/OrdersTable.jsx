import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyPlusIcon, EditIcon, ShipIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axios";
import { Button } from "@/components/ui/button";
import CloneOrder from "./CloneOrder";
import EditOrder from "./EditOrder";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import BulkOrder from "../_components/EditBulkOrder";

import { useOrders } from "@/context/OrdersContext";
import { Select , SelectTrigger, SelectValue,SelectContent,SelectItem } from "@/components/ui/select";

const OrdersTable = ({
  fetchOrders,
  orders,
  loading,
  setLoading,
  setSelectedOrder,
  selectedOrder,
  setViewDetails,
  isShipping,
  setIsShipping,
}) => {
  const { toast } = useToast();


  const [selectAll, setSelectAll] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [editOrder, setEditOrder] = useState(null); 
  const [step, setStep] = useState(1); 
  const [cloneOrder, setCloneOrder] = useState({}); 
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [createForwardBulkOrder, setCreateForwardBulkOrder] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const {handleUploadEditBulkOrder} = useOrders();

  // Check if selectedOrder is an array or a single object
  const isSelectedOrderArray = Array.isArray(selectedOrder);
  const selectedOrderIds = isSelectedOrderArray ? selectedOrder : (selectedOrder ? [selectedOrder._id] : []);

  const viewDetails = (order) => {
    setSelectedOrder(order);
    setViewDetails(true);
  };

  const handleShipOrder = (id) => {
    setSelectedOrder([id]);
    setIsShipping(true);
  };
  useEffect(() => {
     console.log("Orders: ", orders);
  }, [orders, loading]);

  const deleteOrder = async (id) => {
    
    setLoading(true);
    try {
      const response =  await axiosInstance.patch(`/orders/delete/${id}`);
      if (response.status === 200) {
        console.log("Order cancelled successfully:", response.data.message);
        toast({
          title: "Cancelled the order successfully",
          variant: "success",
        });
        fetchOrders();
      } else {
        console.error("Failed to delete order:", response.data);
      }
    } catch (error) {
      console.error(
        "Error deleting order:",
        error.response?.data?.error || error.message
      );
      toast({
        title: "Failed to delete. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }

  };

  const toggleSelectOrder = (id) => {
    if (isSelectedOrderArray) {
      setSelectedOrder((prev) =>
        prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
      );
    } else {
      // If selectedOrder is not an array, we need to convert it to an array
      setSelectedOrder([id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedOrder([]);
    } else {
      setSelectedOrder(orders.map((order) => order._id));
    }
    setSelectAll(!selectAll);
  };

  // Handle saving the edited order
  const handleSaveOrder = () => {
    setLoading(true);
    try{
      const response = axiosInstance.put('')
    }catch{

    }finally{
      setLoading(false);
    }
    setIsEditing(false); // Close the dialog
  };

  const handleEditClick = (order) => {
    setEditOrder(order); // Set the order to be edited
    setIsEditing(true); // Open the dialog
    setStep(1); // Reset the step to 1
  };

  const handleCloneClick = () => {
    if (selectedOrderIds.length === 0) {
      toast({
        title: "Please select an order to clone.",
        variant: "destructive",
      });
      return;
    }

    const orderToClone = orders.find((order) => order._id === selectedOrderIds[0]); // Use find for single order

    if (!orderToClone) {
      toast({
        title: "Selected order not found.",
        variant: "destructive",
      });
      return;
    }

    setCloneOrder({ ...orderToClone });
    setIsCloneDialogOpen(true);
    setStep(1);
  };
//   useEffect(() => {
//   if (!loading && orders.length === 0) {
//     fetchOrders();
//   }
// }, [orders, loading]);


 const filteredOrder =  (id) => {
  return orders.find(order => order._id === id);
}


  const handleEditBulk = async () => {

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
       "Actual weight (gm)",
       "Volumetric weight (gm)",
       "Length (cm)",
       "breadth (cm)",
       "Height (cm)",
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
   
     selectedOrderIds.forEach( (Id) => {
      const order =  filteredOrder(Id);
      console.log("filtered Orders :",order.orderId)
       const row = worksheet.addRow([
         order.orderId,
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
     toast("Failed to export Excel");
   }

  }

  
  return (
    <div className="relative">
      <div className="flex gap-2 h-10 py-2 mb-2">
        {selectedOrderIds.length > 0 && (
          <div className="flex gap-2">
            <Button variant="export" onClick={() => setIsShipping(true)}>
              <span>Ship Bulk</span>
            </Button>
            <Button variant="export" onClick={() => setIsShipping(true)}>
              <span>Reverse order</span>
            </Button>
            {selectedOrderIds.length === 1 && (
              <Button variant="export" onClick={handleCloneClick}>
                <CopyPlusIcon className="mr-2 h-4 w-4" />
                <span>Clone Order</span>
              </Button>
            )} {selectedOrderIds.length > 0 && (
              <Button variant="export" onClick={handleEditBulk}>
                 <EditIcon className="h-4 w-4 mr-2" />
                <span>Edit Bulk Order</span>
              </Button>
            )} 
          </div>
        )}
         <Button variant="export"    onClick={() => setCreateForwardBulkOrder(true)}
>
                <span>+ Edit Bulk Upload</span>
              </Button>
      </div>
     
             
            
       <BulkOrder
              isOpen={createForwardBulkOrder}
              setIsOpen={setCreateForwardBulkOrder}
              onUpload={handleUploadEditBulkOrder}
            />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left flex flex-row justify-center items-center gap-x-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
              <span>Select</span>
            </TableHead>
            <TableHead className="text-left">Order ID</TableHead>            
            <TableHead className="text-left">Channel Partner</TableHead>
            <TableHead className="text-left">Date</TableHead>
            <TableHead className="text-left">Method</TableHead>
            <TableHead className="text-left">Consignee</TableHead>
            <TableHead className="text-left">Pincode</TableHead>
            <TableHead className="text-left">Description</TableHead>
            <TableHead className="text-center">Phone</TableHead>
            <TableHead className="text-center">Weight (grams)</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, idx) => (
            <TableRow key={idx} className="item-center">
              <TableCell className="text-left">
                {order.isCancelled || order.shipped ? null : <input
                  type="checkbox"
                  checked={selectedOrderIds.includes(order._id)}
                  onChange={() => toggleSelectOrder(order._id)}
                />}
              </TableCell>
              <TableCell className="text-left font-medium">
                <span
                  className="text-blue-400 cursor-pointer "
                  onClick={() => viewDetails(order)}
                >
                  {order.orderId}
                </span>
              </TableCell>
              <TableCell className="text-left ">
                <span
                >
                  {order.channelPartner || "Default"}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell text-left">
                {new Date(order.createdAt).toISOString().split("T")[0]}
              </TableCell>
              <TableCell className="text-left">
                {order.orderType || order.PRODUCT}
              </TableCell>
              <TableCell className="text-left">{order.consignee}</TableCell>
              <TableCell className="text-left">{order.pincode}</TableCell>
              <TableCell className="text-left">
                {order.itemDescription || order.ITEM_DESCRIPTION}
              </TableCell>
              <TableCell className="text-center">
                {order.mobile || order.MOBILE}
              </TableCell>
              <TableCell className="text-center">
                { Math.max(order.actualWeight, order.volumetricWeight) || 0 }
              </TableCell>
              <TableCell className="text-center">{order.quantity}</TableCell>
              <TableCell className="text-center my-2 space-x-2 flex justify-center item-center">
                {/* Show status based on order state */}
                {order.isCancelled ? (
                  <Button size="" variant="destructive" className="rounded-lg">
                    Cancelled
                  </Button>
                ) : order.shipped ? (
                  <Button size="" variant="export" className="rounded-lg">
                    Booked
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="export"
                      onClick={() => handleEditClick(order)}
                    >
                      <EditIcon className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleShipOrder(order._id)}
                    >
                      <ShipIcon className="h-4 w-4 mr-2" /> Ship
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={ async ()=> await deleteOrder(order._id)}
                    >
                      X  Cancel
                    </Button>
                  </>
                )}
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditOrder isEditing={isEditing} setIsEditing={setIsEditing} editOrder={editOrder} setEditOrder={setEditOrder}/>
      <CloneOrder cloneOrder={cloneOrder} setCloneOrder={setCloneOrder} isCloneDialogOpen={isCloneDialogOpen} setIsCloneDialogOpen={setIsCloneDialogOpen}/>
    </div>
  );
};

export default OrdersTable;

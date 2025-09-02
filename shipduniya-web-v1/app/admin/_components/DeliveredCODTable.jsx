import React, { useState , useEffect} from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ChevronDown, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";

const formatStatus = (status) => {
  switch (status?.toLowerCase()) {
    case "unpaid":
      return "Unpaid";
    case "approval_pending":
      return "Approval Pending";
    case "paid":
      return "Paid";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};

const DeliveredCODTable = ({ data = [], userDetails }) => {
   const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [selected, setSelected] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (data !== undefined) {
      setDataLoading(false);
    }
  }, [data]);
  const toggleRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleOrderSelection = (order) => {
    setSelectedOrders((prev) => {
      const exists = prev.find((o) => o.orderId === order.orderId);
      return exists ? prev.filter((o) => o.orderId !== order.orderId) : [...prev, order];
    });
  };

  const handleActionClick = (item, order = null) => {
    if(order && order?.status !== "unpaid"){
      toast({
        title:`Action not Valid for ${formatStatus(order.status)}  Status !`,
        variant:"destructive"

      })
      return;
    }else{
    setSelected(order ? { ...order, isOrder: true } : { ...item, isOrder: false });
    setRemark("");
    setOpen(true);}
  };


// Handle API action submission
const handleActionSubmit = async (remittanceRequestIds) => {
  try {
    await axiosInstance.post("/remittance/approval-pending-action", {
      remittanceRequestIds,
      remark: remark.trim() || undefined,
    });

 
    toast({
      title: "Approved",
      description: `${remittanceRequestIds.length} ${
        remittanceRequestIds.length > 1 ? "orders" : "order"
      } approved successfully.`,
    });

    
    setInterval(()=>{ },1000);

     window.location.reload();

    setBulkOpen(false);
    setOpen(false);
    setSelected(null);
    setSelectedOrders([]);

   
    setRemark("");
  } catch (error) {
    console.error("Approval Error:", error);
   
  }
};
function replaceCourierName(str) {
  if (!str) return "";

  return str
    .replace(/xpressbees/gi, "Shipduniya XB")
    .replace(/delhivery/gi, "Shipduniya DL");
}


function replaceFirstAndRemoveRemaining(RaworiginalString) {
  const originalString = replaceCourierName(RaworiginalString);

  const targetWord = originalString.includes('Shipduniya XB')?"Shipduniya XB":"Shipduniya DL"
  const firstIndex = originalString.indexOf(targetWord);



  if (firstIndex === -1) {
    return originalString;
  }


  const partBefore = originalString.substring(0, firstIndex);

  const partAfter = originalString.substring(firstIndex + targetWord.length);

  const cleanedPartAfter = partAfter.replace(new RegExp(targetWord, 'g'), '');

  return partBefore + targetWord + cleanedPartAfter;
}

// Handle individual or bulk submit
const handleSubmit = async () => {
  setLoading(true);
  try {
    if (selected?.isOrder) {
       const remittanceRequestId = [selected.requestRemittanceId];
       const res =  await handleActionSubmit(remittanceRequestId);
    } else if (selected?.orders?.length > 0) {
      const remittanceRequestIds = selected.orders.map((r) => r.status === "unpaid"? r.requestRemittanceId : null );
      await handleActionSubmit(remittanceRequestIds);
    }
  } catch (error) {
    console.error(error);
    toast({
      variant: "destructive",
      title: "Approval Failed",
      description: "Something went wrong.",
    });
  } finally {
    setLoading(false);
  }
};




  const handleBulkSubmit = async () => {
    setBulkLoading(true);
    try {
      const remittanceRequestIds = selectedOrders.map((order) => order.requestRemittanceId);
      await axiosInstance.post("/remittance/approval-pending-action", {
        remittanceRequestIds,
        remark: remark.trim() || undefined,
      });
      toast({ title: "Bulk Approved", description: `${selectedOrders.length} orders approved.` });
      window.location.reload();

      setBulkOpen(false);
      setSelectedOrders([]);
      setRemark("");
    } catch (error) {
      console.error("Bulk Approval Failed:", error);
      toast({ variant: "destructive", title: "Bulk Approval Failed", description: "Server error or bad request." });
    } finally {
      setBulkLoading(false);
    }
  };


  const exportSellerData = (seller) => {
    const csvContent = [
      ["Order ID", "AWB", "Consignee", "Courier", "COD Amount"],
      ...(seller.orders || []).map((order) => [
        order.orderId,
        order.awbNumber,
        order.consigneeName,
        order.courierPartner,
        order.codAmount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Seller-${seller.sellerId}-orders.csv`;
    link.click();
  };

  const downloadExcel = async (seller) => {
    console.log("seller data to download ", seller)
    // dynamic import to avoid SSR problems
    const ExcelJS = await import("exceljs");

    // If you got the ESM default under .default:
    const Excel = ExcelJS?.Workbook ? ExcelJS : ExcelJS.default ? ExcelJS.default : ExcelJS;
    const workbook = new Excel.Workbook();

    workbook.creator = "Your App";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Remittance", {
      views: [{ state: "frozen", ySplit: 1 }]
    });

    // Headers
    const headers = [
      "S.NO",
      "ORDER ID",
      "AWB",
      "ORDER TYPE",
      "COD AMOUNT",
      "PINCODE",
      "STATUS",
      "DELIVERY DATE",
   
    ];

    const headerRow = sheet.addRow(headers);

    // Header styling: yellow background, bold, center, borders
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" } // pale yellow; change hex if you want exact color
      };
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // Helper for date parsing (accepts ISO yyyy-mm-dd or dd/mm/yyyy)
    const toDate = (v) => {
      if (!v) return null;
      if (v instanceof Date) return v;
      // try ISO first
      const d = new Date(v);
      if (!isNaN(d)) return d;
      // try dd/mm/yyyy
      const parts = v.split("/");
      if (parts.length === 3) {
        const [dP, mP, yP] = parts.map((x) => parseInt(x, 10));
        return new Date(yP, mP - 1, dP);
      }
      return null;
    };

    // Add rows
    const orders = (seller && seller.orders) || [];
    orders.forEach((order, idx) => {
      const deliveryDate = toDate(order.date);
      const paymentDate = toDate(order.paymentDate);

      const rowValues = [
        idx + 1,
        order.orderId || "",
        order.awbNumber || "",
        order.orderType || "",
        order.codAmount != null ? order.codAmount : "",
        order.pincode || "",
        order.status || "",
      ];
      const row = sheet.addRow(rowValues);

      // COD amount number format + right align
      const codCell = row.getCell(6);
      if (codCell.value !== "") {
        codCell.numFmt = "#,##0.00"; // two decimal places
        codCell.alignment = { horizontal: "right" };
      }

      // Delivery date (col 9) and payment date (col 11)
      if (deliveryDate) {
        const c = row.getCell(8);
        c.value = deliveryDate;
        c.numFmt = "dd/MM/yyyy";
        c.alignment = { horizontal: "center" };
      }
      if (paymentDate) {
        const c = row.getCell(11);
        c.value = paymentDate;
        c.numFmt = "dd/MM/yyyy";
        c.alignment = { horizontal: "center" };
      }

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
    });

    // Auto-size columns (simple heuristic)
    sheet.columns.forEach((col) => {
      let maxLength = 0;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const v = cell.value;
        // If cell is a date object, estimate length of formatted date
        let text = "";
        if (v == null) text = "";
        else if (v instanceof Date) text = "dd/mm/yyyy";
        else if (typeof v === "object" && v.richText) text = v.richText.map(t => t.text).join("");
        else text = v.toString();
        maxLength = Math.max(maxLength, text.length);
      });
      const padding = 3;
      col.width = Math.max(10, Math.min(60, maxLength + padding));
    });

    // Seller summary below data
    const emptyRowIndex = sheet.rowCount + 2;
    const sellerInfoRow = sheet.getRow(emptyRowIndex);
    sellerInfoRow.getCell(1).value = "Seller:";
    sellerInfoRow.getCell(2).value = seller.sellerName || "";
    sellerInfoRow.getCell(4).value = "Bank:";
    sellerInfoRow.getCell(5).value = seller.bankName || "";

    const totalsRow = sheet.getRow(emptyRowIndex + 1);
    totalsRow.getCell(4).value = "Total AWB:";
    totalsRow.getCell(5).value = seller.totalAWB || orders.length;
    totalsRow.getCell(6).value = "Total COD:";
    totalsRow.getCell(7).value = seller.totalCOD || orders.reduce((s, o) => s + (o.codAmount || 0), 0);

    [sellerInfoRow, totalsRow].forEach((r) => {
      [1, 4].forEach((idx) => {
        const c = r.getCell(idx);
        if (c.value) c.font = { bold: true };
      });
    });

    // Write workbook to buffer (browser)
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    // Trigger download (vanilla)
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `remittance-${seller.sellerName ? seller.sellerName.replace(/\s+/g, "_") : "export"}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };




  const totalSelectedCOD = selectedOrders.reduce((sum, order) => sum + (order.codAmount || 0), 0);

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
        <span className="ml-4 text-gray-600">Loading data...</span>
      </div>
    );

  }

  if(!data.length>0){
   return( 
   <div className="flex justify-center items-center text-center my-8">
            <h1 className="bold">No available remittance request</h1>
            </div>
            )
  }


  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All User Delivered COD</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>S. No</TableHead>
            <TableHead>Seller ID</TableHead>
            <TableHead>Seller Name</TableHead>
            <TableHead>Bank Name</TableHead>
            <TableHead>Account Number</TableHead>
            <TableHead>IFSC</TableHead>
            <TableHead>Account Type</TableHead>
            <TableHead>City/State</TableHead>
            <TableHead>Total COD</TableHead>
            <TableHead>Total AWB</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Download</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell
                  onClick={() => toggleRow(index)}
                  className="cursor-pointer"
                >
                  {expandedRows[index] ? <ChevronDown /> : <ChevronRight />}
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.sellerId}</TableCell>
                <TableCell>{item.sellerName}</TableCell>
                <TableCell>{item.bankName}</TableCell>
                <TableCell>{item.accountNumber}</TableCell>
                <TableCell>{item.ifscCode}</TableCell>
                <TableCell>{item.accountType}</TableCell>
                <TableCell>{item.cityState}</TableCell>
                <TableCell>{item.totalCOD}</TableCell>
                <TableCell>{item.totalAWB}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => handleActionClick(item)}
                  >
                    Action
                  </Button>
                </TableCell>
                <TableCell>
                  <div onClick={()=> downloadExcel(item)}>
                  <Button variant="outline" >
                    <Download className="w-4 h-4" />
                  </Button></div>
                </TableCell>
              </TableRow>

              {expandedRows[index] && (
                <TableRow>
                  <TableCell colSpan={12}>
                    <div className="bg-gray-100 p-4 rounded-lg border">
                      <h4 className="text-md font-semibold mb-3 text-gray-700">
                        Order Details
                      </h4>

                      {selectedOrders.length > 0 && (
                        <div className="mb-4 flex justify-between items-center bg-gray-100 border px-4 py-2 rounded-md shadow">
                          <span className="text-sm text-gray-700 font-medium">
                            {selectedOrders.length} order(s) selected
                          </span>
                          <Button
                            className="bg-green-600 text-white"
                            onClick={() => setBulkOpen(true)}
                          >
                            Bulk Action
                          </Button>
                        </div>
                      )}

                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                          <thead className="bg-gray-200 text-gray-700">
                            <tr>
                              <th className="px-3 py-2">Select</th>
                              <th className="px-3 py-2">S. No</th>
                              <th className="px-3 py-2">Order ID</th>
                              <th className="px-3 py-2">AWB Number</th>
                              <th className="px-3 py-2">Consignee</th>
                              <th className="px-3 py-2">Courier</th>
                              <th className="px-3 py-2">Order Type</th>
                              <th className="px-3 py-2">Date</th>
                              <th className="px-3 py-2">COD Amount</th>
                              <th className="px-3 py-2">Pincode</th>
                              <th className="px-3 py-2">Status</th>
                              <th className="px-3 py-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.orders.map((order, i) => (
                              <tr key={i} className="border-t">
                                <td className="px-3 py-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedOrders.some(
                                      (o) => o.orderId === order.orderId
                                    )}
                                    onChange={() => toggleOrderSelection(order)}
                                  />
                                </td>
                                <td className="px-3 py-2">{i + 1}</td>
                                <td className="px-3 py-2">{order.orderId}</td>
                                <td className="px-3 py-2">{order.awbNumber}</td>
                                <td className="px-3 py-2">
                                  {order.consigneeName}
                                </td>
                                <td className="px-3 py-2">
                                  {replaceFirstAndRemoveRemaining(order.courierPartner)}
                                </td>
                                <td className="px-3 py-2">{order.orderType}</td>
                                <td className="px-3 py-2">
                                  {new Date(order.date).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-2">{order.codAmount}</td>
                                <td className="px-3 py-2">{order.pincode}</td>
                                <td className="px-3 py-2">{formatStatus(order.status)}</td>
                                <td className="px-3 py-2">
                                  <Button
                                    variant="ghost"
                                    className="text-green-600"
                                    onClick={() =>
                                      handleActionClick(item, order)
                                    }
                                  >
                                    Action
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))} 
        </TableBody>
      </Table>

      {/* Individual Action Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              Action <CheckCircle className="text-green-600 w-5 h-5" />
            </DialogTitle>
          </DialogHeader>

          <h3 className="text-lg mb-4 text-gray-800">
            {selected?.isOrder
              ? `Approve payment of ₹${selected?.codAmount}`
              : `Approve payment of ₹${selected?.totalCOD}`}
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            {selected?.isOrder ? (
              <>
                <div>
                  <strong>Order ID:</strong> {selected.orderId}
                </div>
                <div>
                  <strong>AWB:</strong> {selected.awbNumber}
                </div>
                <div>
                  <strong>Consignee:</strong> {selected.consigneeName}
                </div>
                <div>
                  <strong>Courier:</strong> {replaceFirstAndRemoveRemaining(selected.courierPartner)}
                </div>
                <div>
                  <strong>Order Type:</strong> {selected.orderType}
                </div>
                <div>
                  <strong>Pincode:</strong> {selected.pincode}
                </div>
                <div>
                  <strong>Status:</strong> {selected.status}
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>Seller ID:</strong> {selected?.sellerId}
                </div>
                <div>
                  <strong>Seller Name:</strong> {selected?.sellerName}
                </div>
                <div>
                  <strong>Bank Name:</strong> {selected?.bankName}
                </div>
                <div>
                  <strong>IFSC:</strong> {selected?.ifscCode}
                </div>
                <div>
                  <strong>Account Type:</strong> {selected?.accountType}
                </div>
                <div>
                  <strong>City/State:</strong> {selected?.cityState}
                </div>

                {/* 👇 Export button aligned next to City/State */}

                <Button
                  variant="outline"
                  className="text-xs mt-2 w-fit "
                  onClick={() => downloadExcel(selected)}
                >
                  Export File
                </Button>
              </>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="remark" className="block text-sm font-medium mb-1">
              Remark / Message
            </Label>
            <Textarea
              id="remark"
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-5">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-primary text-white" onClick={handleSubmit}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Modal */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Bulk Action <CheckCircle className="text-green-600 w-5 h-5" />
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-800 mb-3">
            Approve payment of ₹<strong>{totalSelectedCOD}</strong> for{" "}
            <strong>{selectedOrders.length}</strong> order(s)
          </p>

          <div className="max-h-[300px] overflow-y-auto bg-gray-50 border rounded-md p-3 mb-4">
            <table className="w-full text-sm table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2 text-left">Order ID</th>
                  <th className="px-2 py-2 text-left">AWB</th>
                  <th className="px-2 py-2 text-left">Consignee</th>
                  <th className="px-2 py-2 text-left">Courier</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrders.map((order, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-2 py-2">{order.orderId}</td>
                    <td className="px-2 py-2">{order.awbNumber}</td>
                    <td className="px-2 py-2">{order.consigneeName}</td>
                    <td className="px-2 py-2">{replaceFirstAndRemoveRemaining(order.courierPartner)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Label className="block text-sm mb-1">Remark</Label>
          <Textarea
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          <DialogFooter className="mt-5">
            <Button variant="outline" onClick={() => setBulkOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={handleBulkSubmit}
              disabled={bulkLoading}
            >
              {bulkLoading ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveredCODTable;

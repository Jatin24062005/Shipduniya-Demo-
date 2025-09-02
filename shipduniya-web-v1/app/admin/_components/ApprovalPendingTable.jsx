import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AwardIcon, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/utils/axios";

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

const ApprovalPendingTable = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedOrderRows, setSelectedOrderRows] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [cityStateMap, setCityStateMap] = useState({});
  const [rejectingRemittanceId, setRejectingRemittanceId] = useState(null);
  const [rejectingOrderId, setRejectingOrderId] = useState(null);

  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  // -------------------- SELECT HANDLERS --------------------
  const handleSelect = (id) => {
    setSelectedRows((prev) => {
      const isSelected = prev.includes(id);
      const updatedSelectedRows = isSelected
        ? prev.filter((i) => i !== id)
        : [...prev, id];

      // Auto-update child selection
      setSelectedOrderRows((prevOrderRows) => {
        const remittance = data.find((d) => d._id === id);
        if (!remittance || !remittance.remittanceRequestIds)
          return prevOrderRows;

        const orderIds = remittance.remittanceRequestIds.map((r) => r._id);

        const updated = { ...prevOrderRows };

        if (isSelected) {
          // Deselect child orders
          delete updated[id];
        } else {
          // Select all child orders
          updated[id] = orderIds;
        }

        return updated;
      });

      return updatedSelectedRows;
    });
  };

  const handleSelectAll = () => {
    setSelectedRows((prev) =>
      prev.length === data.length ? [] : data.map((item) => item._id)
    );
  };
  const handleOrderSelect = (remittanceId, orderId) => {
    setSelectedOrderRows((prev) => {
      const current = prev[remittanceId] || [];

      let updatedOrders;
      if (current.includes(orderId)) {
        updatedOrders = current.filter((id) => id !== orderId);
      } else {
        updatedOrders = [...current, orderId];
      }

      const updated = {
        ...prev,
        [remittanceId]: updatedOrders,
      };

      // If none selected, remove key to clean state
      if (updatedOrders.length === 0) {
        delete updated[remittanceId];
      }

      return updated;
    });

    // Automatically toggle parent row selection
    setSelectedRows((prevSelectedRows) => {
      const remittance = data.find((r) => r._id === remittanceId);
      if (!remittance) return prevSelectedRows;

      const totalOrders = remittance.remittanceRequestIds.length;
      const selectedOrders = (selectedOrderRows[remittanceId] || []).includes(
        orderId
      )
        ? (selectedOrderRows[remittanceId] || []).length - 1 // unselecting
        : (selectedOrderRows[remittanceId] || []).length + 1; // selecting

      if (selectedOrders === 0) {
        return prevSelectedRows.filter((id) => id !== remittanceId);
      } else if (selectedOrders === totalOrders) {
        return [...new Set([...prevSelectedRows, remittanceId])];
      } else {
        return prevSelectedRows;
      }
    });
  };

  const handleOrderSelectAll = (remittanceId, orders) => {
    const allOrderIds = orders.map((o) => o._id);
    setSelectedOrderRows((prev) => {
      const alreadySelected = prev[remittanceId] || [];
      return {
        ...prev,
        [remittanceId]:
          alreadySelected.length === allOrderIds.length ? [] : allOrderIds,
      };
    });
  };

  const toggleRow = (idx) => {
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // -------------------- API CALLS --------------------
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/remittance/getRemittances");
      setData(res.data.Remittances || []);
      console.log("Approval Pending Data: ", res.data);
    } catch (err) {
      toast({
        title: "Failed to fetch remittance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const rejectRemittances = async (ids) => {
    try {
      await axiosInstance.post("/remittance/reject-action", {
        rejectRemittanceIds: ids,
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const handleBulkReject = async () => {
    try {

      console.log('SelectedOrdersRows here in HandleBbulk reject',selectedOrderRows);
      console.log('SelectedRows here in HandleBbulk reject',selectedRows);

      const allSelectedRequestIds = Object.values(selectedOrderRows).flat();
        const result = await rejectRemittances(allSelectedRequestIds);
      if (result.success) {
        toast({ title: "Remittance rejected" });
        await fetchData(); // Refresh after action
      } else {
        toast({ title: "Remittance rejection failed", variant: "destructive" });
      }

      await fetchData(); // <-- Refetch latest data

      if (!remittanceError && !orderError) {
        toast({ title: "Rejected successfully" });
      } else if (remittanceError && orderError) {
        toast({ title: "Both rejections failed", variant: "destructive" });
      } else if (remittanceError) {
        toast({ title: "Remittance rejection failed", variant: "destructive" });
      } else if (orderError) {
        toast({ title: "Order rejection failed", variant: "destructive" });
      }
    } catch (err) {
      toast({
        title: "Bulk rejection failed",
        description: err?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRemittance = async (remittanceId) => {
    const remittance = data.find((r) => r._id === remittanceId);
    if (!remittance) return;

    const orderIds = remittance.remittanceRequestIds.map((r) => r._id);
    setRejectingRemittanceId(remittanceId);

    setLoading(true);
    try {
      const result = await rejectRemittances(orderIds);
      if (result.success) {
        toast({ title: "Remittance rejected" });
        await fetchData(); // Refresh after action
      } else {
        toast({ title: "Remittance rejection failed", variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Error rejecting remittance",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setRejectingRemittanceId(null);
      setLoading(false);
    }
  };

  const handleRejectSingleOrder = async (orderId) => {
    setRejectingOrderId(orderId);
    setLoading(true);
    try {
      const result = await rejectRemittances([orderId]);
      if (result.success) {
        toast({ title: "Order rejected" });
        await fetchData();
      } else {
        toast({ title: "Order rejection failed", variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Error rejecting order",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setRejectingOrderId(null);

      setLoading(false);
    }
  };

  const fetchCityState = async () => {
    const pincodes = Array.from(
      new Set(
        data
          .map((d) => d.sellerId?.pincode)
          .filter((p) => p && p.length === 6 && !cityStateMap[p])
      )
    );

    const results = await Promise.all(
      pincodes.map(async (pincode) => {
        try {
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`
          );
          const json = await res.json();
          const loc = json?.[0]?.PostOffice?.[0];
          return [pincode, loc ? `${loc.District}, ${loc.State}` : "-"];
        } catch {
          return [pincode, "-"];
        }
      })
    );

    setCityStateMap((prev) =>
      Object.fromEntries([...Object.entries(prev), ...results])
    );
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (data.length) fetchCityState();
  }, [data]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
        <span className="ml-4 text-gray-600">Loading data...</span>
      </div>
    );
  }
  
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
  
const downloadExcel = async (seller) => {
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
    "REMITTANCE ID",
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
  const orders = (seller && seller.remittanceRequestIds) || [];
  orders.forEach((order, idx) => {
    const deliveryDate = toDate(order.date);
    const paymentDate = toDate(order.paymentDate);

    const rowValues = [
      idx + 1,
      order.orderNumber || "",
      order.awbNumber || "",
      seller.remittanceId || "",
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




  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Approval Pending</h2>

        {(selectedRows.length > 0 ||
          Object.values(selectedOrderRows).some((arr) => arr.length > 0)) && (
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" onClick={handleBulkReject}>
              <span className="text-white mr-1">
                (
                {
                  Object.values(selectedOrderRows).reduce(
                    (a, b) => a + b.length,
                    0
                  )}
                )
              </span>
              Bulk Reject
            </Button>
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={selectedRows.length === data.length && data.length > 0}
                onChange={handleSelectAll}
              />
            </TableHead>
            <TableHead />
            <TableHead>S. No</TableHead>
            <TableHead>Seller ID</TableHead>
            <TableHead>Seller Name</TableHead>
            <TableHead>Remittance ID</TableHead>
            <TableHead>Bank Name</TableHead>
            <TableHead>IFSC Code</TableHead>
            <TableHead>Account Type</TableHead>
            <TableHead>City & State</TableHead>
            <TableHead>Total Delivered COD</TableHead>
            <TableHead>Total AWB</TableHead>
            <TableHead className="text-center">Action</TableHead>
            <TableHead>Download</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data
            .filter(
              (item) =>
                Array.isArray(item.remittanceRequestIds) &&
                item.remittanceRequestIds.length > 0
            ).filter(item=> item.status ==="approval_pending").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item, index) => (
              <React.Fragment key={item._id}>
                <TableRow>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item._id)}
                      onChange={() => handleSelect(item._id)}
                    />
                  </TableCell>
                  <TableCell
                    onClick={() => toggleRow(index)}
                    className="cursor-pointer"
                  >
                    {expandedRows[index] ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.sellerId?._id}</TableCell>
                  <TableCell>{item.sellerId?.name}</TableCell>
                  <TableCell>{item.remittanceId}</TableCell>
                  <TableCell>
                    {item.sellerId?.bankDetails[0]?.bankName}
                  </TableCell>
                  <TableCell>
                    {item.sellerId?.bankDetails[0]?.ifscCode}
                  </TableCell>
                  <TableCell>
                    {item.sellerId?.bankDetails[0]?.accountType}
                  </TableCell>
                  <TableCell>
                    {item.sellerId?.pincode &&
                    item.sellerId.pincode.length === 6
                      ? cityStateMap[item.sellerId.pincode] || "Loading..."
                      : "-"}
                  </TableCell>
                  <TableCell>{item.totalDeliveredCod}</TableCell>
                  <TableCell>{item.totalAwb}</TableCell>
                  <TableCell className="p-0">
                    <div className="flex gap-2 justify-center items-center h-full min-h-[48px] w-full">
                      <Button
                        size="sm"
                        className="text-xs font-semibold px-4 py-2 border border-yellow-400 text-yellow-400"
                      >
                        {formatStatus(item.status)}
                      </Button>
                     {item.status==="approval_pending" && <Button
                        size="sm"
                        variant="destructive"
                        disabled={rejectingRemittanceId === item._id}
                        onClick={() => handleRejectRemittance(item._id)}
                      >
                        {rejectingRemittanceId === item._id
                          ? "Rejecting..."
                          : "Reject"}
                      </Button>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button className="text-gray-700 border border-slate-700 text-xs" onClick={()=> downloadExcel(item)}>
                      Download
                    </Button>
                  </TableCell>
                </TableRow>

                {expandedRows[index] && (
                  <TableRow>
                    <TableCell colSpan={14}>
                      <div className="bg-gray-100 p-4 rounded-xl shadow-inner border">
                        <h4 className="text-md font-semibold mb-3 text-gray-700">
                          Order Details
                        </h4>
                        <div className="flex justify-end mb-2">
                          {/* {item.remittanceRequestIds?.length > 0 && (
                          // <Button
                          //   size="sm"
                          //   variant="destructive"
                          //   disabled={!(selectedOrderRows[item._id]?.length > 0)}
                          //   onClick={() => handleBulkOrderReject(item._id)}
                          // >
                          //   Bulk Reject Orders ({selectedOrderRows[item._id]?.length || 0})
                          // </Button>
                        )} */}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm text-left">
                            <thead>
                              <tr className="bg-gray-200 text-gray-700">
                                <th className="px-3 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={
                                      item.remittanceRequestIds?.length > 0 &&
                                      selectedOrderRows[item._id]?.length ===
                                        item.remittanceRequestIds.length
                                    }
                                    onChange={() =>
                                      handleOrderSelectAll(
                                        item._id,
                                        item.remittanceRequestIds
                                      )
                                    }
                                  />
                                </th>
                                <th className="px-3 py-2 text-center">S. No</th>
                                <th className="px-3 py-2 text-center">
                                  Order ID
                                </th>
                                <th className="px-3 py-2 text-center">AWB</th>
                                <th className="px-3 py-2 text-center">
                                  Consignee
                                </th>
                                <th className="px-3 py-2 text-center">
                                  Courier
                                </th>
                                <th className="px-3 py-2 text-center">
                                  Order Type
                                </th>
                                <th className="px-3 py-2 text-center">COD</th>
                                <th className="px-3 py-2 text-center">
                                  Pincode
                                </th>
                                <th className="px-3 py-2 text-center">
                                  Status
                                </th>
                                <th className="px-3 py-2 text-center">Date</th>
                                <th className="px-3 py-2 text-center">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.remittanceRequestIds?.map((order, oIdx) => (
                                <tr
                                  key={order.orderId || oIdx}
                                  className="border-t"
                                >
                                  <td className="px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={(
                                        selectedOrderRows[item._id] || []
                                      ).includes(order._id)}
                                      onChange={() =>
                                        handleOrderSelect(item._id, order._id)
                                      }
                                    />
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {oIdx + 1}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {order.orderNumber || order.orderId}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {order.awbNumber}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {order.consignee}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {replaceFirstAndRemoveRemaining(order.courier)}
                                  </td>
                                  <td className="px-3 py-2 text-center">COD</td>
                                  <td className="px-3 py-2 text-center">
                                    {order.codAmount || 100}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {order.pincode}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {formatStatus(order.status)}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {new Date(
                                      order.requestDate
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="px-3 py-2 text-center flex gap-2 justify-center">
                                    <Button
                                      size="sm"
                                      className="text-xs font-semibold px-4 py-2 border border-yellow-400 text-yellow-400"
                                    >
                                      Pending
                                    </Button>
                                  {order.status==="approval_pending" &&  <Button
                                      size="sm"
                                      variant="destructive"
                                      disabled={rejectingOrderId === order._id}
                                      onClick={() =>
                                        handleRejectSingleOrder(order._id)
                                      }
                                    >
                                      {rejectingOrderId === order._id
                                        ? "Rejecting..."
                                        : "Reject"}
                                    </Button>}
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
    </div>
  );
};

export default ApprovalPendingTable;

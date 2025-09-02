"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, ChevronDown } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { useToast } from "@/components/ui/use-toast";

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

const AdminDetailCard = ({ admin = demoAdmin, onBack }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedOrderRows, setSelectedOrderRows] = useState({});
  const [data, setData] = useState([admin]);
  const [cityStateMap, setCityStateMap] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [remark, setRemark] = useState("");
  const [rejcetingOrderId, setRejectingOrderId] = useState("");
  const [rejcetingRemittanceId, setRejectingRemittanceId] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  // Fake city/state data just for testing
  useEffect(() => {
    // Provide mock city/state data for testing
    const mockData = {
      400001: "Mumbai, Maharashtra",
      400002: "Thane, Maharashtra",
    };
    console.log("Data on AdmiDetailedCard:", data);
    setCityStateMap(mockData);
  }, []);

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSelect = (remittanceId) => {
    setSelectedRows((prev) =>
      prev.includes(remittanceId)
        ? prev.filter((id) => id !== remittanceId)
        : [...prev, remittanceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((item) => item._id));
    }
  };
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/remittance/getRemittances");
      setData(res.data.Remittances || []);
      console.log("Data fetched: ", res.data);
    } catch (err) {
      toast({
        title: "Failed to fetch remittance data",
        variant: "destructive",
      });
    }
  };

  const handleOrderSelect = (remittanceId, orderId) => {
    setSelectedOrderRows((prev) => {
      const current = prev[remittanceId] || [];
      return {
        ...prev,
        [remittanceId]: current.includes(orderId)
          ? current.filter((id) => id !== orderId)
          : [...current, orderId],
      };
    });
  };

  const handleOrderSelectAll = (remittanceId, orders) => {
    const allIds = orders.map((o) => o.orderId);
    setSelectedOrderRows((prev) => {
      const current = prev[remittanceId] || [];
      return {
        ...prev,
        [remittanceId]: current.length === allIds.length ? [] : [...allIds],
      };
    });
  };
  const handleMarkAsPaid = (remittance) => {
    if (remittance.status !== "approval_pending") {
      toast({
        title: `Mark Paid not Valid for ${formatStatus(remittance.status)} !`,
        variant: "destructive",
      });
      return;
    }
    setPaymentData(remittance);
    setShowPaymentModal(true);
  };

  //   const handleBulkApprove = () => {
  //     alert("✅ Bulk Approved: " + selectedRows.join(", "));
  //   };

  //   const handleBulkReject = () => {
  //     alert(
  //       "❌ Bulk Rejected: " +
  //         (selectedRows.join(", ") +
  //           " | Orders: " +
  //           Object.entries(selectedOrderRows)
  //             .map(([remId, orderIds]) => `${remId}: [${orderIds.join(", ")}]`)
  //             .join(" | "))
  //     );
  //   };

  function replaceCourierName(str) {
    if (!str) return "";

    return str
      .replace(/xpressbees/gi, "Shipduniya XB")
      .replace(/delhivery/gi, "Shipduniya DL");
  }

  function replaceFirstAndRemoveRemaining(RaworiginalString) {
    const originalString = replaceCourierName(RaworiginalString);

    const targetWord = originalString.includes("Shipduniya XB")
      ? "Shipduniya XB"
      : "Shipduniya DL";
    const firstIndex = originalString.indexOf(targetWord);

    if (firstIndex === -1) {
      return originalString;
    }

    const partBefore = originalString.substring(0, firstIndex);

    const partAfter = originalString.substring(firstIndex + targetWord.length);

    const cleanedPartAfter = partAfter.replace(new RegExp(targetWord, "g"), "");

    return partBefore + targetWord + cleanedPartAfter;
  }

  const handleConfirmPaid = async (payRemittanceId) => {
    const res = await axiosInstance.post("/remittance/paid-action", {
      payRemittanceId,
      remark,
      transactionId,
    });
    await fetchData();

    console.log("Response for handleCOnfirm Paid", res.data);
  };

  const handleBulkReject = async () => {
    try {
      console.log(
        "SelectedOrdersRows here in HandleBbulk reject",
        selectedOrderRows
      );
      console.log("SelectedRows here in HandleBbulk reject", selectedRows);

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
  const downloadExcel = async (seller) => {
    // dynamic import to avoid SSR problems
    const ExcelJS = await import("exceljs");

    // If you got the ESM default under .default:
    const Excel = ExcelJS?.Workbook
      ? ExcelJS
      : ExcelJS.default
      ? ExcelJS.default
      : ExcelJS;
    const workbook = new Excel.Workbook();

    workbook.creator = "Your App";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Remittance", {
      views: [{ state: "frozen", ySplit: 1 }],
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
        fgColor: { argb: "FFFF00" }, // pale yellow; change hex if you want exact color
      };
      cell.font = { bold: true };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
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
          right: { style: "thin" },
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
        else if (typeof v === "object" && v.richText)
          text = v.richText.map((t) => t.text).join("");
        else text = v.toString();
        maxLength = Math.max(maxLength, text.length);
      });
      const padding = 3;
      col.width = Math.max(10, Math.min(60, maxLength + padding));
    });

    // Write workbook to buffer (browser)
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Trigger download (vanilla)
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `remittance-${
      seller.sellerName ? seller.sellerName.replace(/\s+/g, "_") : "export"
    }.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
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
    if (data.length) {
      fetchCityState();
    }
  }, [data]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">All Approval Pending</h2>
        </div>
        <div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm" onClick={onBack}>
              Back
            </Button>
          </div>
        </div>
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
                item?.remittanceRequestIds?.length > 0 &&
                item.status === "approval_pending"
            )
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
                        className="text-xs font-semibold px-4 py-2 border border-green-400 text-green-400"
                        onClick={() => handleMarkAsPaid(item)}
                      >
                        {item.status === "approval_pending"
                          ? "Mark Paid"
                          : "Paid"}
                      </Button>
                      {item.status === "approval_pending" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectRemittance(item._id)}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="text-gray-700 border border-slate-700 text-xs"
                      onClick={() => downloadExcel(item)}
                    >
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
                                      ).includes(order.orderId)}
                                      onChange={() =>
                                        handleOrderSelect(
                                          item._id,
                                          order.orderId
                                        )
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
                                    {replaceCourierName(order.courier)}
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
                                      {formatStatus(order.status)}
                                    </Button>
                                    {order.status === "approval_pending" && (
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          handleRejectSingleOrder(order._id)
                                        }
                                      >
                                        Reject
                                      </Button>
                                    )}
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
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Mark as Paid</h2>
            <p>
              <strong>Remittance ID:</strong> {paymentData?._id}
            </p>
            <p>
              <strong>Seller:</strong> {paymentData?.sellerId?.name}
            </p>
            <p>
              <strong>Total COD:</strong> ₹{paymentData?.totalDeliveredCod}
            </p>

            <div className="mt-4">
              <label className="block mb-1 font-medium">Transaction ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Enter transaction ID"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-1 font-medium">Remark</label>
              <textarea
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Enter remark"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert(`✅ Paid\nTXN: ${transactionId}\nRemark: ${remark}`);
                  setShowPaymentModal(false);
                  setTransactionId("");
                  setRemark("");
                  handleConfirmPaid(paymentData?._id);
                }}
              >
                Confirm Paid
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDetailCard;

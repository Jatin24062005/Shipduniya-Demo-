// File: components/PaidCODTable.js
import React, { useState,useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
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

const UserRemittance = ({data}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const {toast } = useToast
  
  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
      "PAYMENT STATUS",
      "PAYMENT DATE",
      "TRANS ID"
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
        deliveryDate ? deliveryDate :new Date(order.createdAt).toLocaleDateString(),
        seller.status || "",
        paymentDate ? paymentDate :  new Date(seller.paymentDate).toLocaleDateString(),
        seller.transactionId || ""
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
        const c = row.getCell(9);
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



  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">All Paid COD</h2>
      <Table >
        <TableHeader>
          <TableRow >
            <TableHead></TableHead>
            <TableHead>S. No</TableHead>
            <TableHead>Remittance ID</TableHead>
            <TableHead>City & State</TableHead>
            <TableHead>Total Delivered COD</TableHead>
            <TableHead>Total AWB</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Download</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.filter(item => item.remittanceRequestIds.length>0 && item.status === "paid").sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
            <React.Fragment key={index}>
              <TableRow className="hover:bg-gray-50">
                <TableCell onClick={() => toggleRow(index)} className="cursor-pointer select-none w-8">
                  {expandedRows[index] ? (
                    <ChevronDown className="w-4 h-4 text-gray-700" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  )}
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.remittanceId || "N/A"}</TableCell>
                  <TableCell>{item?.sellerId?.pincode || "—"}</TableCell>
                  <TableCell>{item?.totalDeliveredCod || "—"}</TableCell>
                  <TableCell>{item?.totalAwb || "—"}</TableCell>
                  <TableCell>{new Date(item?.paymentDate).toLocaleDateString()  || "—"}</TableCell>
                  <TableCell>{item?.transactionId || "—"}</TableCell>
                  <TableCell>{formatStatus(item?.status) || "—"}</TableCell>
                <TableCell>
                  <span className="text-green-600 font-medium">Paid</span>
                </TableCell>
                <TableCell>
                  <button className="text-blue-600 text-sm font-medium" onClick={()=> downloadExcel(item)}>Download</button>
                </TableCell>
              </TableRow>

              {expandedRows[index] && (
                <TableRow>
                  <TableCell colSpan={15} className="bg-gray-50 px-4 py-3">
                    <div className="border rounded-lg p-4 bg-white shadow-sm">
                      <h4 className="font-semibold text-sm mb-3 text-gray-800">Order Details</h4>
                      <Table className="text-sm text-left">
                        <TableHeader>
                          <TableRow className="bg-gray-100 text-gray-700">
                            <TableHead>S. No</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>AWB Number</TableHead>
                            <TableHead>Consignee Name</TableHead>
                            <TableHead>Courier</TableHead>
                            <TableHead>Order Type</TableHead>
                            <TableHead>COD</TableHead>
                            <TableHead>Pincode</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item?.remittanceRequestIds?.map((order, i) => (
                            <TableRow key={i}>
                              <TableCell>{i + 1}</TableCell>
                              <TableCell>{order.orderNumber}</TableCell>
                              <TableCell>{order.awbNumber}</TableCell>
                              <TableCell>{order.consignee}</TableCell>
                              <TableCell>{replaceFirstAndRemoveRemaining(order.courier)}</TableCell>
                              <TableCell>{order.orderType}</TableCell>
                              <TableCell>{order.codAmount || 100}</TableCell>
                              <TableCell>{order.pincode}</TableCell>
                              <TableCell>{new Date(
                                      order.requestDate
                                    ).toLocaleDateString()}</TableCell>
                              <TableCell>{formatStatus(order.status)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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

export default UserRemittance;

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Eye,
  Loader2,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/utils/axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { se } from "date-fns/locale";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/custom/Pagination";
import { Label } from "recharts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Utility to get badge color based on status
const getStatusColor = (status) => {
  switch (status) {
    case "success":
      return "bg-green-400 text-white hover:bg-green-500";
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Group transactions by month/year using the updatedAt field
const groupTransactionsByMonth = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const monthYear = format(new Date(transaction.updatedAt), "MMMM yyyy");
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(transaction);
    return acc;
  }, {});
};

// Generate monthly invoice objects from the grouped transactions
const generateMonthlyInvoices = (groupedTransactions) => {
  return Object.entries(groupedTransactions).map(
    ([monthYear, transactions]) => {
      // Sum total amount for the month
      let totalAmount = transactions.filter(item =>  !item.type.includes("shipping")).reduce((sum, tx) => sum + tx.debitAmount - tx.creditAmount, 0);
      totalAmount += totalAmount*0.18;
      
      // Split month and year from the key (ex: "March 2023")
      const [month, year] = monthYear.split(" ");
      return {
        id: `INV-${month.substring(0, 3).toUpperCase()}-${year}`, // e.g. INV-MAR-2023
        month,
        year: parseInt(year, 10),
        amount: totalAmount,
        transactions, // include transactions for detailed invoice view
        // Dummy status logic – adjust as needed
        status: totalAmount > 0 ? "Paid" : "Pending",
      };
    }
  );
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyInvoices, setMonthlyInvoices] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedYear, setSelectedYear] = useState("all");
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [shippingPage, setShippingPage] = useState(1);
  const [shippingPageSize, setShippingPageSize] = useState(50);
  const [weightReconciliationData, setWeightReconciliationData] = useState();
  const [selectedWeightReconciliation, setSelectedWeightReconciliation] =
    useState();
  const [formData, setFormData] = useState({
    remark: "",
    image: null,
  });

  function onClose() {
    setSelectedWeightReconciliation(null);
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });

      fd.append("weightReconciliationId", selectedWeightReconciliation._id);

      // Example: send to backend
      const res = await axiosInstance.post(
        "/weightReconciliation/raised-action",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Successfully Raised Complaint ! ");
      toast({
        title: "Success",
        description: "DIspute Raised   successfully",
      });
     await fetchExtraWeightData()
      setSelectedWeightReconciliation(null)
    } catch (error) {
      console.log("Failed to Raise Dispute ! ", error.message);
      toast({ title: `Failed to Raise Dispute`,description: error.message, variant: "destructive" });

    }
  };
  function onClose() {
    setSelectedWeightReconciliation(null);
  }

  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });

  const fetchExtraWeightData = async () => {
    try {
      const response = await axiosInstance.get(
        "/weightReconciliation/get-weight-reconciliation"
      );
      console.log("data Fetched Successfully ", response.data);
      setWeightReconciliationData(response.data.data);
    } catch (error) {
      console.log("Failed to Fetch ExtraWeightReconciliation Data!");
    }
  };
  // Filter transactions based on search query and date range
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearchQuery = searchQuery
      ? transaction.transactionId
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) 
        || transaction.awbNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesDateRange =
      new Date(transaction.updatedAt) >= new Date(dateRange.from) &&
      new Date(transaction.updatedAt) <= new Date(dateRange.to);

    return matchesSearchQuery && matchesDateRange;
  });

  const walletTransactions = filteredTransactions.filter((trans) =>
    trans.type.includes("wallet")
  );

  const paginatedTransactions = walletTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const shippingTransactions = filteredTransactions.filter((trans) =>
    trans.type.includes("shipping")
  );

  const paginatedShipping = shippingTransactions.slice(
    (shippingPage - 1) * shippingPageSize,
    shippingPage * shippingPageSize
  );
  // Filter invoices based on search query and selected year
  const filteredInvoices = monthlyInvoices.filter(
    (invoice) =>
      (invoice.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedYear === "all" || invoice.year.toString() === selectedYear)
  );

  // Get status icon for invoice badge
  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <CheckCircle2 className="h-4 w-4 mr-2 text-green-800" />;
      case "Pending":
        return <Clock className="h-4 w-4 mr-2 text-yellow-800" />;
      case "Overdue":
        return <XCircle className="h-4 w-4 mr-2 text-red-800" />;
      default:
        return <CheckCircle2 className="h-4 w-4 mr-2 text-gray-800" />;
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

  const handleDownloadInvoice = (invoice) => {
    const doc = new jsPDF();

    const leftMargin = 15;
    const topMargin = 15;
    let currentY = topMargin;

    const logoUrl = "/shipDuniyaIcon.jpg"; // Assuming logo is in public folder
    const img = new Image();
    img.src = logoUrl;

    img.onload = function () {
      doc.addImage(img, "JPEG", leftMargin, currentY, 30, 30);
      continueWithPdfGeneration();
    };

    img.onerror = function () {
      console.error("Error loading logo image");
      doc.rect(leftMargin, currentY, 30, 30);
      continueWithPdfGeneration();
    };

    function continueWithPdfGeneration() {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("TAX INVOICE", doc.internal.pageSize.width / 2, currentY + 10, {
        align: "center",
      });

      doc.setFontSize(20);
      doc.text("SHIP DUNIYA", doc.internal.pageSize.width / 2, currentY + 20, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Original Copy",
        doc.internal.pageSize.width - 20,
        currentY + 10,
        { align: "right" }
      );

      doc.setFont("helvetica", "normal");
      doc.text(
        "C-45, GROUND FLOOR, SECTORE 10, NOIDA",
        doc.internal.pageSize.width / 2,
        currentY + 30,
        { align: "center" }
      );
      doc.text(
        `GSTIN : ${invoice.sellerGstin || "09AFLFS8825D1ZK"}`,
        doc.internal.pageSize.width / 2,
        currentY + 35,
        { align: "center" }
      );
      doc.text(
        `Tel. : ${invoice.sellerPhone || "9290551411, 9990531411"}   email : ${
          invoice.sellerEmail || "shipduniya@gmail.com"
        }`,
        doc.internal.pageSize.width / 2,
        currentY + 40,
        { align: "center" }
      );

      currentY += 45;

      doc.rect(doc.internal.pageSize.width - 80, currentY, 80, 20);
      doc.text(
        "Place of Supply   :   Uttar Pradesh (09)",
        doc.internal.pageSize.width - 75,
        currentY + 8
      );
      doc.text(
        "Reverse Charge    :   N",
        doc.internal.pageSize.width - 75,
        currentY + 15
      );

      currentY += 25;

      const billingStartX = leftMargin;
      const shippingStartX = doc.internal.pageSize.width / 2;

      doc.rect(
        billingStartX,
        currentY,
        doc.internal.pageSize.width / 2 - leftMargin,
        40
      );
      doc.rect(
        shippingStartX,
        currentY,
        doc.internal.pageSize.width / 2 - leftMargin,
        40
      );

      doc.setFont("helvetica", "bold");
      doc.text("Billed to : (SELLER DETAILS)", billingStartX + 5, currentY + 8);
      doc.text(
        "Shipped to: (SELLER DETAILS)",
        shippingStartX + 5,
        currentY + 8
      );

      const address = [
        invoice.buyerName || "FOREVER ENGINEERING SYSTEM PVT LTD",
        invoice.buyerAddress1 || "B 817, 8TH FLOOR",
        invoice.buyerAddress2 || "ADVANT NAVIS BUSINESS PARK, SECTOR 142",
        invoice.buyerCity || "NOIDA, Uttar Pradesh, 201301",
      ];

      doc.setFont("helvetica", "normal");
      doc.text(address, billingStartX + 5, currentY + 15);
      doc.text(address, shippingStartX + 5, currentY + 15);

      currentY += 45;

      doc.text(
        `GSTIN / UIN       :   ${invoice.buyerGstin || "09AACCF6683P1ZT"}`,
        billingStartX + 5,
        currentY
      );
      doc.text(
        `GSTIN / UIN       :   ${invoice.buyerGstin || "09AACCF6683P1ZT"}`,
        shippingStartX + 5,
        currentY
      );

      currentY += 10;

      const tableColumns = [
        { header: "S.No.", dataKey: "sno" },
        { header: "Description of Goods", dataKey: "description" },
        { header: "HSN/SAC Code", dataKey: "hsn" },
        { header: "Qty.", dataKey: "qty" },
        { header: "Unit", dataKey: "unit" },
        { header: "List Price", dataKey: "price" },
        { header: "Discount", dataKey: "discount" },
        { header: "Amount(₹)", dataKey: "amount" },
      ];

      let tableRows = [];
      if (invoice.transactions && invoice.transactions.length > 0) {
        let totalAmount = 0;
        let totalQty = 0;

        invoice.transactions.forEach((tx) => {
          totalAmount += parseFloat(tx.amount);
          totalQty += tx.quantity ? parseFloat(tx.quantity) : 0;
        });

        tableRows = [
          {
            sno: 1,
            description: "All Transactions",
            hsn: invoice.transactions[0].hsn || "996812",
            qty: totalQty,
            unit: invoice.transactions[0].unit || "--",
            price: "Varies",
            discount: "--",
            amount: totalAmount.toFixed(2),
          },
        ];
      } else {
        tableRows = [
          {
            sno: 1,
            description: "SHIPPING CHARGE",
            hsn: "996812",
            qty: "--",
            unit: "--",
            price: "0.00 %",
            discount: "--",
            amount: "1000.00",
          },
        ];
      }

      const subtotal = tableRows.reduce(
        (sum, row) => sum + parseFloat(row.amount),
        0
      );
      const taxRate = invoice.taxRate || 9;
      const cgst = (subtotal * taxRate) / 100;
      const sgst = (subtotal * taxRate) / 100;
      const igst = 0;
      const roundOff = invoice.roundOff || 0.0;
      const grandTotal = subtotal + cgst + sgst + roundOff;

      doc.autoTable({
        head: [tableColumns.map((col) => col.header)],
        body: tableRows.map((row) =>
          tableColumns.map((col) => row[col.dataKey])
        ),
        startY: currentY,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 60 },
        },
      });

      currentY = doc.previousAutoTable.finalY + 10;
      const taxStartX = doc.internal.pageSize.width - 120;

      doc.text("Add : CGST", taxStartX, currentY);
      doc.text("₹", taxStartX + 70, currentY, { align: "right" });
      doc.text(`${taxRate.toFixed(1)} %`, taxStartX + 80, currentY, {
        align: "right",
      });
      doc.text(`${cgst.toFixed(2)}`, taxStartX + 100, currentY, {
        align: "right",
      });

      currentY += 5;
      doc.text("Add : SGST", taxStartX, currentY);
      doc.text("₹", taxStartX + 70, currentY, { align: "right" });
      doc.text(`${taxRate.toFixed(1)} %`, taxStartX + 80, currentY, {
        align: "right",
      });
      doc.text(`${sgst.toFixed(2)}`, taxStartX + 100, currentY, {
        align: "right",
      });

      currentY += 5;
      doc.text("Add : IGST", taxStartX, currentY);
      doc.text("₹", taxStartX + 70, currentY, { align: "right" });
      doc.text(`${2 * taxRate.toFixed(1)} %`, taxStartX + 80, currentY, {
        align: "right",
      });
      doc.text(`${igst?.toFixed(2)}`, taxStartX + 100, currentY, {
        align: "right",
      });

      currentY += 5;
      doc.text("Add : Rounded Off (+)", taxStartX, currentY);
      doc.text(`${roundOff.toFixed(2)}`, taxStartX + 100, currentY, {
        align: "right",
      });

      currentY += 8;
      doc.line(
        taxStartX - 5,
        currentY - 3,
        doc.internal.pageSize.width - leftMargin,
        currentY - 3
      );

      doc.setFont("helvetica", "bold");
      doc.text("Grand Total", taxStartX, currentY);
      doc.text(`${grandTotal.toFixed(2)}`, taxStartX + 100, currentY, {
        align: "right",
      });

      currentY += 15;

      doc.autoTable({
        head: [
          [
            "Tax Rate",
            "Taxable Amt.",
            "CGST Amt.",
            "SGST Amt.",
            "IGST Amt.",
            "Total Tax",
          ],
        ],
        body: [
          [
            `${(taxRate * 2).toFixed(0)}%`,
            subtotal.toFixed(2),
            cgst.toFixed(2),
            sgst.toFixed(2),
            igst.toFixed(2),
            (cgst + sgst).toFixed(2),
          ],
        ],
        startY: currentY,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
      });

      // Save PDF
      doc.save(`invoice-${invoice.invoiceNumber || "download"}.pdf`);
    }
  };

  // Helper function to convert number to words
  function numberToWords(num) {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    function convert(num) {
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] + (num % 10 ? " " + units[num % 10] : "")
        );
      if (num < 1000)
        return (
          units[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 ? " " + convert(num % 100) : "")
        );
      if (num < 100000)
        return (
          convert(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 ? " " + convert(num % 1000) : "")
        );
      return (
        convert(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 ? " " + convert(num % 100000) : "")
      );
    }

    return convert(num);
  }

  // Update invoice details when a new invoice is selected
  useEffect(() => {
    if (selectedInvoice) {
      const invoiceDetail = monthlyInvoices.find(
        (inv) => inv.id === selectedInvoice
      );
      if (invoiceDetail) {
        setInvoiceDetails({
          ...invoiceDetail,
          dueDate: "2023-05-31", // example due date, adjust as needed
          items: [
            {
              description: "Total Transactions Amount",
              amount: invoiceDetail.amount,
            },
          ],
        });
      }
    } else {
      setInvoiceDetails(null);
    }
  }, [selectedInvoice, monthlyInvoices]);

  // Fetch transactions from API and generate monthly invoices
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/transactions");
        if (response.status === 200) {
          const txData = response.data.transactions;
          console.log(response.data);
          setTransactions(txData);
          const grouped = groupTransactionsByMonth(txData);
          const invoices = generateMonthlyInvoices(grouped);
          setMonthlyInvoices(invoices);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExtraWeightData();
    fetchTransactions();
  }, []);

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleViewExtraWeightReconciliationDetails = async (transaction) => {
    setSelectedWeightReconciliation(transaction);
  };

  const handleDownloadExcel = async (invoice) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Transactions");
      const headings = [
        "Transaction ID",
        "Type",
        "Amount",
        "Date",
        "Current Balance",
        "Order ID",
        "AWB Number",
        "Status",
      ];
      worksheet.addRow(headings);
      filteredTransactions.forEach((transaction) => {
        worksheet.addRow([
          transaction.transactionId,
          transaction.type.length === 1 && transaction.type[0] === "wallet"
            ? "wallet"
            : transaction.type.filter((type) => type !== "wallet").join(" "),
          `${transaction.currency || "$"} ${transaction.amount.toFixed(2)}`,
          new Date(transaction.updatedAt).toLocaleDateString(),
          transaction.balance,
          transaction.orderId || "N/A",
          transaction.awbNumber || "N/A",
          transaction.status,
        ]);
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "transactions.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export Excel");
    }
  };

  const handleDownloadPDF = (invoice) => {
    try {
      const doc = new jsPDF();
      const tableColumn = [
        "Transaction ID",
        "Type",
        "Amount",
        "Date",
        "Current Balance",
        "Order ID",
        "AWB Number",
        "Status",
      ];
      const tableRows = filteredTransactions.map((transaction) => [
        transaction.transactionId,
        transaction.type.length === 1 && transaction.type[0] === "wallet"
          ? "wallet"
          : transaction.type.filter((type) => type !== "wallet").join(" "),
        `${transaction.currency || "$"} ${transaction.amount.toFixed(2)}`,
        new Date(transaction.updatedAt).toLocaleDateString(),
        transaction.balance,
        transaction.orderId || "N/A",
        transaction.awbNumber || "N/A",
        transaction.status,
      ]);
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30 },
          6: { cellWidth: 25 },
          7: { cellWidth: 20 },
        },
      });
      doc.save("transactions.pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const downloadExcelInvoice = async (invoice) => {
    console.log(invoice);
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Transactions");
  
      // Define headings
      const headings = [
        "Transaction ID",
        "Date",
        "Type",
        "Company",
        "Carrier",
        "AWB Number",
        "ShipmentId",
        "Order ID",
        "Consignee",
        "Payment Type",
        "Pincode",
        "Origin Address",
        "Destination Pincode",
        "Destination City",
        "Destination State",
        "Destination Address",
        "Status",
        "Remark",
        "Charged Weight",
        "Credit",
        "Debit",
        "IGST",
        "SGST",
        "CGST",
        "Total",
      ];
  
      // Add header row with styling
      const headerRow = worksheet.addRow(headings);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF2F5597" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
  
      // Loop through transactions and calculate taxes
      invoice?.transactions.filter(item =>  !item.type.includes("shipping")).forEach((transaction) => {
        let credit = transaction.creditAmount || 0;
        let debit = transaction.debitAmount || 0;
  
        let igst = 0,
          sgst = 0,
          cgst = 0;
  
        if (
          transaction?.details?.order?.city?.toLowerCase() === "delhi" ||
          transaction?.details?.order?.state?.toLowerCase() === "delhi" ||
          transaction.destinationCity?.toLowerCase() === "delhi"
        ) {
          // Apply IGST 18%
          igst = ((credit + debit) * 18) / 100;
        } else {
          // Apply SGST 9% + CGST 9%
          sgst = ((credit + debit) * 9) / 100;
          cgst = ((credit + debit) * 9) / 100;
        }
  
        let total = credit + debit + igst + sgst + cgst;
  
        worksheet.addRow([
          transaction.transactionId,
          new Date(transaction.updatedAt).toLocaleDateString(),
          transaction.type.length === 1 && transaction.type[0] === "wallet"
            ? "wallet"
            : transaction.type.filter((type) => type !== "wallet").join(" "),
          "Ship Duniya",
          `${replaceFirstAndRemoveRemaining(transaction.courier)}`,
          transaction.awbNumber || "N/A",
          transaction.shipmentId || "N/A",
          transaction?.details?.order?.orderId || "N/A",
          transaction?.details?.order?.consignee || "N/A",
          transaction?.details?.order?.orderType,
          transaction?.details?.shipping?.pickupAddress?.pincode,
          transaction?.details?.shipping?.pickupAddress?.addressLine1,
          transaction?.details?.order?.pincode,
          transaction?.details?.order?.city,
          transaction?.details?.order?.state,
          transaction?.details?.order?.consigneeAddress1,
          transaction?.details?.shipping?.status,
          transaction.description,
          transaction.chargedWeight,
          credit,
          debit,
          igst.toFixed(2),
          sgst.toFixed(2),
          cgst.toFixed(2),
          total.toFixed(2),
        ]);
      });
  
      // Auto fit column widths
      worksheet.columns.forEach((col) => {
        let maxLength = 0;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        col.width = maxLength < 15 ? 15 : maxLength + 2; // ensure enough space
      });
  
      // Save Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "transactions.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export Excel");
    }
  };
  

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex justify-between items-center my-4 ">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input max-w-sm border-2 border-gray-400 rounded-lg px-3 py-1"
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
        <Tabs defaultValue="wallet" className="mx-auto my-3">
          <TabsList className="p-4 gap-6 flex justify-center mx-auto max-w-max bg-white">
            <TabsTrigger
              value="wallet"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
            >
              Wallet Transactions
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
            >
              Shipping Transactions
            </TabsTrigger>
            <TabsTrigger
              value="weight"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
            >
              Weight Reconciliation
            </TabsTrigger>
            <TabsTrigger
              value="invoice"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
            >
              Monthly Invoice
            </TabsTrigger>
          </TabsList>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
            </div>
          ) : (
            <>
              {/* Wallet Transactions Tab */}
              <TabsContent value="wallet">
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Courier Partner</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>Ref No#</TableHead>
                      <TableHead>Credit(₹)</TableHead>
                      <TableHead>Debit(₹)</TableHead>
                      <TableHead>Closing Balance</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell className="hidden min-w-fit  md:table-cell">
                          <span className="col-span-3 min-w-fit">
                            {new Date(transaction.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium  justify-center">
                          {replaceFirstAndRemoveRemaining(transaction?.courier)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.transactionId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {(() => {
                            const types = transaction.type;
                            const hasWallet = types.includes("wallet");
                            const hasRecharge = types.includes("recharge");
                            const hasPayment = types.includes("payment");

                            if (hasWallet && hasRecharge) {
                              return "shipping";
                            } else if (hasWallet && hasPayment) {
                              return "recharge";
                            } else if (types.length === 1 && hasWallet) {
                              return "shipping";
                            } else {
                              const filtered = types
                                .filter((type) => type !== "wallet")
                                .join(" ");
                              return filtered.trim() === "refund"
                                ? "shipping"
                                : filtered;
                            }
                          })()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {transaction?.awbNumber || "NA"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {transaction.creditAmount}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {transaction.debitAmount}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {(transaction.balance || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell w-[20px]">
                          {transaction.description}
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(transaction)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">View</span>
                                <span className="sm:hidden">Details</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>
                                  Full details of the transaction
                                </DialogDescription>
                              </DialogHeader>
                              {selectedTransaction && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">AWB:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.awbNumber}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Amount:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.currency || "$"}{" "}
                                      {selectedTransaction.amount.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Status:</span>
                                    <span className="col-span-3">
                                      <Badge
                                        className={`${getStatusColor(
                                          selectedTransaction.status
                                        )} font-medium`}
                                      >
                                        {selectedTransaction.status}
                                      </Badge>
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">
                                      Requested:
                                    </span>
                                    <span className="col-span-3 min-w-fit">
                                      {new Date(
                                        transaction.createdAt
                                      ).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  {selectedTransaction.confirmed_at && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="font-bold">
                                        Confirmed:
                                      </span>
                                      <span className="col-span-3">
                                        {new Date(
                                          selectedTransaction.confirmed_at
                                        ).toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">
                                      Payment ID:
                                    </span>
                                    <span className="col-span-3">
                                      {selectedTransaction.transactionId}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>{" "}
                <div className="mt-4">
                  <div className="flex justify-between items-center px-4 py-2">
                    {/* Left: Page Size Selector */}
                    <div className="w-[100px] mt-5">
                      <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                          const newSize = Number(value);
                          const maxSize = walletTransactions.length;

                          setPageSize(newSize > maxSize ? maxSize : newSize);
                          setCurrentPage(1); // Reset to page 1 on change
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Page Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {[50, 100, 200, 500, 1000].map((size) => (
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
                        totalItems={walletTransactions.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping">
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Courier</TableHead>
                      <TableHead>AWB Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Freight Charges</TableHead>
                      <TableHead>COD Charges</TableHead>
                      <TableHead>Entered Weight</TableHead>
                      <TableHead className="min-w-[150px]">Entered Dimension</TableHead>
                      <TableHead>Applied Wt (gram)</TableHead>
                      <TableHead>Extra Wt Charges(₹)</TableHead>
                      <TableHead>RTO Charges</TableHead>
                      <TableHead>Freight Reverse</TableHead>
                      <TableHead>COD Charge Reverse</TableHead>
                      <TableHead>RTO Extra Wt Charges</TableHead>
                      <TableHead>Total Charges</TableHead>
                      <TableHead className="text-center">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedShipping.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell>
                          {format(
                            new Date(transaction.createdAt),
                            "dd MMM yyyy"
                          )}
                        </TableCell>
                        <TableCell>{replaceFirstAndRemoveRemaining(transaction.courier) || "N/A"}</TableCell>
                        <TableCell>{transaction.awbNumber || "N/A"}</TableCell>
                        <TableCell>{transaction.status || "N/A"}</TableCell>
                        <TableCell>
                          {transaction.freightCharges || "0.00"}
                        </TableCell>
                        <TableCell>
                          {transaction.codCharges || "0.00"}
                        </TableCell>
                        <TableCell>
                          {transaction.enteredWeight || "0.00"}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col text-fit">
                              <p>
                                <strong>Dead Weight:</strong>{" "}
                                {transaction.enteredDimension?.deadWeight || "0"}
                              </p>
                              <p>
                                <strong>LxBxH:</strong>{" "}
                                {transaction.enteredDimension?.length}x
                                {transaction.enteredDimension?.breadth}x
                                {transaction.enteredDimension?.height}
                              </p>

                              <p>
                                <strong>Volumetric Weight:</strong>{" "}
                                {transaction.enteredDimension?.volumetricWeight}
                              </p>
                            </div>
                          </TableCell>
                        <TableCell>
                          {transaction.appliedWeight || "0.00"}
                        </TableCell>
                        <TableCell>
                          {transaction.extraWeightCharges || "0.00"}
                        </TableCell>
                        <TableCell>
                          {transaction.rtoCharges || "0.00"}
                        </TableCell>
                        <TableCell>
                          {transaction.freightReverse || "0.00"}
                        </TableCell>
                        <TableCell>
                          {transaction.codChargeReverse || "0.00"}
                        </TableCell>
                        <TableCell>
                          {transaction.rtoExtraWeightCharges || "0.00"}
                        </TableCell>
                        <TableCell>
                          {transaction.totalAmount || "0.00"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(transaction)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">View</span>
                                <span className="sm:hidden">Details</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:min-w-[425px] max-w-fit">
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>
                                  Full details of the transaction
                                </DialogDescription>
                              </DialogHeader>
                              {selectedTransaction && (
                                <>
                                  {" "}
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="font-bold">AWB:</span>
                                      <span className="col-span-3">
                                        {selectedTransaction.awbNumber}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="font-bold">Amount:</span>
                                      <span className="col-span-3">
                                        {selectedTransaction.currency || "$"}{" "}
                                        {selectedTransaction.amount.toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="font-bold">Status:</span>
                                      <span className="col-span-3">
                                        <Badge
                                          className={`${getStatusColor(
                                            selectedTransaction.status
                                          )} font-medium`}
                                        >
                                          {selectedTransaction.status}
                                        </Badge>
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="font-bold">
                                        Requested:
                                      </span>
                                      <span className="col-span-3 min-w-fit">
                                        {new Date(
                                          transaction.createdAt
                                        ).toLocaleDateString("en-IN", {
                                          day: "2-digit",
                                          month: "long",
                                          year: "numeric",
                                        })}
                                      </span>
                                    </div>
                                    {selectedTransaction.confirmed_at && (
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <span className="font-bold">
                                          Confirmed:
                                        </span>
                                        <span className="col-span-3">
                                          {new Date(
                                            selectedTransaction.confirmed_at
                                          ).toLocaleString("en-IN")}
                                        </span>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="font-bold">
                                        Payment ID:
                                      </span>
                                      <span className="col-span-3">
                                        {selectedTransaction.transactionId}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-8">
                                    <h3 className="text-xl font-bold mb-4">
                                      All Transactions for AWB:{" "}
                                      {selectedTransaction.awbNumber}
                                    </h3>

                                    <div className="rounded-md border overflow-x-auto">
                                      <table className="w-full text-sm text-left">
                                        <thead className="w-fit border-b">
                                          <tr>
                                            <th className="px-4 py-2 font-bold w-fit text-fit ">
                                              Date
                                            </th>
                                            <th className="px-4 py-2 font-bold w-fit text-fit">
                                              Credit (₹)
                                            </th>
                                            <th className="px-4 py-2 font-bold w-fit text-fit">
                                              Debit (₹)
                                            </th>
                                            <th className="px-4 py-2 font-bold w-fit text-fit">
                                              Closing Balance (₹)
                                            </th>
                                            <th className="px-4 py-2 font-bold w-fit text-fit">
                                              Description
                                            </th>
                                            <th className="px-4 py-2 font-bold w-fit text-fit">
                                              Transaction ID
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {walletTransactions
                                            .filter(
                                              (txn) =>
                                                txn.awbNumber ===
                                                selectedTransaction.awbNumber
                                            )
                                            .map((txn, index) => (
                                              <tr
                                                key={index}
                                                className="border-b hover:bg-muted/50"
                                              >
                                                <td className="px-4 py-2">
                                                  <span className="col-span-3 min-w-fit">
                                                    {new Date(
                                                      transaction.createdAt
                                                    ).toLocaleDateString(
                                                      "en-IN",
                                                      {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                      }
                                                    )}
                                                  </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                  {txn.creditAmount}
                                                </td>
                                                <td className="px-4 py-2">
                                                  {txn.debitAmount
                                                    ? txn.debitAmount.toFixed(2)
                                                    : "-"}
                                                </td>
                                                <td className="px-4 py-2">
                                                  {txn.balance}
                                                </td>
                                                <td className="px-4 py-2">
                                                  {txn.description}
                                                </td>
                                                <td className="px-4 py-2">
                                                  {txn.transactionId}
                                                </td>
                                              </tr>
                                            ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>{" "}
                <div className="mt-4">
                  <div className="flex justify-between items-center px-4 py-2">
                    {/* Left: Page Size Selector */}
                    <div className="w-[100px] mt-5">
                      <Select
                        value={shippingPageSize.toString()}
                        onValueChange={(value) => {
                          const newSize = Number(value);
                          const maxSize = shippingTransactions.length;
                          setShippingPageSize(
                            newSize > maxSize ? maxSize : newSize
                          );
                          setShippingPage(1);
                        }}
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="Page Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {[50, 100, 200, 500, 1000].map((size) => (
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
                        currentPage={shippingPage}
                        totalItems={shippingTransactions.length}
                        pageSize={shippingPageSize}
                        onPageChange={setShippingPage}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="weight">
                <div className=" px-4 rounded-md flex justify-center my-4">
                  <p className="text-sm mx-auto text-center font-semibold text-slate-500 underline underline-offset-2 ">
                    Extra Weight Reconciliation will Automattically Update to
                    Approve after 2 days
                  </p>
                </div>
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>AWB Number</TableHead>
                      <TableHead>Order Id</TableHead>
                      <TableHead>Entered Weight</TableHead>
                      <TableHead>Applied Weight</TableHead>
                      <TableHead>Weight Charges</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {weightReconciliationData
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell>
                            {format(
                              new Date(transaction.createdAt),
                              "dd MMM yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            {transaction.awbNumber || "N/A"}
                          </TableCell>
                          <TableCell>{transaction.orderId || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <p>
                                <strong>Dead Weight:</strong>{" "}
                                {transaction.enteredWeight.deadWeight || "0"}
                              </p>
                              <p>
                                <strong>LxBxH:</strong>{" "}
                                {transaction.enteredWeight.length}x
                                {transaction.enteredWeight.breadth}x
                                {transaction.enteredWeight.height}
                              </p>

                              <p>
                                <strong>Volumetric Weight:</strong>{" "}
                                {transaction.enteredWeight.volumetricWeight}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <strong>Applied Slab:</strong>{" "}
                            {transaction.appliedWeight}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <p>
                                <strong>Forward:</strong>{" "}
                                {transaction.partnerDetails?.charges || "0"}
                              </p>
                              <p>
                                <strong>Charged to wallet:</strong>{" "}
                                {transaction.ExtraWeightCharges || "0"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-24">
                            {transaction.product}
                          </TableCell>
                          <TableCell className="text-center">
                            {transaction.status === "requested" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewExtraWeightReconciliationDetails(
                                    transaction
                                  )
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Raise</span>
                                <span className="sm:hidden">Details</span>
                              </Button>
                            ) : transaction.status === "accepted" ? (
                              <Button variant="outline" size="sm">
                                <span className="hidden sm:inline text-green-400">
                                  Accepted
                                </span>
                                <span className="sm:hidden">Details</span>
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                <span className="hidden sm:inline text-rose-700">
                                  Raised
                                </span>
                                <span className="sm:hidden">Details</span>
                              </Button>
                            )}
                            
                            {selectedWeightReconciliation && (
                              <Dialog open={open} onOpenChange={onClose}>
                                <DialogContent className="sm:max-w-sm rounded-lg p-6 shadow-lg">
                                  <DialogHeader>
                                    <DialogTitle className="text-lg font-semibold text-gray-800">
                                      Raise Confirm
                                    </DialogTitle>
                                  </DialogHeader>

                                  <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                  >
                                    {/* Remark Field */}
                                    <div>
                                      <Label
                                        htmlFor="remark"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                      >
                                        Remark
                                      </Label>
                                      <Textarea
                                        id="remark"
                                        name="remark"
                                        placeholder="Enter your remark..."
                                        value={formData.remark}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full text-sm rounded-md border border-gray-300 focus:border-primary focus:ring-primary resize-none"
                                      />
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                      <Label
                                        htmlFor="image"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                      >
                                        Image
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          id="file"
                                          type="file"
                                          name="file"
                                          accept="image/*"
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                      type="submit"
                                      className="w-full bg-primary hover:bg-primary/90 hover:text-slate-800 text-white text-sm font-medium py-2 rounded-md shadow-sm"
                                    >
                                      Raise Confirm
                                    </Button>
                                  </form>
                                </DialogContent>
                              </Dialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Monthly Invoices Tab */}
              <TabsContent value="invoice">
                <div className="container mx-auto py-10">
                  <div className="flex flex-wrap gap-4 px-3">
                    {filteredInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="card cursor-pointer hover:shadow-md transition-shadow bg-gray-100 rounded-xl px-4 py-3"
                      >
                        <div className="card-body">
                          <h3 className="font-semibold mb-2">
                            The invoice for {invoice.month} {invoice.year} is
                            available
                          </h3>
                          <p className="text-xl font-bold mb-2">
                            ₹&nbsp;{invoice.amount.toFixed(2)}
                          </p>
                          <p className="text-xs font-semibold text-gray-500 mb-2">
                            Invoice ID: {invoice.id}
                          </p>
                          <div className="flex justify-between mt-4">
                            <div>
                              <Button
                                variant="export"
                                onClick={() => downloadExcelInvoice(invoice)}
                              >
                                Download Excel
                              </Button>
                            </div>
                            <div>
                              <Button
                                variant="export"
                                onClick={() => handleDownloadInvoice(invoice)}
                              >
                                Download PDF
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

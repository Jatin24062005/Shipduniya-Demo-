import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock4,
  Download,
  Eye,
  Loader2,
  Package,
  ReceiptText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import ExcelJS from "exceljs";

import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import "jspdf-autotable";
import axiosInstance from "@/utils/axios";
import "jspdf-autotable";
import { Alert } from "@/components/ui/alert";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import OrdersPage from "../orders/page";
import Filters from "./Filters";
import { useWallet } from "@/context/WalletContext";

const ShipmentTable = ({
  userData,
  shipments,
  loading,
  fetchShipments,
  setSelectedShipments,
  selectedShipments,
  setViewTracking,
  setViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });
  const [orderType, setOrderType] = useState("");
  const [partnerType, setPartnerType] = useState("");
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [warehouses, setWareHouses] = useState(null);
  const { fetchWalletBalance } = useWallet();

  const { toast } = useToast();

  const filteredShippings = shipments
    .filter((shipment) => {
      const matchesSearchQuery = searchQuery
        ? shipment.consignee
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          shipment.awbNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          shipment?.orderIds[0]?.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesDateRange =
        new Date(shipment.createdAt) >= new Date(dateRange.from) &&
        new Date(shipment.createdAt) <= new Date(dateRange.to);

      const matchesOrderType =
        orderType === "All" || orderType === ""
          ? true
          : shipment.orderIds[0]?.orderType?.toLowerCase() ===
            orderType.toLowerCase();

      const matchesPartnerType =
        partnerType === "" || partnerType === "All"
          ? true
          : shipment.partnerDetails?.name
              ?.toLowerCase()
              .includes(partnerType.toLowerCase());

      const matchesShipmentStatus =
        shipmentStatus === ""
          ? true
          : typeof shipmentStatus === "string" &&
            shipmentStatus.toLowerCase() === "rto"
          ? shipment.status?.toLowerCase().includes("rto")
          : Array.isArray(shipmentStatus)
          ? shipmentStatus.includes(shipment.status)
          : shipment.status === shipmentStatus;

      return (
        matchesSearchQuery &&
        matchesDateRange &&
        matchesOrderType &&
        matchesPartnerType &&
        matchesShipmentStatus
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // sort by date descending

  // Function to toggle selection of a single shipment
  const toggleSelectShipment = (shipment) => {
    setSelectedShipments((prev) =>
      prev.includes(shipment._id) // Assuming _id is the unique identifier
        ? prev.filter((o) => o !== shipment._id)
        : [...prev, shipment._id]
    );
  };

  // Function to toggle selection of all shipments
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedShipments([]); // Deselect all
    } else {
      setSelectedShipments(
        shipments
          .filter(
            (shipment) =>
              shipment.status?.toLowerCase() !== "cancelled" &&
              shipment.status?.toLowerCase() !== "canceled"
          )
          .map((shipment) => shipment._id)
      );
    }
    setSelectAll(!selectAll);
  };

  const viewDetails = (shipment, tracking = false) => {
    setSelectedShipments([shipment]);
    tracking ? setViewTracking(true) : setViewDetails(true);
  };
  const fetchWarehouses = async () => {
    try {
      const response = await axiosInstance.get("/warehouse");
      setWareHouses(response.data.warehouses);
    } catch (error) {
      console.error(error);
    }
  };

  function replaceCourierName(str) {
    if (!str) return "";

    return str
      .replace(/xpressbees/gi, "Shipduniya XB")
      .replace(/delhivery/gi, "Shipduniya DL");
  }

  useEffect(() => {
    const loadWarehouses = async () => {
      const response = await fetchWarehouses();
      // handle response
    };

    loadWarehouses();
  }, []);

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Shipments");

    const headings = [
      "Order ID",
      "AWB",
      "Courier Partner",
      "Shipment ID",
      "Order Date",
      "Method",
      "Collectable Amount",
      "Invoice Number",
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
      "Telephone (optional)",
      "Warehouse Name",
      "Warehouse Address",
      "Warehouse Pincode",
      "Warehouse City",
      "Warehouse State",
      "Warehouse Manager",
      "Warehouse Manager Phone",
      "Zone",
      "RTO Name",
      "RTO Address",
      "RTO Pincode",
      "RTO City",
      "RTO State",
      "RTO Contact",
      "Actual Weight (gm)",
      "Volumetric Weight (gm)",
      "Length",
      "Breadth",
      "Height",
      "Quantity",
      "Status",
    ];

    // Add header row
    const headerRow = worksheet.addRow(headings);

    // Style the header
    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true, color: { argb: "FF000000" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "d4edc4" }, // light green header
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Set column widths
    worksheet.columns = headings.map(() => ({
      width: 30, // adjust per content
    }));

    console.log(filteredShippings);
    // Fetch pickup and drop location details for each shipment

    filteredShippings.forEach((shipment) => {
      const warehouse = warehouses.find((w) => {
        console.log("Warehouse Id to Compare : ", w._id);
        console.log("warehouse Id Comparing with :", shipment.warehouseId);
        return String(w._id) === String(shipment?.warehouseId);
      });

      console.log("Warehouse Important: ", warehouse);
      const row = worksheet.addRow([
        shipment.orderIds[0].orderId,
        shipment.awbNumber,
        shipment.partnerDetails.name,
        shipment.shipmentId,
        new Date(shipment.orderIds[0].createdAt).toLocaleDateString(),
        shipment.orderIds[0].orderType,
        shipment.orderIds[0].collectableValue,
        shipment.orderIds[0].invoiceNumber || "",
        shipment.consignee,
        shipment.orderIds[0].consigneeAddress1,
        shipment.orderIds[0].consigneeAddress2,
        shipment.orderIds[0].city,
        shipment.orderIds[0].state,
        shipment.orderIds[0].pincode,
        shipment.orderIds[0].channelPartner,
        shipment.orderIds[0].insurance,
        shipment.orderIds[0].itemDescription,
        shipment.orderIds[0].mobile,
        shipment.orderIds[0].telephone || "",
        warehouse?.name,
        warehouse?.address,
        shipment.pickupAddress?.pincode,
        shipment.pickupAddress.city,
        shipment.pickupAddress.state,
        warehouse?.managerName,
        warehouse?.managerMobile,
        shipment.zone || "",
        shipment.returnAddress?.name,
        shipment.returnAddress?.addressLine1,
        shipment.returnAddress?.pincode,
        shipment.returnAddress.city,
        shipment.returnAddress.state,
        shipment.returnAddress?.mobile,
        shipment.orderIds[0].actualWeight || "",
        shipment.orderIds[0].volumetricWeight || "",
        shipment.orderIds[0].length || "",
        shipment.orderIds[0].breadth || "",
        shipment.orderIds[0].height || "",
        shipment.orderIds[0].quantity || "",
        shipment.status === "booked" || shipment.status === "pending"
          ? "Pending Pickup"
          : shipment.status,
      ]);

      row.eachCell((cell) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    worksheet.eachRow((row) => (row.height = 35)); // Optional: make rows taller for readability

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "shipments.xlsx");
  };

  // Function to download selected shipments as PDF

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    const { name = "", code = "", phone = [], address = "" } = userData;
    const selectedOrderCount = selectedShipments.length;
    const mobileText = Array.isArray(phone) ? phone.join(", ") : phone;

    // Title
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("PICKUP LIST", pageWidth / 2, 20, { align: "center" });

    // User details
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text(`USER NAME (CODE):- ${name} ${code}`, margin, 35);
    doc.text(`PHONE NO.:- ${mobileText}`, margin, 43);
    doc.text(`ADDRESS:- ${address}`, margin, 51);
    doc.text(`Parcels:- ${selectedOrderCount}`, margin, 59);

    // Table headers
    const tableColumn = [
      "Sno",
      "Awb number",
      "Consignee name",
      "City",
      "State",
      "Pincode",
      "Courier",
      "Sign",
    ];

    // Table rows
    const tableRows = selectedShipments.map((selectedId, index) => {
      const shipment = shipments.find((s) => s._id === selectedId);
      return shipment
        ? [
            index + 1,
            shipment.awbNumber,
            shipment.consignee,
            shipment.pickupAddress.city,
            shipment.pickupAddress.state,
            shipment.pickupAddress.pincode,
            shipment.partnerDetails.name,
            "",
          ]
        : [];
    });

    const colWidthTotal = 200;
    const scaleFactor = contentWidth / colWidthTotal;

    // Table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      margin: { left: margin, right: margin },
      styles: {
        font: "times",
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 20 * scaleFactor },
        1: { halign: "left", cellWidth: 30 * scaleFactor },
        2: { halign: "left", cellWidth: 45 * scaleFactor },
        3: { halign: "left", cellWidth: 40 * scaleFactor },
        4: { halign: "left", cellWidth: 40 * scaleFactor },
        5: { halign: "center", cellWidth: 25 * scaleFactor },
      },
    });

    // Footer
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const formattedTime = now.toLocaleTimeString();
    const yPosition = doc.lastAutoTable.finalY + 30;

    doc.setFontSize(10);
    doc.text(
      `Generated At: ${formattedDate}  ${formattedTime}`,
      pageWidth - margin - 60,
      yPosition
    );

    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("SIGNATURE / STAMP", pageWidth - margin - 30, yPosition + 40);

    // Correct save using Blob and FileSaver
    const pdfBlob = doc.output("blob");
    saveAs(pdfBlob, "shipment_pick_list.pdf");
  };

  const handleGenerateInvoice = async () => {
    const ts = [];
    selectedShipments.forEach((id) => {
      const shipment = shipments.find((s) => s._id === id);
      ts.push(shipment);
    });

    const doc = new jsPDF();

    selectedShipments.forEach((selectedId, index) => {
      const shipment = shipments.find((s) => s._id === selectedId);
      console.log(shipment);
      if (!shipment) return;
      if (index !== 0) doc.addPage();
      console.log(shipment);

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Title - centered, bold
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("TAX INVOICE", pageWidth / 2, 20, { align: "center" });

      // Order Information section
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Order Information", 20, 35);

      doc.setFont("helvetica", "normal");
      doc.text(`Shipment Reference : ${shipment.shipmentId}`, 20, 40);
      doc.text(`AWB Number : ${shipment.awbNumber}`, 20, 45);

      // Invoice section (right aligned)
      doc.setFont("helvetica", "bold");
      doc.text("Invoice", pageWidth - 10, 35, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.text(
        `Invoice Number : ${shipment.orderIds[0].invoiceNumber}`,
        pageWidth - 10,
        40,
        { align: "right" }
      );
      doc.text(
        `Invoice Date : ${new Date().toLocaleDateString() || "Mar 18, 2025"}`,
        pageWidth - 10,
        45,
        { align: "right" }
      );

      doc.line(15, 50, 200, 50);
      // Sold By and Billed To sections in the same row with proper spacing
      const leftColumnX = 20;
      const rightColumnX = pageWidth / 2 + 20; // Start the right column after halfway point plus some margin

      // Sold By section (left side)
      doc.setFont("helvetica", "bold");
      doc.text("Send By:", leftColumnX, 60);

      doc.setFont("helvetica", "normal");
      doc.text(userData.name, leftColumnX, 65);
      doc.text(`${userData.address}`, leftColumnX, 70);
      doc.text(`${userData.pincode}`, leftColumnX, 80);
      doc.text(
        `${shipment.pickupAddress.city}, ${shipment.pickupAddress.state}`,
        leftColumnX,
        75
      );

      // Billed To section (right side, aligned left)
      doc.setFont("helvetica", "bold");
      doc.text("Send To:", rightColumnX, 60);

      doc.setFont("helvetica", "normal");
      doc.text(`${shipment.orderIds[0].consignee}`, rightColumnX, 65);
      doc.text(`${shipment.orderIds[0].consigneeAddress1}`, rightColumnX, 70);
      doc.text(
        `${
          shipment.orderIds[0].city + shipment.orderIds[0].state ||
          "Kendrapara,"
        }`,
        rightColumnX,
        75
      );
      doc.text(`${shipment.orderIds[0].pincode || "754225"}`, rightColumnX, 80);

      // Product Table
      const productColumns = [
        "Product ID",
        "Invoice Number",
        "Quantity",
        "Total",
      ];
      const productData = [
        [
          shipment.orderIds[0].orderId,
          shipment.orderIds[0].invoiceNumber,
          shipment.orderIds[0].quantity,
          shipment.partnerDetails.charges,
        ],
      ];

      doc.autoTable({
        head: [productColumns],
        body: productData,
        startY: 95,
        theme: "grid",
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
        },
      });

      // Dimensions table
      const dimensionColumns = [
        "Weight (gram)",
        "Length (cm)",
        "Breadth (cm)",
        "Height (cm)",
      ];
      const dimensionData = [
        [
          shipment.orderIds[0].actualWeight,
          shipment.orderIds[0].length,
          shipment.orderIds[0].breadth,
          shipment.orderIds[0].height,
        ],
      ];

      const productTableHeight = doc.previousAutoTable.finalY;

      doc.autoTable({
        head: [dimensionColumns],
        body: dimensionData,
        startY: productTableHeight + 10,
        theme: "grid",
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
        },
      });

      // // Shipping charges table
      // const shippingColumns = [
      //   "HSN Code",
      //   "Base Amount",
      //   "CGST @9%",
      //   "SGST @9%",
      //   "UTGST @0%",
      //   "Net Payable",
      // ];
      // const shippingData = [
      //   [
      //     shipment.shippingHsnCode || "996812",
      //     shipment.baseAmount || "0",
      //     shipment.cgst || "0",
      //     shipment.sgst || "0",
      //     shipment.utgst || "0",
      //     shipment.netPayable || "0",
      //   ],
      // ];

      const dimensionTableHeight = doc.previousAutoTable.finalY;

      // doc.autoTable({
      //   head: [shippingColumns],
      //   body: shippingData,
      //   startY: dimensionTableHeight + 10,
      //   theme: "grid",
      //   headStyles: {
      //     fillColor: [200, 200, 200],
      //     textColor: [0, 0, 0],
      //     fontStyle: "bold",
      //   },
      //   styles: {
      //     fontSize: 8,
      //   },
      // });

      // Footer text
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "This is a computer generated invoice no signature is required.",
        pageWidth / 2,
        pageHeight - 20,
        { align: "center" }
      );
    });

    // Save the generated PDF
    doc.save("tax-invoice.pdf");
  };

  const loadImageAsync = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  const handleLabeling = async () => {
    const filteredShipments = shipments.filter((shipment) =>
      selectedShipments.includes(shipment._id)
    );

    console.log("filtered Label to Generate:", filteredShipments);
    try {
      const selectedAwbNumbers = filteredShipments.map((s) => s.awbNumber);

      const response = await axiosInstance.post("/label", {
        awbNumbers: selectedAwbNumbers,
      });
      const labels = response.data.labels;
      if (!labels || labels.length === 0) {
        alert("No label data available. Please refresh and try again.");
        return;
      }

      // Helper: generate barcode
      const generateBarcodeDataUrl = (text) => {
        const canvas = document.createElement("canvas");
        try {
          JsBarcode(canvas, text, {
            format: "CODE128",
            width: 2,
            height: 50,
            displayValue: false,
          });
        } catch (e) {
          console.error("Barcode error", e);
        }
        return canvas.toDataURL("image/png");
      };

      // Helper: load image as Promise

      
      const loadImage = (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      // Preload ShipDuniya icon
      let logoUrl = "/shipDuniyaIcon.jpg";

      if (userData?.avatar?.data?.data) {
        const byteArray = new Uint8Array(userData.avatar.data.data);
        const base64String = btoa(
          byteArray.reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        const contentType = userData.avatar.contentType || "image/jpeg";
        logoUrl = `data:${contentType};base64,${base64String}`;
      }


      let iconImg;
      let sdImage;
      try {
        iconImg = await loadImage(logoUrl);
        sdImage = await loadImage("/shipDuniyaIcon.jpg");
      } catch (err) {
        console.error("Logo load failed", err);
        // proceed without icon
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      filteredShipments.forEach((shipment, idx) => {
        if (idx > 0) doc.addPage();
        const city = shipment.orderIds[0]?.city || "";
        const state = shipment.orderIds[0]?.state || "";

        // Top-right icon
        if (iconImg) {
          doc.addImage(iconImg, "JPEG", 150, 16, 30, 30);
        }
        // === Recipient Address ===
        doc.setFont("helvetica", "bold").setFontSize(12);
        doc.text("To:", 15, 20);
        doc.text(`${shipment?.consignee.toUpperCase()}`, 15, 25);
        doc.setFont("helvetica", "normal").setFontSize(12);
        const lines = doc.splitTextToSize(
          (
            shipment?.orderIds[0]?.consigneeAddress1 +
            " " +
            shipment?.orderIds[0]?.consigneeAddress2
          ).toUpperCase(),
          70
        );
        let y = 30;
        lines.forEach((line) => {
          doc.text(line, 15, y);
          y += 5;
        });
        y += 1;
        doc.text("City & State: ", 15, y);
        doc.text(`${city}, ${state}`, 43, y);
        y += 5;
        doc.text(`India - ${shipment.orderIds[0]?.pincode || ""}`, 15, y);
        y += 5;
        doc.text("MOBILE NO: ", 15, y);
        doc.setFont("helvetica", "bold");
        doc.text(`${shipment.orderIds[0]?.mobile || ""}`, 45, y);
        doc.setFont("helvetica", "normal");
        doc.setLineWidth(1.3);
        y += 7;
        doc.line(15, y, 185, y);
        y += 10;
        // === COD / PREPAID & Weight ===
        doc.setFontSize(18);
        doc.text(shipment?.orderIds[0]?.orderType, 20, y);

        {
          shipment?.orderIds[0]?.orderType === "COD"
            ? doc.text(
                "Rs. " + shipment?.orderIds[0]?.collectableValue,
                20,
                y + 6
              )
            : "";
        }
        doc.text(
          `${
            Math.max(
              shipment?.orderIds[0]?.actualWeight,
              shipment?.orderIds[0]?.volumetricWeight
            ) / 1000
          }kg`,
          150,
          y
        );
        doc.text(
          `${shipment?.orderIds[0]?.length}X${shipment?.orderIds[0]?.breadth}X${shipment?.orderIds[0]?.height}`,
          148,
          y + 6
        );
        y += 10;
        doc.setLineWidth(0.6);
        doc.line(15, y, 185, y);
        y += 10;

        // === Order Details & Barcodes ===
        const oid = shipment.shipmentId;
        const awb = shipment.awbNumber;
        const oBar = generateBarcodeDataUrl(oid);
        const aBar = generateBarcodeDataUrl(awb);

        // Order id (bold key, normal value)
        doc.setFont("helvetica", "bold").setFontSize(12);
        doc.text("Order id:", 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${shipment?.orderIds[0]?.orderId}`, 33, y);

        // Order Date (bold key, normal value)
        doc.setFont("helvetica", "bold");
        doc.text("Order Date:", 15, y + 5);
        doc.setFont("helvetica", "normal");
        doc.text(
          `${new Date(shipment.createdAt).toLocaleDateString()}`,
          39,
          y + 5
        );

        // Invoice number (bold key, normal value)
        doc.setFont("helvetica", "bold");
        doc.text("Invoice number -", 15, y + 10);
        doc.setFont("helvetica", "normal");
        doc.text(`${shipment?.orderIds[0]?.invoiceNumber}`, 50, y + 10);

        doc.addImage(oBar, "PNG", 120, y - 6, 60, 15);
        doc
          .setFont("helvetica", "normal")
          .setFontSize(10)
          .text(shipment?.orderIds[0]?.orderId, 130, y + 12);
        y += 18;
        doc.setLineWidth(0.6);
        doc.line(15, y, 185, y);
        y += 10;

        // === Destination & Courier ===
        // Fwd Destination Code (bold key, normal value)
        doc.setFont("helvetica", "bold").setFontSize(12);
        doc.text("Fwd Destination Code:", 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${shipment?.orderIds[0]?.city || "N/A"}`, 62, y);
        y += 5;

        // Courier partner (bold key, normal value)
        doc.setFont("helvetica", "bold");
        doc.text("Courier partner:", 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(
          `${
            (shipment.partnerDetails?.name || shipment.partnerName || "").split(
              " "
            )[0]
          }`,
          52,
          y
        );

        y += 20;

        // AWB Barcode
        doc.addImage(aBar, "PNG", 50, y - 12, 100, 20);
        doc
          .setFont("helvetica", "bold")
          .text(`AWB NUMBER (${awb})`, 72, y + 13);

        y += 20;
        // === Product Details Table ===
        doc.setFont("helvetica", "bold").text(`Product Details:-`, 15, y);
        y += 4;
        const tableTop = y;
        doc.setLineWidth(0.4);
        const headers = [
          "SKU",
          "Product Description",
          "Quantity",
          "Amount per qty",
          "Total Amount",
          "GST",
          "Taxable Amount",
        ];
        const colWidth = 170 / headers.length;
        let x = 15;
        doc.setFont("helvetica", "bold").setFontSize(8);
        headers.forEach((header) => {
          doc.rect(x, tableTop, colWidth, 10);
          const split = doc.splitTextToSize(header, colWidth - 2);
          split.forEach((ln, idx) => {
            doc.text(ln, x + 2, tableTop + 4 + idx * 4);
          });
          x += colWidth;
        });

        // Rows
        shipment.orderIds.forEach((prd, i) => {
          x = 15;
          y = tableTop + 10 + i * 10;
          const values = [
            prd.orderId || "-",
            prd.itemDescription || "-",
            String(prd.quantity || "-"),
            prd.quantity > 0
              ? (prd.declaredValue / prd.quantity).toFixed(2)
              : 0,
            prd.declaredValue.toFixed(2),
            prd.gst ? prd.gst : 0,
            prd.gst
              ? (prd.declaredValue + prd.gst).toFixed(2)
              : prd.declaredValue.toFixed(2),
          ];
          doc.setFont("helvetica", "normal").setFontSize(8);
          values.forEach((val) => {
            doc.rect(x, y, colWidth, 10);
            const split = doc.splitTextToSize(val, colWidth - 2);
            split.forEach((ln, idx) => {
              
              doc.text(ln, x + 2, y+4  + idx * 4);
            });
            x += colWidth;
          });
        });
        y = 195;
        // === Pickup/Return Address ===
        doc.setFont("helvetica", "bold").setFontSize(12);
        doc.text("Pickup and Return Address:", 15, y);
        doc.setFont("helvetica", "normal").setFontSize(12);
        y += 5;
        // Combine name and address
        const pickupAddressText = `${shipment?.pickupAddress?.name || ""} ${shipment?.pickupAddress?.addressLine1 || ""}`.trim() || "N/A";
        // Split the text to fit within the page width (max 170mm, leaving margin)
        const addressLines = doc.splitTextToSize(pickupAddressText, 170);
        addressLines.forEach((line, idx) => {
          doc.text(line, 15, y + idx * 5);
        });
        y += (addressLines.length - 1) * 5;
        y += 5;
        doc.text(`India - ${shipment?.pickupAddress?.pincode}`, 15, y);
        y += 5;
        doc.text(
          `Mobile No.: ${shipment?.pickupAddress?.mobile}  GST No: `,
          15,
          y
        );
        y += 10;
        // === Contact ===
        doc.setFont("helvetica", "normal").setFontSize(12);
        doc.text("For any query please contact:", 15, y);
        doc.setFont("helvetica", "normal").setFontSize(12);
        y += 5;
        // Mobile no (bold key)
        doc.setFont("helvetica", "normal");
        doc.text("Mobile no:-", 15, y);
        doc.setFont("helvetica", "normal");
        doc.text("8130117895, 9220551211 ", 38, y);
        // Email (bold key)
        doc.setFont("helvetica", "normal");
        doc.text("Email:", 90, y);
        doc.setFont("helvetica", "normal");
        doc.textWithLink("cs.shipduniya@gmail.com", 105, y, {
          url: "mailto:cs.shipduniya@gmail.com",
        });
        // Draw underline
        const emailWidth = doc.getTextWidth("cs.shipduniya@gmail.com");
        doc.setLineWidth(0.5);
        doc.line(105, y + 1, 105 + emailWidth, y + 1);
        doc.setDrawColor(0, 0, 0); // Reset to black
        doc.setTextColor(0, 0, 0); // Reset to black

        // === Main Border ===
        doc.setLineWidth(0.5).rect(10, 10, 190, 225);

        // === Disclaimer Box ===
        doc.rect(10, 240, 190, 19);
        y = 245;
        doc.setFont("helvetica", "normal").setFontSize(12);
        doc.text(
          "ALL DISPUTES ARE SUBJECTS TO UTTAR PRADESH(U.P) JURISDICTION ONLY. GOODS",
          15,
          y
        );
        y += 5;
        doc.text(
          "ONCE SOLD WILL ONLY BE TAKEN BACK OR EXCHANGED AS PER THE STORE'S",
          15,
          y
        );
        y += 5;
        doc.text("EXCHANGE/RETURN POLICY.", 15, y);

        y += 15;
        // === Footer ===
        doc.setFont("helvetica", "normal").setFontSize(12);
        doc.text("THIS IS AN AUTO-GENERATED LABEL &", 15, y);
        doc.text("DOES NOT NEED SIGNATURE", 15, y + 5);

        doc.addImage(sdImage, "JPEG", 140, y - 7, 15, 15);
        doc.text("Powered by:-", 160, y);
        doc.setFont("helvetica", "bold");
        doc.text("SHIP", 160, y + 5);
        doc.setTextColor(255, 0, 0);
        doc.text("D", 170, y + 5);
        doc.setTextColor(0, 0, 0);
        doc.text("UNIYA", 173, y + 5);
        doc.setTextColor(0, 0, 0);
      });

      doc.save("shipping-labels.pdf");
    } catch (error) {
      console.error("Error generating labels:", error);
      alert("An error occurred while generating labels.");
    }
  };
  const getStatusButtonClass = (status) => {
    const normalizedStatus = status?.trim().toLowerCase();

    switch (normalizedStatus) {
      case "delivered":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-green-500 text-green-500";
      case "rto":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-rose-400 text-rose-400";
      case "rto delivered":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-rose-400 text-rose-400";
      case "rto lost":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-rose-400 text-rose-400";
      case "rto received":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-rose-400 text-rose-400";
      case "pending":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-yellow-500 text-yellow-500";
      case "booked":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-yellow-500 text-yellow-500";
      case "pending pickup":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-yellow-500 text-yellow-500";
      case "in transit":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-blue-500 text-blue-500";
      case "canceled":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-red-500 text-red-500";
      case "cancelled":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-red-500 text-red-500";
      case "out for delivery":
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-blue-500 text-blue-500";
      default:
        return "text-sm font-semibold px-4 py-2 rounded-lg border border-gray-500 text-gray-500";
    }
  };

  const cancelShipment = async (id) => {
    const shipment = shipments.find((shipment) => shipment._id === id);

    if (shipment.status === "canceled" || shipment.status === "cancelled") {
      toast({
        title: "❌ Shipment is Already Cancelled",
        variant: "destructive",
      });

      return;
    }
    try {
      const res = await axiosInstance.post("shipping/cancel-shipping", {
        shippingId: id,
      });

      fetchShipments();
      fetchWalletBalance();
      toast({
        title: "Shipment cancel successfully!",
        variant: "success",
      });

      return res; // Optional: return response if needed
    } catch (error) {
      console.log(error);
    }
  };

  function capitalizeWords(str) {
    return str
      ?.toLowerCase()
      .split(/[\s\-]+/) // splits by space or hyphen
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const handleCancelShipment = async (shipments) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this shipment?"
    );
    if (!confirmCancel) return;
    try {
      // Wait for all cancellations to complete
      await Promise.all(shipments.map((s) => cancelShipment(s)));
      // Reload only once after all are done
    } catch (error) {
      console.log("Error cancelling shipments:", error);
    }
  };

  const downloadPod = async (shipment) => {
    if (shipment.status === "delivered") {
      console.log(shipment);
      const shippingPartner = shipment.partnerDetails.name
        .split(" ")[0]
        .toLowerCase();
      try {
        const response = await axiosInstance.post(
          "/shipping/track-without-login",
          { courier: shippingPartner, awb: shipment.awbNumber }
        );
        const { data } = response;
        if (data.trackingDetails?.pod_link) {
          // Open the POD link in a new tab or trigger download
          window.open(
            data.trackingDetails.pod_link,
            "_blank",
            "noopener,noreferrer"
          );
        } else {
          alert("POD link not available for this shipment.");
        }
      } catch (error) {
        console.error("Error tracking parcel:", error);
        alert("Failed to fetch POD link.");
      }
    }
  };
  const courierName = (str)=>{
    if(str?.toLowerCase().includes("xpressbees")){
      return "xpressbees"
    }else{
      return "delhivery"
    }
  }

  return (
    <>
      <Dialog open={isExporting} onOpenChange={setIsExporting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export </DialogTitle>
            <DialogDescription>Download excel.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-around ">
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
      <Card className="w-full">
        <CardHeader>
          <Filters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateRange={dateRange}
            setDateRange={setDateRange}
            orderType={orderType}
            setOrderType={setOrderType}
            partnerType={partnerType}
            setPartnerType={setPartnerType}
            setShipmentStatus={setShipmentStatus}
            open={open}
            setOpen={setOpen}
            shipments={shipments}
            setIsExporting={setIsExporting}
          />
          {selectedShipments.length > 0 && (
            <div className="flex pt-2 gap-2">
              <Button
                variant="export"
                className="gap-2"
                onClick={handleLabeling}
              >
                <Package className="h-4 w-4" />
                Generate bulk label
              </Button>
              <Button
                variant="export"
                onClick={handleDownloadPDF}
                className="w-40"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Pickup list
              </Button>
              <Button
                variant="export"
                onClick={handleGenerateInvoice}
                className="w-40"
              >
                <ReceiptText className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
              {/* Only show Cancel if all selected shipments are Pending Pickup */}
              {selectedShipments.length > 0 &&
                selectedShipments.every((id) => {
                  const shipment = shipments.find((s) => s._id === id);
                  const status = shipment?.status?.trim().toLowerCase();
                  return (
                    status === "pending" ||
                    status === "booked" ||
                    status === "pending pickup"
                  );
                }) && (
                  <Button
                    className=" border border-red-500 text-red-500"
                    onClick={() => handleCancelShipment(selectedShipments)}
                  >
                    Cancel
                  </Button>
                )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-1">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <Table className="mt-4 p-0">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-30 text-left">
                    <div className="flex justify-center items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                      />
                      <span>Select</span>
                      <span>({selectedShipments.length})</span>
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-left ">
                    Order ID
                  </TableHead>
                  <TableHead className="text-left">AWB Number</TableHead>
                  <TableHead className="text-left">Channel Partner</TableHead>
                  <TableHead className="text-left">Date</TableHead>
                  <TableHead className="text-left">Order Type</TableHead>
                  <TableHead className="text-left">Consignee</TableHead>
                  <TableHead className="text-left">Pincode</TableHead>
                  <TableHead className="text-left">Courier Name</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShippings.map((shipment, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-left">
                      {shipment.status !== "canceled" &&
                        shipment.status !== "cancelled" && (
                          <input
                            type="checkbox"
                            checked={selectedShipments.includes(shipment._id)}
                            onChange={() => toggleSelectShipment(shipment)}
                          />
                        )}
                    </TableCell>
                    <TableCell
                      className="text-left text-blue-400 cursor-pointer font-bold"
                      onClick={() => viewDetails(shipment)}
                    >
                      {shipment.orderIds[0]?.orderId}
                    </TableCell>
                    <TableCell
                      className="text-left text-blue-400 cursor-pointer"
                      // onClick={() => viewDetails(shipment, true)

                      // }
                    ><a
                    href={`/tracking?awb=${encodeURIComponent(shipment.awbNumber)}&courier=${encodeURIComponent(courierName(shipment.partnerDetails?.name))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                      {shipment.awbNumber}</a>
                    </TableCell>
                    <TableCell className="flex item-centre ml-1">
                      {shipment.channelPartner || "Default"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-left">
                      {new Date(shipment.createdAt).toISOString().split("T")[0]}
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      {shipment.orderIds?.[0]?.orderType}
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      {shipment.consignee}
                    </TableCell>
                    <TableCell className="text-left">
                      {shipment.orderIds?.[0]?.pincode}
                    </TableCell>
                    <TableCell className="text-left">
                      {replaceCourierName(shipment.partnerDetails?.name)}
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button
                        type="primary"
                        size="large"
                        icon={<Clock4 />}
                        className={`relative text-white overflow-hidden rounded-lg px-4 py-2 font-semibold transition-all duration-300 ${getStatusButtonClass(
                          shipment.status
                        )}`}
                        onClick={() => downloadPod(shipment)}
                      >
                        {shipment.status?.trim().toLowerCase() === "booked" ||
                        shipment.status?.trim().toLowerCase() === "pending"
                          ? "Pending Pickup"
                          : capitalizeWords(shipment.status) || "Pending"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ShipmentTable;

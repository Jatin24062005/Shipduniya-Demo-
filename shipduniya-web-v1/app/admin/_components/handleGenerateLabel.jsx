import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import bwipjs from "bwip-js";

// Generate barcode image from AWB
export const generateBarcodeBase64 = async (awbNumber) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: awbNumber,
        scale: 3,
        height: 10,
      });
      resolve(canvas.toDataURL("image/png"));
    } catch (error) {
      reject(error);
    }
  });
};

export const handleGenerateLabel = async (shipments) => {
    
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  for (let i = 0; i < shipments.length; i++) {
    const shipment = shipments[i];
    if (i > 0) doc.addPage();

    const awbNumber = shipment.awbNumber;
    const orderData = shipment.orderIds?.[0] || {};
    const partner = shipment.partnerDetails || {};
    const pickup = shipment.pickupAddress || {};
    const returnAddr = shipment.returnAddress || {};
    const dimension = shipment.dimension || "45X45X45";
    const weight = partner.name?.match(/(\d+(\.\d+)?)\s?K\.?G/i)?.[1] || "10";

    const price = (shipment.priceForCustomer || partner.charges || 0) / 100;

    let y = 10;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("SHIPMENT LABEL", 10, y);
    doc.setFontSize(12);
    doc.text("USER", pageWidth - 40, y);
    doc.setFont(undefined, "normal");
    doc.rect(pageWidth - 50, y - 5, 40, 20); // Box for logo/user
    doc.text("LOGO", pageWidth - 35, y + 10);
    y += 20;

    // Divider
    doc.setDrawColor(0);
    doc.line(10, y, pageWidth - 10, y);
    y += 4;

    // "To" Section
    doc.setFont(undefined, "bold");
    doc.text("To:", 10, y);
    doc.setFont(undefined, "bold");
    doc.text((orderData.consignee || shipment.consignee || "N/A").toUpperCase(), 25, y);
    y += 6;
    doc.setFont(undefined, "normal");
    doc.text("India", 25, y);
    y += 5;
    doc.text("MOBILE NO: Not Available", 25, y); // Add actual mobile if available
    y += 8;

    // COD + Dimensions
    doc.setFont(undefined, "bold");
    doc.text("COD", 10, y);
    doc.text(`${weight}kg`, 80, y);
    doc.setFont(undefined, "normal");
    doc.text(`₹${price}`, 10, y + 6);
    doc.text(dimension, 80, y + 6);
    y += 18;

    // Order Info
    doc.setFont(undefined, "bold");
    doc.text(`Order ID: ${orderData.orderId || "N/A"}`, 10, y);
    doc.setFont(undefined, "normal");
    doc.text(`Order Date: ${new Date(shipment.createdAt).toDateString()}`, 10, y + 6);
    doc.text(`Invoice number: 001`, 10, y + 12);

    // Order Barcode
    const barcode1 = await generateBarcodeBase64(orderData.orderId || "ORDER123456");
    doc.addImage(barcode1, "PNG", 100, y, 90, 10);
    y += 24;

    // Courier Info
    doc.setFont(undefined, "bold");
    doc.text(`Fwd Destination Code: ${shipment.fwdCode || "N/A"}`, 10, y);
    doc.text(`Courier partner : ${partner.name || "N/A"}`, 10, y + 6);
    y += 16;

    // AWB Barcode
    const barcode2 = await generateBarcodeBase64(awbNumber);
    doc.addImage(barcode2, "PNG", 10, y, 130, 15);
    y += 18;
    doc.setFont(undefined, "bold");
    doc.text(`AWB NUMBER (${awbNumber})`, 10, y);
    y += 10;

    // Product Table (Mocked)
    autoTable(doc, {
      startY: y,
      head: [["Sku", "Item Name", "Qty", "Amount/Qty", "Total", "GST", "Taxable"]],
      body: [["-", "-", "-", "-", "-", "-", "-"]],
      styles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
    });
    y = doc.lastAutoTable.finalY + 6;

    // Pickup Address
    doc.setFont(undefined, "bold");
    doc.text("Pickup and Return Address:", 10, y);
    y += 5;
    doc.setFont(undefined, "normal");
    doc.text(`${pickup.name || "SHIP DUNIYA"}, ${pickup.addressLine1 || "N/A"}`, 10, y);
    y += 5;
    doc.text(`Mobile No: ${pickup.mobile || "N/A"}`, 10, y);
    y += 5;
    doc.text(`GST No: 09AFLFS8825D1ZK`, 10, y);
    y += 5;
    doc.text("For any query: 9990531211, shipduniya@gmail.com", 10, y);
    y += 10;

    // Disclaimer
    doc.setFontSize(7.5);
    doc.text(
      "ALL DISPUTES ARE SUBJECT TO UTTAR PRADESH (U.P) JURISDICTION ONLY. GOODS ONCE SOLD WILL ONLY BE TAKEN BACK OR EXCHANGED AS PER THE STORE’S RETURN POLICY.",
      10,
      y,
      { maxWidth: 190 }
    );
    y += 8;
    doc.text("THIS IS AN AUTO-GENERATED LABEL & DOES NOT NEED SIGNATURE", 10, y);
    y += 10;

    // Footer Logo & Attribution
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.line(10, y, pageWidth - 10, y);
    doc.setFont(undefined, "bold");
    doc.text("Powered by: SHIP DUNIYA", pageWidth - 60, y + 6);
    doc.setFont(undefined, "normal");
    doc.text("SHIP DUNIYA LOGO", pageWidth - 60, y + 12); // Replace with image if needed
  }

  doc.save("ShipDuniya_Labels.pdf");
};

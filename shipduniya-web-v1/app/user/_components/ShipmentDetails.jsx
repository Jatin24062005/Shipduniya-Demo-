import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import TrackParcelPage from "@/app/track/page";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { capitalize } from "../utils";

const ShipmentDetails = ({ details, isTracking = false, handleBackToList }) => {
  const [tracking, setTracking] = useState(null);
  const [order, setOrder] = useState(null);
  const [WarehouseCity, setWarehouseCity] = useState(null);
  const [WarehouseState, setWarehouseState] = useState(null);
  const [RtoCity, setRtoCity] = useState(null);
  const [RtoState, setRtoState] = useState(null);
  const [warehouses, setWareHouses] = useState(null);
  const [warehouse, setWareHouse] = useState(null);
  const [imageSrc, setImageSrc] = useState("");


  const shipment = details[0];
  const orderInfo = shipment.orderIds[0] ||shipment?.orderIds || [];

  console.log(details)
  function replaceCourierName(str) {
    if (!str) return "";
  
    return str
      .replace(/xpressbees/gi, "Shipduniya XB")
      .replace(/delhivery/gi, "Shipduniya DL");
  }
  

  const fetchWarehouses = async () => {
    try {
      const response = await axiosInstance.get("/warehouse");
      setWareHouses(response.data.warehouses);
    } catch (error) {
      toast({
        title: "Failed to fetch warehouses! Please reload!",
        variant: "destructive",
      });
    }
  };

  const filterWarehouses = (id) => {
    if (!warehouses || !id) return;
    const matchedWarehouse = warehouses.find((w) => w._id === id);
    setWareHouse(matchedWarehouse || null);
  };

  const fetchTracking = async () => {
    try {
      const response = await axiosInstance.get(`/track/${shipment.awbNumber}`);
      setTracking(response.data);
      console.log("Tracking details :", response.data);
    } catch (error) {
      console.error("Error fetching tracking:", error);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get("/shipping/userShipments");
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const fetchLocation = async (pincode) => {
    if (!pincode || pincode.length !== 6) return {};
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      console.log("response :", response)
      if (data && data[0]?.PostOffice?.length) {
        const { District, State } = data[0].PostOffice[0];
        return { District, State };
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
    return {};
  };

  const fetchWarehouseLocation = async () => {
    const { District, State } = await fetchLocation(
      shipment.pickupAddress?.pincode
    );
    setWarehouseCity(District);
    setWarehouseState(State);
  };

  const fetchRtoLocation = async () => {
    const { District, State } = await fetchLocation(
      shipment.returnAddress?.pincode
    );
    setRtoCity(District);
    setRtoState(State);
  };

  useEffect(() => {
    if (isTracking) {
      fetchTracking();
    } else {
      fetchOrder();
    }
  }, []);

  useEffect(() => {
    const loadLocation = async () => await fetchWarehouseLocation();
    loadLocation();
    const loadWarehouseLocation = async () => await fetchWarehouses();
    loadWarehouseLocation();
    const loadRtoLocation = async () => await fetchRtoLocation();
    loadRtoLocation();
  }, [shipment]);

  useEffect(() => {
    if (warehouses) {
      console.log("Fetched warehouses:", warehouses);
      console.log("Filtering using warehouse ID:", shipment?.warehouseId);
      filterWarehouses(shipment?.warehouseId);
    }
  }, [warehouses]);

  const handleLabeling = async () => {
    const filteredShipments = details;
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
      const logoUrl = "/shipDuniyaIcon.jpg";
      let iconImg;
      try {
        iconImg = await loadImage(logoUrl);
      } catch (err) {
        console.error("Logo load failed", err);
        // proceed without icon
      }

      const city = shipment.orderIds[0]?.city || "";
      const state = shipment.orderIds[0]?.state || "";
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      filteredShipments.forEach((shipment, idx) => {
        if (idx > 0) doc.addPage();

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
         y+=1
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
          `${Math.max(
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
          `${(shipment.partnerDetails?.name || shipment.partnerName || "").split(
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

        y += 23;
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
          const yRow = tableTop + 10 + i * 10;
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
            doc.rect(x, yRow, colWidth, 10);
            const split = doc.splitTextToSize(val, colWidth - 2);
            split.forEach((ln, idx) => {
              doc.text(ln, x + 2, yRow + 4 + idx * 4);
            });
            x += colWidth;
          });
        });
        y = 200;
        // === Pickup/Return Address ===
        doc.setFont("helvetica", "bold").setFontSize(12);
        doc.text("Pickup and Return Address:", 15, y);
        doc.setFont("helvetica", "normal").setFontSize(12);
        y += 5;
        doc.text(
          `${shipment?.pickupAddress?.name +
          " " +
          shipment?.pickupAddress?.addressLine1 || "N/A"
          }`,
          15,
          y
        );
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

        doc.addImage(iconImg, "JPEG", 140, y - 7, 15, 15);
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
  
  useEffect(() => {
    const byteArray = new Uint8Array(orderInfo?.image?.data?.data);
    const blob = new Blob([byteArray], { type: orderInfo?.image?.contentType });
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageSrc(reader.result);
    };

    reader.readAsDataURL(blob);
  }, [orderInfo]);

  return (
    <div className="space-y-6 mx-5">
      <div className="flex justify-between items-center">
        <div className="ml-3 mt-3">
          <h4 className="text-2xl font-bold">
            AWB Number: {shipment.awbNumber}
          </h4>
        </div>
        <Button variant="outline" onClick={handleBackToList}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
      </div>

      {!isTracking && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-bold">Consignee Name</dt>
                  <dd>{orderInfo.consignee}</dd>
                </div>
                <div>
                  <dt className="font-bold">Order Id</dt>
                  <dd>{orderInfo.orderId}</dd>
                </div>
                <div>
                  <dt className="font-bold">Address</dt>
                  <dd>{orderInfo.consigneeAddress1}</dd>
                </div>
                <div>
                  <dt className="font-bold">Pincode</dt>
                  <dd>{orderInfo.pincode}</dd>
                </div>
                <div>
                  <dt className="font-bold">City</dt>
                  <dd>{orderInfo.city}</dd>
                </div>
                <div>
                  <dt className="font-bold">State</dt>
                  <dd>{orderInfo.state}</dd>
                </div>
                <div>
                  <dt className="font-bold">Phone</dt>
                  <dd>{orderInfo.mobile}</dd>
                </div>
                <div>
                  <dt className="font-bold">Order Type</dt>
                  <dd>{orderInfo.orderType}</dd>
                </div>
                <div>
                  <dt className="font-bold">Invoice Number</dt>
                  <dd>{orderInfo.invoiceNumber}</dd>
                </div>
                <div>
                  <dt className="font-bold">Item Description</dt>
                  <dd>{orderInfo.itemDescription}</dd>
                </div>
                <div>
                  <dt className="font-bold">Quantity</dt>
                  <dd>{orderInfo.quantity}</dd>
                </div>
                <div>
                  <dt className="font-bold">Declared Value</dt>
                  <dd>{orderInfo.declaredValue}</dd>
                </div>
                <div>
                  <dt className="font-bold">Volumetric Weight (gm)</dt>
                  <dd>{orderInfo.volumetricWeight}</dd>
                </div>
                <div>
                  <dt className="font-bold">Actual Weight (gm)</dt>
                  <dd>{orderInfo.actualWeight}</dd>
                </div>
                <div>
                  <dt className="font-bold">Dimensions</dt>
                  <dd>{`${orderInfo.length} x ${orderInfo.breadth} x ${orderInfo.height}`}</dd>
                </div>
                <div>
                  <dt className="font-bold">Status</dt>
                  <dd>
                    {capitalize(shipment.status) || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold">Courier Partner</dt>
                  <dd>{replaceCourierName(shipment?.partnerDetails?.name ||shipment?.courier)}</dd>
                </div>
                <div>
                  <dt className="font-bold">Charges</dt>
                  <dd>{shipment.priceForCustomer}</dd>
                </div>
                <div>
                  <dt className="font-bold">Collectable Amount</dt>
                  <dd>{orderInfo?.collectableValue}</dd>
                </div><div>
                  <dt className="font-bold">Channel Partner</dt>
                  <dd>{orderInfo?.channelPartner || "Default"}</dd>
                </div><div>
                  <dt className="font-bold">Insurance</dt>
                  <dd>{orderInfo?.insurance || "No"}</dd>
                </div>
                <div>
                  <dt className="font-bold">Label</dt>
                  <dd>
                    {shipment.label ? (
                      <>
                        <span className="mr-2">Download Label</span>

                        <Button
                          onClick={handleLabeling}
                          variant="outline"
                          className="border-green-500 text-green-500"
                        >
                          <Download className="mr-2 h-4 w-4" /> PDF
                        </Button>
                      </>
                    ) : (
                      "Not Available"
                    )}
                  </dd>
                </div>
                {orderInfo.image && (
  <div className="mt-4">
    <p className="text-sm font-medium text-muted-foreground mb-2">
      Uploaded Image:
    </p>
    <a
      href={imageSrc}
      download
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={imageSrc}
        alt="Order"
        className="w-40 h-auto cursor-pointer rounded shadow hover:opacity-80 transition"
      />
    </a>
  </div>
)}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Warehouse Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-bold">Warehouse Name</dt>
                  <dd>{warehouse?.name || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">Warehouse Address</dt>
                  <dd>{warehouse?.address || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">Warehouse City</dt>
                  <dd>{WarehouseCity || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">Warehouse State</dt>
                  <dd>{WarehouseState || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">Warehouse Pincode</dt>
                  <dd>{shipment.pickupAddress?.pincode || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">Manager Name</dt>
                  <dd>{warehouse?.managerName || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">Manager Contact</dt>
                  <dd>{warehouse?.managerMobile || "N/A"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* RTO Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                RTO (Return to Origin) Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-bold">RTO Name</dt>
                  <dd>{shipment.returnAddress?.name || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">RTO Address</dt>
                  <dd>{shipment.returnAddress?.addressLine1 || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">RTO Pincode</dt>
                  <dd>{shipment.returnAddress?.pincode || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">RTO City</dt>
                  <dd>{RtoCity || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">RTO State</dt>
                  <dd>{RtoState || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-bold">RTO Contact</dt>
                  <dd>{shipment.returnAddress?.mobile || "N/A"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </>
      )}
      {/* {isTracking && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Tracking Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrackParcelPage
              AWB_Number={shipment.awbNumber || shipment?.awb}
              courier={shipment?.partnerDetails?.name || shipment?.courier}
            />
          </CardContent>
        </Card>
      )} */}
    </div>
  );
};

export default ShipmentDetails;

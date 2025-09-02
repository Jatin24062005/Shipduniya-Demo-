import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CloneOrder from "./CloneOrder";


const OrderView = ({ order, handleBackToList }) => {
  const [cloneOrder, setCloneOrder] = useState();
 const [imageSrc, setImageSrc] = useState("");
  const [isCloning, setIsCloning] = useState();

  const handleCloneClick = () => {
    setCloneOrder({ ...order });
    setIsCloning(true);

  };

  useEffect(() => {
    const byteArray = new Uint8Array(order?.image?.data?.data);
    const blob = new Blob([byteArray], { type: order?.image?.contentType });
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageSrc(reader.result);
    };

    reader.readAsDataURL(blob);
  }, [order]);
  
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"></div>

      <div className="space-y-6">
        {/* Order Details */}
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle className="flex gap-10 text-2xl font-semibold">
                Order Details
                <Button onClick={handleCloneClick}>Clone Order</Button>
              </CardTitle>
              <h2 className="font-semibold text-base">
                Order ID : <span className="">{order.orderId}</span>
              </h2>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleBackToList}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Name
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.consignee}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Contact
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.mobile ? order.mobile : order.telephone}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Payment Type
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.orderType &&
                    order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Collectable Value
                </dt>
                <dd className="text-base font-semibold mt-1">
                  INR {order.collectableValue}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Declared Value
                </dt>
                <dd className="text-base font-semibold mt-1">
                  INR {order.declaredValue}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Pincode
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.pincode}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Address
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {(order.consigneeAddress1
                    ? order.consigneeAddress1.charAt(0).toUpperCase() +
                      order.consigneeAddress1.slice(1)
                    : "") +
                    " " +
                    (order.consigneeAddress2
                      ? order.consigneeAddress2.charAt(0).toUpperCase() +
                        order.consigneeAddress2.slice(1)
                      : "")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  City
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.city &&
                    order.city.charAt(0).toUpperCase() + order.city.slice(1)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  State
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.state &&
                    order.state.charAt(0).toUpperCase() + order.state.slice(1)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Invoice number
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.invoiceNumber}
                </dd>
              </div>
              <div>
                <dt className=" text-sm font-medium text-muted-foreground">
                  Channel Partner
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order?.channelPartner
                    ? order.channelPartner.charAt(0).toUpperCase() +
                      order.channelPartner.slice(1)
                    : "Default"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Insurance
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order?.insurance
                    ? order.insurance.charAt(0).toUpperCase() +
                      order.insurance.slice(1)
                    : "No"}
                </dd>
              </div>
              {order.image && (
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

        {/* Package Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Item Description
                </dt>
                <dd className="text-base f</dd>ont-semibold mt-1">
                  {order.itemDescription}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  DG Shipment
                </dt>
                <dd className="mt-1">
                  <Badge
                    variant={order.dgShipment ? "destructive" : "secondary"}
                  >
                    {order.dgShipment ? "Yes" : "No"}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Quantity
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.quantity}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Dimensions
                </dt>
                <dd className="text-base font-semibold mt-1">{`${order.height} x ${order.breadth} x ${order.length}`}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Volumetric Weight
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.volumetricWeight}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Actual Weight
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.actualWeight}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {isCloning && <CloneOrder cloneOrder={cloneOrder} setCloneOrder={setCloneOrder} isCloneDialogOpen={isCloning} setIsCloneDialogOpen={setIsCloning}/>
        }
      </div>
    </div>
  );
};

export default OrderView;

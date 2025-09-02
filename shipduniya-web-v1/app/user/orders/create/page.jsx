"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axios";
import { useOrders } from "@/context/OrdersContext";
import { use } from "react";
const orderFormSchema = z
  .object({
    orderType: z.enum(["cod", "prepaid"]),
    consignee: z.string().min(1, "Consignee Name is required"),
    consigneeAddress1: z
      .string()
      .min(1, "Consignee Address Line 1 is required"),
    consigneeAddress2: z.string().optional(),
    city: z.string().min(1, "Destination City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z
      .string()
      .min(6, "Pincode must be 6 digits")
      .max(6, "Pincode must be 6 digits")
      .regex(/^\d{6}$/, "Pincode must contain exactly 6 digits"),
    telephone: z.string().optional(),
    mobile: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
    collectableValue: z
      .number()
      .min(0, "Must be a valid number and at least 0"),
    declaredValue: z.number().min(1, "Must be a valid number and at least 1"),
    itemDescription: z.string().min(1, "Item Description is required"),
    dgShipment: z.boolean(),
    quantity: z
      .number()
      .min(1, "Quantity is required and must be a valid number"),
    height: z.number().min(0.01, "Height must be greater than 0"),
    breadth: z.number().min(0.01, "Breadth must be greater than 0"),
    length: z.number().min(0.01, "Length must be greater than 0"),
    volumetricWeight: z.number().int(),
    actualWeight: z.number().min(0.01, "Actual weight must be greater than 0"),
    invoiceNumber: z.string().min(1, "Invoice Number is required"),
    orderNumber: z.string().min(1, "Order Number is required"),
    insurance: z.enum(["yes", "no"]).default("no"),
    channelPartner: z.string().min(1, "Channel Partner is required"),
    image: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.orderType === "cod") {
      if (
        data.collectableValue === undefined ||
        data.collectableValue === null ||
        data.collectableValue <= 0
      ) {
        ctx.addIssue({
          path: ["collectableValue"],
          message:
            "Collectable value is required and must be greater than 0 for COD orders",
          code: z.ZodIssueCode.custom,
        });
      } else if (data.collectableValue > data.declaredValue) {
        ctx.addIssue({
          path: ["collectableValue"],
          message:
            "Collectable value cannot be greater than declared value for COD orders",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

const orderFormSteps = [
  {
    title: "Booking Details",
    fields: [
      "orderType",
      "consignee",
      "consigneeAddress1",
      "consigneeAddress2",
      "pincode",
      "invoiceNumber",
      "orderNumber",
      "destinationCity",
      "state",
      "mobile",
      "telephone",
      "insurance",
      "channelPartner",
    ],
  },
  {
    title: "Parcel Details",
    fields: [
      "height",
      "breadth",
      "length",
      "collectableValue",
      "declaredValue",
      "itemDescription",
      "dgShipment",
      "quantity",
      "volumetricWeight",
      "actualWeight",
    ],
  },
];

export default function ShippingOrder() {
  const [orderFormStep, setOrderFormStep] = useState(0);
  const [avatarFile, setAvatarFile] = useState(null);
  const router = useRouter();
  const { toast } = useToast();
  const { fetchOrders } = useOrders();
  const defaultOrderNumber = useMemo(
    () => Math.floor(Math.random() * 1000000000),
    []
  );

  const orderForm = useForm({
    mode: "onBlur", // Validate on blur instead of onChange
    reValidateMode: "onBlur",
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderType: "prepaid",
      consignee: "",
      consigneeAddress1: "",
      consigneeAddress2: "",
      city: "",
      state: "",
      pincode: "",
      telephone: "",
      mobile: "",
      collectableValue: 0,
      declaredValue: 0,
      itemDescription: "",
      dgShipment: false,
      insurance: "no",
      channelPartner: "Default",
      quantity: 1,
      height: "",
      breadth: "",
      length: "",
      volumetricWeight: 0,
      actualWeight: "",
      invoiceNumber: "",
      orderNumber: defaultOrderNumber,
      image: null,
    },
    mode: "onBlur",
    criteriaMode: "all",
  });

  const nextOrderStep = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    const fields = orderFormSteps[orderFormStep].fields;
    const isStepValid = await orderForm.trigger(fields);

    if (!isStepValid) {
      console.error("Please fill all required fields correctly.");
      return;
    }

    // Additional validation for COD orders
    if (orderFormStep === 1) {
      const formData = orderForm.getValues();
      if (
        formData.orderType === "cod" &&
        formData.collectableValue > formData.declaredValue
      ) {
        orderForm.setError("collectableValue", {
          type: "custom",
          message:
            "Collectable value cannot be greater than declared value for COD orders",
        });

        console.error(
          "Collectable value cannot be greater than declared value!"
        );
        return;
      }
    }

    // Move to next step safely without submitting
    setOrderFormStep((prev) => Math.min(prev + 1, orderFormSteps.length - 1));

    // Debug log to confirm the step change
    console.log("Moving to step:", orderFormStep + 1);
  };

  const prevOrderStep = () => {
    setOrderFormStep((prev) => Math.max(prev - 1, 0));
  };

  const fetchLocation = async () => {
    const pincode = orderForm.watch("pincode");
    if (pincode.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await response.json();

        if (data && data[0] && data[0].PostOffice) {
          const { District, State } = data[0].PostOffice[0];
          orderForm.setValue("city", District || "");
          orderForm.setValue("state", State || "");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }
  };

  const createForwardOrder = async (values) => {
    console.log(values);

    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      formData.append("image", avatarFile);


      const response = await axiosInstance.post(
        "/orders/create-forward-order",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast({
          title: "Order created successfully!",
          variant: "success",
        });

        // Fetch orders using the context
        fetchOrders();

        // Navigate back to orders page
        router.push("/user/orders");
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Failed to create order",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Watch for changes in orderType and validate collectableValue
  useEffect(() => {
    const subscription = orderForm.watch((value, { name }) => {
      if (
        name === "orderType" ||
        name === "declaredValue" ||
        name === "collectableValue"
      ) {
        const formData = orderForm.getValues();
        if (
          formData.orderType === "cod" &&
          formData.collectableValue > formData.declaredValue
        ) {
          orderForm.setError("collectableValue", {
            type: "custom",
            message:
              "Collectable value cannot be greater than declared value for COD orders",
          });
        } else {
          orderForm.clearErrors("collectableValue");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [orderForm]);

  useEffect(() => {
    fetchLocation();
  }, [orderForm.watch("pincode")]);

  useEffect(() => {
    if (orderForm.watch("orderType").toLowerCase() === "prepaid") {
      orderForm.setValue("collectableValue", 0);
    }
  }, [orderForm.watch("collectableValue")]);

  useEffect(() => {
    const vW = Math.round(
      (orderForm.watch("length") *
        orderForm.watch("breadth") *
        orderForm.watch("height")) /
        5
    );

    orderForm.setValue("volumetricWeight", parseFloat(vW));
  }, [
    orderForm.watch("length"),
    orderForm.watch("breadth"),
    orderForm.watch("height"),
  ]);
  const renderOrderForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>{orderFormSteps[orderFormStep].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={orderForm.handleSubmit(createForwardOrder)}
          className="space-y-6"
        >
          {/* Booking Details Inputs */}
          {orderFormStep === 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="consignee">Consignee Name</Label>
                  <Input
                    id="consignee"
                    {...orderForm.register("consignee")}
                    placeholder="Enter consignee name"
                  />
                  {orderForm.formState.errors.consignee && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.consignee.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="consigneeAddress1">
                    Consignee Address Line 1
                  </Label>
                  <Input
                    id="consigneeAddress1"
                    {...orderForm.register("consigneeAddress1")}
                    placeholder="Enter consignee address line 1"
                  />
                  {orderForm.formState.errors.consigneeAddress1 && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.consigneeAddress1.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="consigneeAddress2">
                    Consignee Address Line 2
                  </Label>
                  <Input
                    id="consigneeAddress2"
                    {...orderForm.register("consigneeAddress2")}
                    placeholder="Enter consignee address line 2 (Optional)"
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select
                    onValueChange={(value) =>
                      orderForm.setValue("orderType", value)
                    }
                    defaultValue={orderForm.getValues("orderType")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prepaid">Prepaid</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                  {orderForm.formState.errors.orderType && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.orderType.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    {...orderForm.register("pincode")}
                    placeholder="Enter pincode"
                    type="number"
                  />
                  {orderForm.formState.errors.pincode && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.pincode.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input
                    id="mobile"
                    {...orderForm.register("mobile")}
                    placeholder="Enter mobile number"
                  />
                  {orderForm.formState.errors.mobile && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.mobile.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="Invoice Number">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    {...orderForm.register("invoiceNumber")}
                    placeholder="Enter invoice number"
                  />
                  {orderForm.formState.errors.invoiceNumber && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.invoiceNumber.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="telephone">Telephone</Label>
                  <Input
                    id="telephone"
                    {...orderForm.register("telephone")}
                    placeholder="Enter telephone number (Optional)"
                  />
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...orderForm.register("city")}
                    placeholder="Enter city"
                  />
                  {orderForm.formState.errors.city && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.city.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    {...orderForm.register("state")}
                    placeholder="Enter state"
                  />
                  {orderForm.formState.errors.state && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.state.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="Invoice Number">Order Number</Label>
                  <Input
                    id="orderNumber"
                    {...orderForm.register("orderNumber")}
                    placeholder="Enter Order Number"
                  />
                  {orderForm.formState.errors.orderNumber && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.orderNumber.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="Insurance">Insurance </Label>
                  <Select id="insurance" {...orderForm.register("insurance")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="Channel Partner">Channel Partner</Label>
                  <Input
                    id="channelPartner"
                    {...orderForm.register("channelPartner")}
                    placeholder="Enter Channel Partner"
                  />
                  {orderForm.formState.errors.channelPartner && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.state.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]"></div>
                <div className="w-[30%]"></div>
              </div>
            </div>
          )}
          {orderFormStep === 1 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="state">Length (cm)</Label>
                  <Input
                    id="length"
                    {...orderForm.register("length", {
                      setValueAs: (value) => {
                        const parsedValue = parseFloat(value);
                        return isNaN(parsedValue) ? "" : parsedValue;
                      },
                    })}
                    placeholder="Enter length"
                    type="number"
                    min="0.01"
                    step="0.01"
                  />
                  {orderForm.formState.errors.length && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.length.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="state">Breadth(cm)</Label>
                  <Input
                    id="breadth"
                    {...orderForm.register("breadth", {
                      setValueAs: (value) => {
                        const parsedValue = parseFloat(value);
                        return isNaN(parsedValue) ? "" : parsedValue;
                      },
                    })}
                    placeholder="Enter breadth"
                    type="number"
                    min="0.01"
                    step="0.01"
                  />
                  {orderForm.formState.errors.breadth && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.breadth.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="state">Height(cm)</Label>
                  <Input
                    id="height"
                    {...orderForm.register("height", {
                      setValueAs: (value) => {
                        const parsedValue = parseFloat(value);
                        return isNaN(parsedValue) ? "" : parsedValue;
                      },
                    })}
                    placeholder="Enter height"
                    type="number"
                    min="0.01"
                    step="0.01"
                  />
                  {orderForm.formState.errors.height && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.height.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="declaredValue">Quantity</Label>
                  <Input
                    id="quantity"
                    {...orderForm.register("quantity", {
                      setValueAs: (value) => parseFloat(value) || 0, // Ensure it's parsed as a number
                    })}
                    placeholder="Enter declared value"
                    type="number"
                  />
                  {orderForm.formState.errors.quantity && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.quantity.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="collectableValue">
                    Collectable Value (₹)
                  </Label>
                  <Input
                    id="collectableValue"
                    {...orderForm.register("collectableValue", {
                      setValueAs: (value) => parseFloat(value) || 0,
                    })}
                    placeholder="Enter collectable value"
                    disabled={orderForm.watch("orderType") === "prepaid"}
                    type="number"
                  />
                  {orderForm.formState.errors.collectableValue && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.collectableValue.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="declaredValue">Declared Value (₹)</Label>
                  <Input
                    id="declaredValue"
                    {...orderForm.register("declaredValue", {
                      setValueAs: (value) => parseFloat(value) || 0, // Ensure it's parsed as a number
                    })}
                    placeholder="Enter declared value"
                    type="number"
                  />
                  {orderForm.formState.errors.declaredValue && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.declaredValue.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="flex items-center gap-3 w-[30%]">
                  <Label htmlFor="dgShipment">DG Shipment</Label>
                  <Switch
                    id="dgShipment"
                    checked={orderForm.watch("dgShipment")}
                    onCheckedChange={(checked) =>
                      orderForm.setValue("dgShipment", checked)
                    }
                  />
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="volumetricWeight">
                    Volumetric Weight (gm)
                  </Label>
                  <Input
                    id="volumetricWeight"
                    {...orderForm.register("volumetricWeight", {
                      setValueAs: (value) => {
                        const parsedValue = parseFloat(value);
                        return isNaN(parsedValue) ? 0 : parsedValue;
                      },
                      validate: {
                        isPositiveNumber: (value) => {
                          const parsedValue = parseFloat(value);
                          return (
                            (!isNaN(parsedValue) && parsedValue >= 0) ||
                            "Volumetric weight must be a valid number and greater than or equal to 0"
                          );
                        },
                      },
                    })}
                    placeholder="Enter volumetric weight"
                    type="number"
                    step="any" // Allow any fractional number
                  />

                  {orderForm.formState.errors.volumetricWeight && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.volumetricWeight.message}
                    </p>
                  )}
                </div>

                <div className="w-[30%]">
                  <Label htmlFor="actualWeight">Actual Weight (gm)</Label>
                  <Input
                    id="actualWeight"
                    {...orderForm.register("actualWeight", {
                      setValueAs: (value) => {
                        const parsedValue = parseFloat(value);
                        return isNaN(parsedValue) ? "" : parsedValue;
                      },
                    })}
                    placeholder="Enter actual weight"
                    type="number"
                    min="0.01"
                    step="0.01"
                  />
                  {orderForm.formState.errors.actualWeight && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.actualWeight.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 my-2">
                <div className="flex  justify-end">
                  <div className="flex   w-[30%] flex-col ">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                      Upload Image (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files[0])}
                      className="block w-full  text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer 
                 file:mr-4 file:py-2 file:px-4 file:border-0 
                 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                <Label htmlFor="itemDescription">Item Description</Label>
                <Textarea
                  id="itemDescription"
                  {...orderForm.register("itemDescription")}
                  placeholder="Enter item description"
                />
                {orderForm.formState.errors.itemDescription && (
                  <p className="text-sm text-red-500">
                    {orderForm.formState.errors.itemDescription.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {orderFormStep > 0 ? (
              <Button type="button" variant="outline" onClick={prevOrderStep}>
                Previous
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // setIsAddingOrder(false);
                  router.push("/user/orders");
                }}
              >
                Back
              </Button>
            )}
            {orderFormStep < orderFormSteps.length - 1 ? (
              <Button type="button" onClick={nextOrderStep}>
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return <div>{renderOrderForm()}</div>;
}

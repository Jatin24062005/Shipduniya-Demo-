import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const CloneOrder = ({
  cloneOrder,
  setCloneOrder,
  isCloneDialogOpen,
  setIsCloneDialogOpen,
}) => {
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  const {toast} =useToast();
 const [city, setCity] = useState();
  const [state, setState] = useState();
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (cloneOrder?.orderType === "prepaid") {
      setCloneOrder((prev) => ({
        ...prev,
        collectableValue: 0,
      }));
    }
  }, [cloneOrder?.orderType, setCloneOrder]);

  useEffect(() => {
    if (
      cloneOrder?.collectableValue &&
      cloneOrder?.declaredValue &&
      parseFloat(cloneOrder.collectableValue) >
        parseFloat(cloneOrder.declaredValue)
    ) {
      // Show an error or enforce the condition
      console.error("Collectable value cannot be greater than declared value");
    }
    if (
      cloneOrder?.orderType?.toLowerCase() === "prepaid" &&
      parseFloat(cloneOrder.collectableValue) > 0
    ) {
      console.error("Collectable should be 0 for prepaid orders");
      setCloneOrder({ ...cloneOrder, collectableValue: 0 });
    }
  }, [cloneOrder?.collectableValue, cloneOrder?.declaredValue]);

  // Add validation for pincode, mobile, and dimensions
  useEffect(() => {
    if (cloneOrder) {
      const errors = {};

      // Pincode validation
      if (cloneOrder.pincode && cloneOrder.pincode.length > 6) {
        errors.pincode = "Pincode cannot be greater than 6 digits";
      }

      // Mobile validation
      if (cloneOrder.mobile && cloneOrder.mobile.length > 10) {
        errors.mobile = "Mobile number cannot be greater than 10 digits";
      }

      // Actual weight validation
      if (cloneOrder.actualWeight <= 0) {
        errors.actualWeight = "Actual weight must be greater than 0";
      }

      // Declared value validation
      if (cloneOrder.declaredValue <= 0) {
        errors.declaredValue = "Declared value must be greater than 0";
      }

      setValidationErrors(errors);
    }
  }, [cloneOrder]);

  // Add effect to calculate volumetric weight
  useEffect(() => {
    if (cloneOrder) {
      const length = parseFloat(cloneOrder.length) || 0;
      const breadth = parseFloat(cloneOrder.breadth) || 0;
      const height = parseFloat(cloneOrder.height) || 0;
      
      const volumetricWeight = Math.round((length * breadth * height) / 5);
      
      setCloneOrder(prev => ({
        ...prev,
        volumetricWeight: volumetricWeight.toFixed(2)
      }));
    }
  }, [cloneOrder?.length, cloneOrder?.breadth, cloneOrder?.height]);

const handleCloneOrder = async () => {
  if (Object.keys(validationErrors).length > 0) {
    console.error("Validation errors:", validationErrors);
    return;
  }

  try {
    const formData = new FormData();

    // Append order fields
    Object.entries(cloneOrder).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append image file
    if (image) {
      formData.append("image", image); // "file" must match multer's .single("file")
    }

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

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
      setIsCloneDialogOpen(false);
      window.location.reload();
    }
  } catch (e) {
    console.error(e);

    const errorMessage = e?.response?.data?.details || e?.message || "Something went wrong";
    console.log("Response of CLone error", errorMessage);

    if (errorMessage.includes("duplicate key") || errorMessage.includes("unique constraint")) {
      toast({
        title: "Duplicate Entry",
        description: "Order Number already exists or violates a unique field. Please modify and try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }
};


const fetchLocation = async (pincode) => {
    if (!pincode || pincode.length !== 6) return {};
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      if (data && data[0]?.PostOffice?.length) {
        const { District, State } = data[0].PostOffice[0];
        return { District, State };
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
    return {};
  };

  useEffect(() => {
    const updateLocation = async () => {
      if (cloneOrder?.pincode && cloneOrder?.pincode.length === 6) {
        const { District, State } = await fetchLocation(cloneOrder.pincode);
        setCity(District || "");
        setState(State || "");
      } else {
        setCity("");
        setState("");
      }
    };

    updateLocation();
  }, [cloneOrder?.pincode]);

  return (
    <Dialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen}>
      <DialogContent className="sm:max-w-[660px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Clone Order</DialogTitle>
        </DialogHeader>

        {/* Step 1: Consignee Details */}
        {step === 1 && (
          <div className="flex gap-6 justify-between flex-wrap">
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Consignee</label>
              <Input
                value={cloneOrder.consignee}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    consignee: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Order Type</label>
              <select
                value={cloneOrder.orderType?.toLowerCase()}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    orderType: e.target.value,
                  })
                }
                className="p-2 border rounded"
              >
                <option value="prepaid">Prepaid</option>
                <option value="cod">COD</option>
              </select>
            </div>

            <div className="flex flex-col pb-4 w-[40%]">
              <label>Consignee Address 1</label>
              <input
                type="text"
                value={cloneOrder?.consigneeAddress1 || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    consigneeAddress1: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg "
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Consignee Address 2</label>
              <input
                type="text"
                value={cloneOrder?.consigneeAddress2 || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    consigneeAddress2: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Pincode</label>
              <input
                type="text"
                value={cloneOrder?.pincode || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    pincode: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
                maxLength={6}
              />
              {validationErrors.pincode && (
                <p className="text-sm text-red-500">{validationErrors.pincode}</p>
              )}
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Invoice Number</label>
              <input
                type="text"
                value={cloneOrder?.invoiceNumber || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    invoiceNumber: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>City</label>
              <input
                type="text"
                value={city ||cloneOrder?.city || ""}
                    disabled
                placeholder={city || "Auto-filled from pincode"}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    city: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg  cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>State</label>
              <input
                type="text"
                value={state ||cloneOrder?.state || ""}
                 disabled
                placeholder={city || "Auto-filled from pincode"}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    state: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg  cursor-not-allowed"
              /> 
                </div>
              <div className="flex flex-col pb-4 w-[40%]">
              <label>Order Number</label>
              <input
                type="text"
                value={cloneOrder?.orderId || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    orderId: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
          
            </div>
            <div className="flex flex-col">
              <label>Mobile</label>
              <input
                type="text"
                value={cloneOrder?.mobile || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    mobile: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
                maxLength={10}
              />
              {validationErrors.mobile && (
                <p className="text-sm text-red-500">{validationErrors.mobile}</p>
              )}
            </div>
             <div className="flex flex-col pb-4 w-[40%]">
              <label htmlFor="Insurance">Insurance </label>
              <select
                id="insurance"
                value={cloneOrder?.insurance || "no"}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    insurance: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  Select insurance option
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Channel Partner</label>
              <input
                type="text"
                value={cloneOrder?.channelPartner || "Default"}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    channelPartner: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
       
            </div>
          </div>
        )}

        {/* Step 2: Package Details */}
        {step === 2 && (
          <div className="flex gap-6 justify-between flex-wrap">
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Length (cm)</label>
              <input
                type="number"
                value={cloneOrder?.length || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    length: parseFloat(e.target.value) || 0,
                  })
                }
                className="border px-2 py-1 rounded-lg"
                min="0.01"
                step="0.01"
              />
              {validationErrors.length && (
                <p className="text-sm text-red-500">{validationErrors.length}</p>
              )}
            </div>

            <div className="flex flex-col pb-4 w-[40%]">
              <label>Width (cm)</label>
              <input
                type="number"
                value={cloneOrder?.breadth || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    breadth: parseFloat(e.target.value) || 0,
                  })
                }
                className="border px-2 py-1 rounded-lg"
                min="0.01"
                step="0.01"
              />
              {validationErrors.breadth && (
                <p className="text-sm text-red-500">{validationErrors.breadth}</p>
              )}
            </div>

            <div className="flex flex-col pb-4 w-[40%]">
              <label>Height (cm)</label>
              <input
                type="number"
                value={cloneOrder?.height || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    height: parseFloat(e.target.value) || 0,
                  })
                }
                className="border px-2 py-1 rounded-lg"
                min="0.01"
                step="0.01"
              />
              {validationErrors.height && (
                <p className="text-sm text-red-500">{validationErrors.height}</p>
              )}
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Collectable Value (₹)</label>
              <Input
                type="number"
                value={cloneOrder?.collectableValue || 0}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    collectableValue: e.target.value,
                  })
                }
                disabled={cloneOrder?.orderType?.toLowerCase() === "prepaid"} // Disable for prepaid orders
                step="0.01" // Allow decimal values
                className="border px-2 py-1 rounded-lg"
              />
              {cloneOrder?.orderType === "cod" &&
                cloneOrder?.collectableValue > cloneOrder?.declaredValue && (
                  <p className="text-sm text-red-500">
                    Collectable value cannot be greater than declared value
                  </p>
                )}
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Declared Value (₹)</label>
              <input
                type="number"
                value={cloneOrder?.declaredValue || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    declaredValue: parseFloat(e.target.value) || 0,
                  })
                }
                className="border px-2 py-1 rounded-lg"
                min="0.01"
                step="0.01"
              />
              {validationErrors.declaredValue && (
                <p className="text-sm text-red-500">{validationErrors.declaredValue}</p>
              )}
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Description</label>
              <textarea
                value={cloneOrder?.itemDescription || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    itemDescription: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg "
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>DG Shipment</label>
              <Switch
                checked={cloneOrder?.dgShipment || false}
                onCheckedChange={(checked) =>
                  setCloneOrder({
                    ...cloneOrder,
                    dgShipment: checked,
                  })
                }
              />
            </div>

            <div className="flex flex-col pb-4 w-[40%]">
              <label>Quantity</label>
              <input
                type="number"
                value={cloneOrder?.quantity || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    quantity: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Volumetric Weight (gm)</label>
              <input
                type="number"
                value={cloneOrder?.volumetricWeight || ""}
                readOnly
                className="border px-2 py-1 rounded-lg bg-gray-100"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Actual Weight (gm)</label>
              <input
                type="number"
                value={cloneOrder?.actualWeight || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    actualWeight: parseFloat(e.target.value) || 0,
                  })
                }
                className="border px-2 py-1 rounded-lg"
                min="0.01"
                step="0.01"
              />

              {validationErrors.actualWeight && (
                <p className="text-sm text-red-500">{validationErrors.actualWeight}</p>
              )}
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Choose Image(Optional) </label>
              <input
                type="file"
                accept="image/*"
                readOnly
                className=" block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row justify-between">
          {step > 1 && (
            <Button size="lg" variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          {step < 2 && (
            <Button
              size="lg"
              className="bg-primary text-white"
              onClick={() => setStep(2)}
            >
              Next
            </Button>
          )}
          {step === 2 && (
            <Button
              size="lg"
              className="bg-primary text-white"
              onClick={handleCloneOrder}
            >
              Clone
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloneOrder;

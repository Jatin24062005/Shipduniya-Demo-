"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const initialFormData = {
  originPincode: "",
  destinationPincode: "",
  actualWeight: "",
  length: "",
  breadth: "",
  height: "",
  paymentType: "prepaid",
  codAmount: 0,
};

const RateCalculator = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [originCityState, setOriginCityState] = useState(null);
  const [destinationCityState, setDestinationCityState] = useState(null);
  const [partner, setPartner] = useState("All")

  const fetchLocation = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data && data[0] && data[0].PostOffice) {
        const { District, State } = data[0].PostOffice[0];
        return {
          District,
          State,
        };
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };
  const getOriginCityState = async () => {
    const response = await fetchLocation(formData.originPincode.trim());
    setOriginCityState(response);
  };

  const getDestinationCityState = async () => {
    const response = await fetchLocation(formData.destinationPincode.trim());
    setDestinationCityState(response);
  };

  useEffect(() => {
    if (formData.originPincode.trim().length === 6) {
      getOriginCityState();
    }
  }, [formData.originPincode]);

  useEffect(() => {
    if (formData.destinationPincode.trim().length === 6) {
      getDestinationCityState();
    }
  }, [formData.destinationPincode]);

  const getResults = async (data) => {
    setIsLoading(true);
    setError(null);
    setFormSubmitted(false);
    try {
      const response = await axiosInstance.post(
        "/calculate/calculate-charges",
        data
      );
      console.log(response.data);
      setResult((prev) => [...prev, ...response.data.charges]);
    } catch (err) {
      setError(
        err.response
          ? err.response.data
          : "An error occurred while fetching rates."
      );
    } finally {
      setIsLoading(false);
      setFormSubmitted(true); // Mark that we tried submitting
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult([]);
    const body1 = {
      chargeableWeight: Math.max(formData.actualWeight, volumetricWeight),
      productType: formData.paymentType,
      originPincode: formData.originPincode,
      destinationPincode: formData.destinationPincode,
      carrierName: "xpressbees",
      ...(formData.paymentType === "cod" && { CODAmount: formData.codAmount }),
    };
    const body2 = {
      chargeableWeight: Math.max(formData.actualWeight, volumetricWeight),
      productType: formData.paymentType,
      originPincode: formData.originPincode,
      destinationPincode: formData.destinationPincode,
      carrierName: "delhivery",
      ...(formData.paymentType === "cod" && { CODAmount: formData.codAmount }),
    };
    if(partner === 'All'){

      await getResults(body1);
      await getResults(body2);
    }else if (partner === 'Ship Duniya XB'){
      await getResults(body1);
    }else if (partner === 'Ship Duniya DL'){
      await getResults(body2);
    }
  };
  // Destructure formData for easier access
  const {
    originPincode,
    destinationPincode,
    actualWeight,
    length,
    breadth,
    height,
    paymentType,
    codAmount,
  } = formData;

  // Derived values
  const volumetricWeight =
    length && breadth && height
      ? ((Number(length) * Number(breadth) * Number(height)) / 5).toFixed(2)
      : "";

  const appliedWeight =
    actualWeight && volumetricWeight
      ? Math.max(Number(actualWeight), Number(volumetricWeight)).toFixed(2)
      : "";

  // Handlers for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setPaymentType = (type) => {
    setFormData((prev) => ({
      ...prev,
      paymentType: type,
    }));
  };

  const router = useRouter();

     const edd =
     originPincode === destinationPincode
       ? "1-2 days"
       : Math.random() < 0.5
       ? "2-3 days"
       : "3-5 days";

  return (
    <div className="w-full px-6 py-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Rate Calculator</CardTitle>
            <Button onClick={() => router.back()} variant="outline">
              {" "}
              Back
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-2/5">
                <div className="space-y-2">
                  <Label htmlFor="originPincode">Origin Pincode</Label>
                  <Input
                    id="originPincode"
                    name="originPincode"
                    type="text"
                    value={originPincode}
                    onChange={handleChange}
                    required
                  />
                  {originCityState && (
                    <p className="text-xs font-bold text-blue-600">
                      {originCityState.District + " / " + originCityState.State}
                    </p>
                  )}
                </div>
                <div className="space-y-2 mt-5">
                  <Label htmlFor="actualWeight">Actual Weight (grams)</Label>
                  <Input
                    id="actualWeight"
                    name="actualWeight"
                    type="number"
                    value={actualWeight}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                <div className="flex justify-between pr-12">
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-semibold">Volumetric Weight</p>
                    <div className="font-semibold">
                      {volumetricWeight ? `${volumetricWeight} g` : "-"}
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-semibold">Applied Weight</p>
                    <div className="font-semibold">
                      {appliedWeight ? `${appliedWeight} g` : "-"}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label>Payment Type</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentType"
                        value="prepaid"
                        checked={paymentType === "prepaid"}
                        onChange={() => setPaymentType("prepaid")}
                      />
                      Prepaid
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentType"
                        value="cod"
                        checked={paymentType === "cod"}
                        onChange={() => setPaymentType("cod")}
                      />
                      COD
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-2/5">
                <div className="space-y-2">
                  <Label htmlFor="destinationPincode">
                    Destination Pincode
                  </Label>
                  <Input
                    id="destinationPincode"
                    name="destinationPincode"
                    type="text"
                    value={destinationPincode}
                    onChange={handleChange}
                    required
                  />
                  {destinationCityState && (
                    <p className="text-xs font-bold text-blue-600">
                      {destinationCityState.District +
                        " / " +
                        destinationCityState.State}
                    </p>
                  )}
                </div>
                <h3 className="text-sm font-semibold">Dimensions</h3>
                <div className="flex gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input
                      id="length"
                      name="length"
                      type="number"
                      value={length}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breadth">Breadth (cm)</Label>
                    <Input
                      id="breadth"
                      name="breadth"
                      type="number"
                      value={breadth}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={height}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="partner">Partner</Label>
                  <Select
                    id="partner"
                    value={partner}
                    onValueChange={(value) =>
                      setPartner(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Partner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Ship Duniya XB">
                        Ship Duniya XB
                      </SelectItem>
                      <SelectItem value="Ship Duniya DL">
                        Ship Duniya DL
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentType === "cod" && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="codAmount">COD Amount</Label>
                    <Input
                      id="codAmount"
                      name="codAmount"
                      type="number"
                      value={codAmount}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Payment Type Radio Buttons */}

            <Button
              type="submit"
              className={`${
                formSubmitted && result.length === 0 && !isLoading
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : formSubmitted && result.length === 0 ? (
                "Selected Partner Doesn't provide service at this Pincode"
              ) : (
                "Calculate Rate"
              )}
            </Button>
          </form>
          {result.length > 0 && (
            <div className="space-y-6 mt-10">
              <Card className="w-[100%] border border-gray-300 shadow-lg rounded-lg">
                <CardContent className="p-4">
                  <table className="w-full border-collapse border-2 border-gray-300 rounded-lg">
                    <thead>
                      <tr
                        className="bg-gray-200 font-bold"
                        style={{ height: "70px" }}
                      >
                        <th className="border p-2">Services</th>
                        <th className="border p-2">Freight Charge</th>
                        <th className="border p-2">COD Charge</th>
                        <th className="border p-2">Total Price</th>
                        <th className="border p-2">EDD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.map((item, index) => {
                        const isEven = index % 2 === 0;
                        // Split the serviceType into words
                        const words = (item?.serviceType || "").split(" ");
                        let displayService = "";
                        if (words.length >= 2) {
                          if (words[0].toLowerCase() === "surface") {
                            displayService = `Ship Duniya XB Surface ${words
                              .slice(-2)
                              .join(" ")}`;
                          } else if (words[0].toLowerCase() === "air") {
                            displayService = `Ship Duniya XB Air ${words
                              .slice(-2)
                              .join(" ")}`;
                          } else if (words[0].toLowerCase() === "xpressbees") {
                            displayService = `Ship Duniya XB ${words
                              .slice(-2)
                              .join(" ")}`;
                          } else {
                            displayService = `Ship Duniya DL ${words
                              .slice(-1)
                              .join(" ")}`;
                          }
                        } else {
                          displayService = item?.serviceType || "";
                        }
                        return (
                          <tr
                            key={index}
                            className={`${isEven ? "bg-white" : "bg-gray-100"}`}
                            style={{ height: "70px" }}
                          >
                            <td className="border p-2">{displayService}</td>
                            <td className="border p-2">
                              {" "}
                              {(
                                Number(item?.freightCharge || 0) +
                                Number(item?.otherCharges || 0)
                              ).toFixed(2)}
                            </td>
                            <td className="border p-2">{item?.codCharge}</td>
                            <td className="border p-2">
                              ₹{item?.totalPrice?.toFixed(2)}
                            </td>
                            <td className="border p-2">{displayService === 'Ship Duniya DL (E)' || displayService === 'Ship Duniya XB Air 0.5 K.G'? '1-2 Days': edd}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Terms &amp; Conditions</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
          <li>
            Freight charges (GST inclusive) are based on the higher dead/dry or
            volumetric weight. RTO (return to origin) shipment will be charged
            differently from the forward delivery rate.
          </li>
          <li>
            Note: The standard courier RTO charge will also apply to their
            additional weight courier type.
          </li>
          <li>
            Fixed COD charge or COD % of the order value whichever is higher
            will be taken while calculating the COD fee.
          </li>
          <li>
            Volumetric weight is calculated as LxBxH/5000 for most couriers.
            Measurements (length, breadth, height) should be in centimeters.
          </li>
          <li>
            The maximum liability, if any, is limited to whatever compensation
            the logistics partner offers to Company in event of a claim by the
            Merchant, provided such a claim is raised by the Merchant within one
            (1) month from the date of such damage or loss or theft.
          </li>
          <li>
            Detailed terms and conditions can be reviewed on (
            <Link href="/user/profile" className="text-blue-600 underline">
              merchant pdf link
            </Link>
            )
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RateCalculator;

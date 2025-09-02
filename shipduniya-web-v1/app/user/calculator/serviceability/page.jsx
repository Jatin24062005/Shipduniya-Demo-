"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/utils/axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// const DUMMYRESULT = {
//   xpress
// }

export default function Serviceability() {
  const [formData, setFormData] = useState({
    originPinCode: "",
    destinationPinCode: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [originCityState, setOriginCityState] = useState(null);
  const [destinationCityState, setDestinationCityState] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const { originPinCode, destinationPinCode } = formData;

    // Only proceed if both are 6 digits
    if (
      originPinCode.length === 6 &&
      destinationPinCode.length === 6 &&
      /^\d{6}$/.test(originPinCode) &&
      /^\d{6}$/.test(destinationPinCode)
    ) {
      setIsLoading(true);
      const body = {
        chargeableWeight: 500,
        productType: "prepaid",
        originPincode: originPinCode,
        destinationPincode: destinationPinCode,
        carrierName: "xpressbees",
      };
      try {
        const response = await axiosInstance.post(
          "/calculate/calculate-charges",
          body
        );
        if (response.data.charges.length > 0) {
          const charge = response.data.charges.find((item) => item.id === "2");
          const price = charge ? charge.totalPrice : null;
          if (price < 195) {
            const data = {
              xb: true,
              xbed: "1-2 Days",
              d: true,
              ded: "1 Day",
            };
            setResult(data);
          } else if (price < 215) {
            const data = {
              xb: true,
              xbed: "2-3 Days",
              d: true,
              ded: "1-2 Day",
            };
            setResult(data);
          } else {
            const data = {
              xb: true,
              xbed: "3-5 Days",
              d: true,
              ded: "3-5 Days",
            };
            setResult(data);
          }
        } else {
          setResult({
            xb: false,
            d: false,
          });
        }
      } catch (error) {
        setResult([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResult([]);
    }
  };

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
    const response = await fetchLocation(formData.originPinCode.trim());
    setOriginCityState(response);
  };

  const getDestinationCityState = async () => {
    const response = await fetchLocation(formData.destinationPinCode.trim());
    setDestinationCityState(response);
  };

  useEffect(() => {
    if (formData.originPinCode.trim().length === 6) {
      getOriginCityState();
    }
  }, [formData.originPinCode]);

  useEffect(() => {
    if (formData.destinationPinCode.trim().length === 6) {
      getDestinationCityState();
    }
  }, [formData.destinationPinCode]);

  const router = useRouter();
  return (
    <div className="flex flex-col h-full w-full">
      <Card className="w-full min-h-[58vh]">
        <CardHeader>
          <div className="flex justify-between">
          <CardTitle>Check Serviceability</CardTitle>
      <Button onClick= {() => router.back()} variant="outline"> Back</Button>

          </div>
        </CardHeader>
        <CardContent className="w-full">
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="flex gap-6 w-full">
              <div className="space-y-2 w-1/3">
                <Label htmlFor="originPinCode">Origin PIN Code</Label>
                <Input
                  id="originPinCode"
                  type="text"
                  value={formData.originPinCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      originPinCode: e.target.value,
                    }))
                  }
                />
                {originCityState && (
                  <p className="text-xs font-bold text-blue-600">
                    {originCityState.District + " / " + originCityState.State}
                  </p>
                )}
              </div>
              <div className="space-y-2 w-1/3">
                <Label htmlFor="destinationPinCode">Destination PIN Code</Label>
                <Input
                  id="destinationPinCode"
                  type="text"
                  value={formData.destinationPinCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      destinationPinCode: e.target.value,
                    }))
                  }
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
            </div>
            <Button
              type="submit"
              className={` ${
                formSubmitted && result && !isLoading
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "Selected Partner Doesn't provide service at this PIN Code"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Check Serviceability"
              )}
            </Button>
          </form>
          {result && (
            <div className="mt-6">
              <table className="min-w-full border border-gray-200 rounded overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-4 text-left">Courier Name</th>
                    <th className="px-4 py-4 text-left">Availability</th>
                    <th className="px-4 py-4 text-left">EDD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={"bg-white"}>
                    <td className="px-4 py-4 font-medium capitalize">
                      Ship Duniya XB
                    </td>
                    <td className="px-4 py-4 flex items-center gap-2">
                      {result.xb ? (
                        <>
                          <span className="text-green-600 font-semibold flex items-center">
                            Yes
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-red-600 font-semibold flex items-center">
                            No
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {result.xb ? result.xbed : "-"}
                    </td>
                  </tr>
                  <tr className={"bg-gray-50"}>
                    <td className="px-4 py-4 font-medium capitalize">
                      Ship Duniya DL
                    </td>
                    <td className="px-4 py-4 flex items-center gap-2">
                      {result.d ? (
                        <>
                          <span className="text-green-600 font-semibold flex items-center">
                            Yes
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-red-600 font-semibold flex items-center">
                            No
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4">{result.d ? result.ded : "-"}</td>
                  </tr>
                </tbody>
              </table>
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
}

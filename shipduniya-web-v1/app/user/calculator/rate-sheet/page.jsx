"use client";
import React, { useState, useEffect } from "react";
import BronzeSheet from "./BronzeSheet";
import SilverSheet from "./SilverSheet";
import GoldSheet from "./GoldSheet";
import PlatinumSheet from "./PlatinumSheet";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios";

const Page = () => {
  const [customerType, setCustomerType] = useState("bronze");
  const [isDl, setIsDl] = useState(false);
  const [cRateSheet, setCRateSheet] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/users/profile", {
          signal: controller.signal,
        });
        console.log(response.data);
        setCustomerType(response.data?.customerType);
        if(response.data?.rateSheet){
          setCRateSheet(response.data?.rateSheet)
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        // if (axios.isCancel(err) || err.code === "ERR_CANCELED") {
        //   // Request was canceled – optional: console.log("Request canceled");
        // } else {
        //   setError("Failed to fetch user data");
        // }
      }
    };

    fetchUserData();

    return () => {
      controller.abort();
    };
  }, []);

  const renderSheet = () => {
    if (customerType === "bronze") return <BronzeSheet isDl={isDl} cRateSheet={cRateSheet} />;
    if (customerType === "silver") return <SilverSheet isDl={isDl} cRateSheet={cRateSheet}/>;
    if (customerType === "gold") return <GoldSheet isDl={isDl} cRateSheet={cRateSheet}/>;
    if (customerType === "diamond") return <PlatinumSheet isDl={isDl} cRateSheet={cRateSheet} />;
  };

  const router = useRouter();

  return (
    <div className="px-2 py-2 rounded-lg">
      <div className="flex justify-between">
        <div className="flex gap-4 my-3 font-semibold">
          <p
            onClick={() => setIsDl(false)}
            className={`${
              !isDl ? "text-blue-500" : "text-gray-700"
            } cursor-pointer`}
          >
            Ship Duniya XB
          </p>
          <p
            onClick={() => setIsDl(true)}
            className={`${
              isDl ? "text-blue-500" : "text-gray-700"
            } cursor-pointer`}
          >
            Ship Duniya DL
          </p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          {" "}
          Back
        </Button>
      </div>

      {renderSheet()}
      <h2 className="font-semibold mt-6 mb-2">Terms & conditions</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Above prices are <strong>exclusive</strong> of GST.
        </li>
        <li>
          Chargeable Weight will be Physical/Dead Weight or Volumetric Weight,
          whichever is higher.
        </li>
        <li>
          COD Charges will be fixed COD charge or COD % of the order value,
          whichever is higher.
        </li>
        <li>
          Volumetric Weight (Kilogram) calculation as per IATA:
          <code>Length (cm) × Breadth (cm) × Height (cm) / 5000</code>
        </li>
        <li>
          Other charges like octroi, state entry tax, address correction fees
          (if applicable) shall be charged extra.
        </li>
        <li>
          RTO (return to origin) shipment will be charged separately from the
          forward delivery rate, which will be the same as forward rates.
        </li>
        <li>
          For any queries, a ticket must be raised at:
          <a href="mailto:shipduniya@gmail.com">shipduniya@gmail.com</a>
        </li>
        <li>
          Maximum liability is limited to ₹2,000 in the event of a claim by the
          merchant, provided such claim is raised within one (1) month from the
          date of damage, loss, or theft.
        </li>
        <li>
          The merchant shall not book or hand over any product that is banned,
          restricted, illegal, prohibited, stolen, infringing any third‑party
          rights, liquid, hazardous or dangerous, or in breach of any law or
          regulation in force in India.
        </li>
        <li>Other terms and conditions apply as defined in the agreement.</li>
      </ul>
    </div>
  );
};

export default Page;

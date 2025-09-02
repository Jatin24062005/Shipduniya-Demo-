import React, { useState } from "react";
import {
  bronzeXB,
  bronzeDL,
  silverDL,
  silverXB,
  goldDL,
  goldXB,
  platDL,
  platXB,
} from "../users/constants";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vendors = [
  "Surface Xpressbees 0.5 K.G",
  "Xpressbees 2 K.G",
  "Xpressbees 5 K.G",
  "Xpressbees 10 K.G",
  "Air Xpressbees 0.5 K.G",
  "Xpressbees 1 K.G",
  "Delhivery Service (E)",
  "Delhivery Service (S)",
];

const RateSheetModal = ({ showXBModal, setShowXBModal, user, handleSave }) => {
  let initialDataXB, initialDataDL, initialMultiplier;
  if (user.rateSheet) {
    initialDataXB = user.rateSheet.xb;
    initialDataDL = user.rateSheet.dl;
  } else {
    if (user.customerType === "bronze") {
      initialDataXB = bronzeXB;
      initialDataDL = bronzeDL;
    } else if (user.customerType === "silver") {
      initialDataXB = silverXB;
      initialDataDL = silverDL;
    } else if (user.customerType === "gold") {
      initialDataXB = goldXB;
      initialDataDL = goldDL;
    } else {
      initialDataXB = platXB;
      initialDataDL = platDL;
    }
  }
  if (user.multiplier && typeof user.multiplier === "object") {
    initialMultiplier = user.multiplier;
  }

  const [xbRates, setXbRates] = useState(
    initialDataXB.map((obj) => ({
      ...obj,
      withinCity: { ...obj.withinCity },
      withinState: { ...obj.withinState },
      regional: { ...obj.regional },
      metroToMetro: { ...obj.metroToMetro },
      neJkKlAn: { ...obj.neJkKlAn },
      restOfIndia: { ...obj.restOfIndia },
      cod: { ...obj.cod },
    }))
  );
  // --- End Xpressbees ratesheet modal state ---
  const [expandedRows, setExpandedRows] = useState([]);

  const [dlRates, setDlRates] = useState(
    initialDataDL.map((obj) => ({
      ...obj,
      withinCity: { ...obj.withinCity },
      regional: { ...obj.regional },
      metroToMetroA: { ...obj.metroToMetroA },
      metroToMetroB: { ...obj.metroToMetroB },
      restOfIndiaA: { ...obj.restOfIndiaA },
      restOfIndiaB: { ...obj.restOfIndiaB },
      zoneG: { ...obj.zoneG },
      zoneH: { ...obj.zoneH },
      cod: { ...obj.cod },
    }))
  );
  // --- End Xpressbees ratesheet modal state ---
  const [expandedRowsDL, setExpandedRowsDL] = useState([]);

  const [editCalculation, setEditCalculation] = useState(false);
  const [selectedCustomerType, setSelectedCustomerType] = useState(
    user.customerType
  );
  // Add state for custom multipliers
  const [customMultipliers, setCustomMultipliers] = useState(() => {
    if (initialMultiplier) {
      // If initialMultiplier is in old format, convert to new format
      const obj = {};
      vendors.forEach((vendor) => {
        if (typeof initialMultiplier[vendor] === "object") {
          obj[vendor] = {
            multiplier: initialMultiplier[vendor].multiplier ?? 1.5,
            codAmount: initialMultiplier[vendor].codAmount ?? 44,
          };
        } else {
          obj[vendor] = {
            multiplier: initialMultiplier[vendor] ?? 1.5,
            codAmount: 44,
          };
        }
      });
      return obj;
    }
    const obj = {};
    vendors.forEach((vendor) => {
      obj[vendor] = { multiplier: 1.5, codAmount: 44 };
    });
    return obj;
  });

  const updateSheet = async (user, xb, dl) => {
    const rateSheet = { xb: xb, dl: dl };
    try {
      await axiosInstance.put(`/users/${user._id}/rate-sheet`, { rateSheet });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleUpdateSheet = async (e) => {
    try {
      await updateSheet(user, xbRates, dlRates);
      setShowXBModal(false);
    } catch {
      console.log("error updating sheet");
    }
  };

  const handleSaveMultipliers = async () => {
    const updatedUser = {
      ...user,
      customerType: selectedCustomerType,
      multiplier: { ...customMultipliers },
    };
    console.log("Updated User:", updatedUser);
    await handleSave(updatedUser);
    setEditCalculation(false);
  };

  return (
    <>
      <Dialog open={showXBModal} onOpenChange={setShowXBModal}>
        <DialogContent className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh] ">
          <div className="flex gap-4">
            <h3 className="text-xl font-bold mb-6 text-center">
              Update Ratesheet
            </h3>
            <Button onClick={() => setEditCalculation(true)}>
              Edit Calculation
            </Button>
          </div>

          <form>
            <div className="space-y-1">
              {xbRates.map((row, idx) => {
                const isExpanded = expandedRows.includes(idx);
                return (
                  <div key={idx} className="border rounded-lg p-4 mb-4">
                    <div
                      className="flex items-center justify-between cursor-pointer select-none"
                      onClick={() =>
                        setExpandedRows((prev) =>
                          prev.includes(idx)
                            ? prev.filter((i) => i !== idx)
                            : [...prev, idx]
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                          {row.courier}
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-4">
                        {/* Nested rate fields */}
                        {[
                          "withinCity",
                          "withinState",
                          "regional",
                          "metroToMetro",
                          "neJkKlAn",
                          "restOfIndia",
                        ].map((region) => (
                          <div
                            key={region}
                            className="flex flex-wrap gap-2 mb-2 items-center"
                          >
                            <label className="font-medium w-32 capitalize">
                              {region.replace(/([A-Z])/g, " $1")}
                            </label>
                            {["fwd", "rto", "add"].map((field) => (
                              <div
                                key={field}
                                className="flex items-center gap-1"
                              >
                                <span className="text-xs">
                                  {field.toUpperCase()}
                                </span>
                                <input
                                  type="number"
                                  step="any"
                                  className="border rounded px-1 py-0.5 w-16"
                                  value={row[region][field]}
                                  onChange={(e) =>
                                    setXbRates((rates) =>
                                      rates.map((r, i) =>
                                        i === idx
                                          ? {
                                              ...r,
                                              [region]: {
                                                ...r[region],
                                                [field]: Number(e.target.value),
                                              },
                                            }
                                          : r
                                      )
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                        {/* COD fields */}
                        <div className="flex flex-wrap gap-2 mb-2 items-center">
                          <label className="font-medium w-32">COD Charge</label>
                          <input
                            type="number"
                            step="any"
                            className="border rounded px-1 py-0.5 w-24"
                            value={row.cod.charge}
                            onChange={(e) =>
                              setXbRates((rates) =>
                                rates.map((r, i) =>
                                  i === idx
                                    ? {
                                        ...r,
                                        cod: {
                                          ...r.cod,
                                          charge: Number(e.target.value),
                                        },
                                      }
                                    : r
                                )
                              )
                            }
                          />
                          <label className="font-medium w-32">COD %</label>
                          <input
                            type="text"
                            className="border rounded px-1 py-0.5 w-24"
                            value={row.cod.percent}
                            onChange={(e) =>
                              setXbRates((rates) =>
                                rates.map((r, i) =>
                                  i === idx
                                    ? {
                                        ...r,
                                        cod: {
                                          ...r.cod,
                                          percent: e.target.value,
                                        },
                                      }
                                    : r
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {dlRates.map((row, idx) => {
                const isExpanded = expandedRowsDL.includes(idx);
                return (
                  <div key={idx} className="border rounded-lg p-4 mb-4">
                    <div
                      className="flex items-center justify-between cursor-pointer select-none"
                      onClick={() =>
                        setExpandedRowsDL((prev) =>
                          prev.includes(idx)
                            ? prev.filter((i) => i !== idx)
                            : [...prev, idx]
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                          {row.courier}
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-4">
                        {/* Nested rate fields */}
                        {[
                          "withinCity",
                          "regional",
                          "metroToMetroA",
                          "metroToMetroB",
                          "restOfIndiaA",
                          "restOfIndiaB",
                          "zoneG",
                          "zoneH",
                        ].map((region) => (
                          <div
                            key={region}
                            className="flex flex-wrap gap-2 mb-2 items-center"
                          >
                            <label className="font-medium w-32 capitalize">
                              {region.replace(/([A-Z])/g, " $1")}
                            </label>
                            {row[region] &&
                              Object.keys(row[region]).map((field) => (
                                <div
                                  key={field}
                                  className="flex items-center gap-1"
                                >
                                  <span className="text-xs">
                                    {field.toUpperCase()}
                                  </span>
                                  <input
                                    type={
                                      typeof row[region][field] === "number"
                                        ? "number"
                                        : "text"
                                    }
                                    step="any"
                                    className="border rounded px-1 py-0.5 w-20"
                                    value={row[region][field]}
                                    onChange={(e) =>
                                      setDlRates((rates) =>
                                        rates.map((r, i) =>
                                          i === idx
                                            ? {
                                                ...r,
                                                [region]: {
                                                  ...r[region],
                                                  [field]:
                                                    typeof row[region][
                                                      field
                                                    ] === "number"
                                                      ? Number(e.target.value)
                                                      : e.target.value,
                                                },
                                              }
                                            : r
                                        )
                                      )
                                    }
                                  />
                                </div>
                              ))}
                          </div>
                        ))}
                        {/* COD fields */}
                        <div className="flex flex-wrap gap-2 mb-2 items-center">
                          <label className="font-medium w-32">COD Charge</label>
                          <input
                            type="number"
                            step="any"
                            className="border rounded px-1 py-0.5 w-24"
                            value={row.cod.charge}
                            onChange={(e) =>
                              setDlRates((rates) =>
                                rates.map((r, i) =>
                                  i === idx
                                    ? {
                                        ...r,
                                        cod: {
                                          ...r.cod,
                                          charge: Number(e.target.value),
                                        },
                                      }
                                    : r
                                )
                              )
                            }
                          />
                          <label className="font-medium w-32">COD %</label>
                          <input
                            type="text"
                            className="border rounded px-1 py-0.5 w-24"
                            value={row.cod.percent}
                            onChange={(e) =>
                              setDlRates((rates) =>
                                rates.map((r, i) =>
                                  i === idx
                                    ? {
                                        ...r,
                                        cod: {
                                          ...r.cod,
                                          percent: e.target.value,
                                        },
                                      }
                                    : r
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowXBModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateSheet}>Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={editCalculation} onOpenChange={setEditCalculation}>
        <DialogContent className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-6 text-center">
            Edit Customer Type
          </h3>
          <div className="w-full mb-6">
            <label
              htmlFor="customerType"
              className="block font-semibold font-medium mb-2 text-center"
            >
              Customer Type
            </label>
            <Select
              id="customerType"
              value={selectedCustomerType}
              onValueChange={setSelectedCustomerType}
              className="w-full"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Customer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedCustomerType === "custom" && (
            <div className="w-full mb-6">
              <div className="flex justify-between mr-5">
                <label className="block font-medium mb-2 text-center">
                  Vendor wise Rate
                </label>
                <div className="flex gap-10">
                  <label className="block font-medium mb-2 text-center">
                    Freight
                  </label>
                  <label className="block font-medium mb-2 text-center">
                    COD Amount
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {vendors.map((vendor, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2/5 text-sm truncate" title={vendor}>
                      {vendor}
                    </span>
                    <Input
                      type="number"
                      step="any"
                      value={customMultipliers[vendor]?.multiplier}
                      onChange={(e) =>
                        setCustomMultipliers((prev) => ({
                          ...prev,
                          [vendor]: {
                            ...prev[vendor],
                            multiplier: e.target.value,
                          },
                        }))
                      }
                      placeholder="Freight Multiplier"
                      className="w-1/4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Input
                      type="number"
                      step="any"
                      value={customMultipliers[vendor]?.codAmount}
                      onChange={(e) =>
                        setCustomMultipliers((prev) => ({
                          ...prev,
                          [vendor]: {
                            ...prev[vendor],
                            codAmount: e.target.value,
                          },
                        }))
                      }
                      placeholder="COD Amount"
                      className="w-1/4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-center gap-4 w-full">
            <Button
              variant="outline"
              onClick={() => setEditCalculation(false)}
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveMultipliers}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RateSheetModal;

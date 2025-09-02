"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { bronzeXB, bronzeDL, silverDL, silverXB, goldDL, goldXB, platDL, platXB } from "../users/constants";

const EditUser = ({ user = null, onClose, onSave, updateSheet }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      _id: user?._id || "",
      name: user?.name.trim() || "",
      email: user?.email || "",
      role: user?.role || "",
      customerType: user?.customerType || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });
  let initialDataXB, initialDataDL;

  if (user.customerType === 'bronze') {
    initialDataXB = bronzeXB;
    initialDataDL = bronzeDL;
  } else if (user.customerType === 'silver') {
    initialDataXB = silverXB
    initialDataDL = silverDL
  } else if (user.customerType === 'gold') {
    initialDataXB = goldXB
    initialDataDL = goldDL
  } else {
    initialDataXB = platXB
    initialDataDL = platDL
  }
  const [loading, setLoading] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState(50);
  const [selectedMultiplier, setSelectedMultiplier] = useState(1.5);

  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [emailOTP, setEmailOTP] = useState("");
  const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false);

  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [phoneOTP, setPhoneOTP] = useState("");
  const [isPhoneOtpVerified, setIsPhoneOtpVerified] = useState(false);

  const [showXBModal, setShowXBModal] = useState(false);
  const [xbRates, setXbRates] = useState(initialDataXB.map(obj => ({ ...obj, withinCity: { ...obj.withinCity }, withinState: { ...obj.withinState }, regional: { ...obj.regional }, metroToMetro: { ...obj.metroToMetro }, neJkKlAn: { ...obj.neJkKlAn }, restOfIndia: { ...obj.restOfIndia }, cod: { ...obj.cod } })));
  // --- End Xpressbees ratesheet modal state ---
  const [expandedRows, setExpandedRows] = useState([]);

  const [showDlModal, setShowDlModal] = useState(false);
  const [dlRates, setDlRates] = useState(initialDataDL.map(obj => ({ ...obj, withinCity: { ...obj.withinCity }, regional: { ...obj.regional }, metroToMetroA: { ...obj.metroToMetroA }, metroToMetroB: { ...obj.metroToMetroB }, restOfIndiaA: { ...obj.restOfIndiaA }, restOfIndiaB: { ...obj.restOfIndiaB }, zoneG: { ...obj.zoneG }, zoneH: { ...obj.zoneH },cod: { ...obj.cod } })));
  // --- End Xpressbees ratesheet modal state ---
  const [expandedRowsDL, setExpandedRowsDL] = useState([]);

  const { toast } = useToast();

  useEffect(() => {
    // Keep them in sync: If user types percentage, update multiplier
    const derived = options.find(
      (opt) => opt.percentage === Number(selectedPercentage)
    );
    if (derived && derived.multiplier !== selectedMultiplier) {
      setSelectedMultiplier(derived.multiplier);
    }
  }, [selectedPercentage]);

  useEffect(() => {
    // Keep them in sync: If user types multiplier, update percentage
    const derived = options.find(
      (opt) => opt.multiplier === Number(selectedMultiplier)
    );
    if (derived && derived.percentage !== selectedPercentage) {
      setSelectedPercentage(derived.percentage);
    }
  }, [selectedMultiplier]);

  const options = [
    { percentage: 50, multiplier: 1.5 },
    { percentage: 100, multiplier: 2 },
    { percentage: 150, multiplier: 2.5 },
  ];
  useEffect(() => {
    setValue("name", user?.name.trim());
    setValue("email", user?.email);
    setValue("phone", user?.phone);
    setValue("address", user?.address);
    setValue("role", user?.role);
    setValue("customerType", user?.customerType)
  }, [user, setValue]);

  const handleSave = async (data) => {
    if (!isEmailOtpVerified || !isPhoneOtpVerified) {
      toast.error("Please verify your email or phone before saving changes.");
      return;
    }
    console.log(data);
    setLoading(true);
    if (watch("customerType") === "custom") {
      data.percentage = selectedPercentage;
      data.multiplier = selectedMultiplier;
    }

    await onSave({ _id: user?._id, ...data });
    setLoading(false);
    onClose();
  };
  const handleSendEmailOTP = async () => {
    const email = watch("email");
    if (!email) {
      toast({
        title: "Missing Email",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/email-otp", { email });
      if (response.status === 200) {
        setIsEmailOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "OTP sent to your email successfully!",
        });
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    const email = watch("email");
    if (!emailOTP) {
      toast({
        title: "Missing OTP",
        description: "Please enter the OTP sent to your email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/verify-email-otp", {
        email,
        otp: emailOTP,
      });
      if (response.status === 200) {
        setIsEmailOtpVerified(true);
        setOtpVerified(true);
        toast({
          title: "OTP Verified",
          description: "Email OTP verified successfully!",
        });
      }
    } catch (error) {
      console.error("Error verifying email OTP:", error);
      toast({
        title: "Invalid OTP",
        description:
          error.response?.data?.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSendPhoneOTP = async () => {
    const phone = watch("phone"); // <-- get it from form
    if (!phone) {
      toast({
        title: "Missing Phone Number",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/phone-otp", { phone });
      if (response.status === 200) {
        setIsPhoneOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "OTP sent to your phone successfully!",
        });
      }
    } catch (error) {
      console.error("Error sending phone OTP:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyPhoneOTP = async () => {
    const phone = watch("phone"); // <-- get it from form
    if (!phoneOTP) {
      toast({
        title: "Missing OTP",
        description: "Please enter the phone OTP.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/verify-phone-otp", {
        phone,
        otp: phoneOTP,
      });
      if (response.status === 200) {
        setIsPhoneOtpVerified(true);
        toast({
          title: "Phone Verified",
          description: "Phone OTP verified successfully!",
        });
      }
    } catch (error) {
      console.error("Error verifying phone OTP:", error);
      toast({
        title: "Invalid OTP",
        description:
          error.response?.data?.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSheet = async (e) =>{
    e.preventDefault();
    await updateSheet(user, xbRates, dlRates);
    setShowXBModal(false);
  }


  return (
    <>
      <DialogContent className="bg-white rounded-3xl shadow px-4">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User Details" : "Add User"}</DialogTitle>
        </DialogHeader>
        {/* Xpressbees ratesheet update button (admin only) */}
        <div className="flex gap-4">
        <div className="mb-4">
          <Button variant="outline" onClick={() => setShowXBModal(true)}>
            Update Ratesheet
          </Button>
        </div>
        
        </div>

        {/* Xpressbees ratesheet modal */}

        <form onSubmit={handleSubmit(handleSave)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                {...register("name", {
                  required: "Name is required",
                  setValueAs: (value) => value.trim(),
                })}
                className="col-span-3"
              />
              {errors.name && (
                <p className="col-span-4 text-right text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="flex flex-row gap-2 items-center">
                <Input
                  id="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="min-w-60"
                  disabled={isEmailOtpSent}
                />
                <Button
                  className="h-fit w-fit  py-2 text-[12px] text-bold bg-primary text-white"
                  onClick={handleSendEmailOTP}
                  disabled={isEmailOtpSent || loading}
                  type="button"
                >
                  {loading && isEmailOtpSent ? (
                    <Loader2 className="h-4 w-2 animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
              {errors.email && (
                <p className="col-span-4 text-right text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
              {isEmailOtpSent && !isEmailOtpVerified && (
                <div className="fixed inset-0 z-[999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md space-y-4">
                    <button
                      className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl font-bold"
                      onClick={() => setIsEmailOtpSent(false)}
                    >
                      &times;
                    </button>
                    <Label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enter OTP
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="otp"
                        placeholder="Enter 4-digit OTP"
                        value={emailOTP}
                        onChange={(e) => setEmailOTP(e.target.value)}
                        disabled={isEmailOtpVerified}
                        className="flex-1 h-10"
                      />
                      <Button
                        className="h-10 bg-primary text-white"
                        onClick={handleVerifyEmailOTP}
                        disabled={isEmailOtpVerified || loading}
                        type="button"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Verify OTP"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                id="role"
                onValueChange={(value) => setValue("role", value)}
                defaultValue={user?.role || "Role"}
                className="col-span-3"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="col-span-4 text-right text-red-500 text-sm">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="customerType" className="text-right mt-2">
                Customer Type
              </Label>
              <div className="col-span-3 space-y-2">
                <Select
                  id="customerType"
                  onValueChange={(value) => setValue("customerType", value)}
                  defaultValue={user?.customerType || "bronze"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>

                {watch("customerType") === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="percentage"
                        className="text-sm font-medium mb-1 block"
                      >
                        Percentage (%)
                      </Label>
                      <Input
                        id="percentage"
                        type="number"
                        min="0"
                        step="1"
                        value={selectedPercentage}
                        onChange={(e) =>
                          setSelectedPercentage(Number(e.target.value))
                        }
                        placeholder="Enter Percentage"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="multiplier"
                        className="text-sm font-medium mb-1 block"
                      >
                        Multiplier (x)
                      </Label>
                      <Input
                        id="multiplier"
                        type="number"
                        min="0"
                        step="0.1"
                        value={selectedMultiplier}
                        onChange={(e) =>
                          setSelectedMultiplier(Number(e.target.value))
                        }
                        placeholder="Enter Multiplier"
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center  px-4 space-y-2">
              <Label htmlFor="phone" className="block font-medium">
                Phone No
              </Label>
              <div className="flex h-fit w-max items-center gap-2 mx-2">
                <Input
                  id="phone"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  })}
                  className="flex "
                  placeholder="Enter phone number"
                  disabled={isPhoneOtpSent}
                />
                <Button
                  className="h-fit w-fit mr-4 py-2 text-[12px] text-bold bg-primary text-white"
                  onClick={handleSendPhoneOTP}
                  disabled={isPhoneOtpSent || loading}
                  type="button"
                >
                  {loading && isPhoneOtpSent ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {isPhoneOtpSent && !isPhoneOtpVerified && (
              <div className="fixed inset-0 z-[999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md space-y-4">
                  <button
                    className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl font-bold"
                    onClick={() => setIsPhoneOtpSent(false)}
                  >
                    &times;
                  </button>             <Label htmlFor="phone-otp">Enter Phone OTP</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone-otp"
                      placeholder="Enter OTP"
                      value={phoneOTP}
                      onChange={(e) => setPhoneOTP(e.target.value)}
                      disabled={isPhoneOtpVerified}
                    />
                    <Button
                      className="h-8 bg-primary text-white"
                      onClick={handleVerifyPhoneOTP}
                      disabled={isPhoneOtpVerified || loading}
                      type="button"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              className="border-none"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white rounded-[10px]"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Details"}
            </Button>
          </div>
        </form>
      </DialogContent>
      <Dialog open={showXBModal} onOpenChange={setShowXBModal}>
        <DialogContent className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh] z-[9999]">
          <h3 className="text-xl font-bold mb-6 text-center">Update Xpressbees Ratesheet</h3>
          <form >
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
                        <span className="font-semibold text-lg">{row.courier}</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-4">
                        {/* Nested rate fields */}
                        {['withinCity', 'withinState', 'regional', 'metroToMetro', 'neJkKlAn', 'restOfIndia'].map(region => (
                          <div key={region} className="flex flex-wrap gap-2 mb-2 items-center">
                            <label className="font-medium w-32 capitalize">{region.replace(/([A-Z])/g, ' $1')}</label>
                            {['fwd', 'rto', 'add'].map(field => (
                              <div key={field} className="flex items-center gap-1">
                                <span className="text-xs">{field.toUpperCase()}</span>
                                <input
                                  type="number"
                                  step="any"
                                  className="border rounded px-1 py-0.5 w-16"
                                  value={row[region][field]}
                                  onChange={e => setXbRates(rates => rates.map((r, i) => i === idx ? { ...r, [region]: { ...r[region], [field]: Number(e.target.value) } } : r))}
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
                            step='any'
                            className="border rounded px-1 py-0.5 w-24"
                            value={row.cod.charge}
                            onChange={e => setXbRates(rates => rates.map((r, i) => i === idx ? { ...r, cod: { ...r.cod, charge: Number(e.target.value) } } : r))}
                          />
                          <label className="font-medium w-32">COD %</label>
                          <input
                            type="text"
                            className="border rounded px-1 py-0.5 w-24"
                            value={row.cod.percent}
                            onChange={e => setXbRates(rates => rates.map((r, i) => i === idx ? { ...r, cod: { ...r.cod, percent: e.target.value } } : r))}
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
                        <span className="font-semibold text-lg">{row.courier}</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-4">
                        {/* Nested rate fields */}
                        {['withinCity', 'regional', 'metroToMetroA', 'metroToMetroB', 'restOfIndiaA', 'restOfIndiaB', 'zoneG', 'zoneH'].map(region => (
                          <div key={region} className="flex flex-wrap gap-2 mb-2 items-center">
                            <label className="font-medium w-32 capitalize">{region.replace(/([A-Z])/g, ' $1')}</label>
                            {row[region] && Object.keys(row[region]).map(field => (
                              <div key={field} className="flex items-center gap-1">
                                <span className="text-xs">{field.toUpperCase()}</span>
                                <input
                                  type={typeof row[region][field] === "number" ? "number" : "text"}
                                  step="any"
                                  className="border rounded px-1 py-0.5 w-20"
                                  value={row[region][field]}
                                  onChange={e =>
                                    setDlRates(rates =>
                                      rates.map((r, i) =>
                                        i === idx
                                          ? {
                                              ...r,
                                              [region]: {
                                                ...r[region],
                                                [field]:
                                                  typeof row[region][field] === "number"
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
                            step='any'
                            className="border rounded px-1 py-0.5 w-24"
                            value={row.cod.charge}
                            onChange={e => setDlRates(rates => rates.map((r, i) => i === idx ? { ...r, cod: { ...r.cod, charge: Number(e.target.value) } } : r))}
                          />
                          <label className="font-medium w-32">COD %</label>
                          <input
                            type="text"
                            className="border rounded px-1 py-0.5 w-24"
                            value={row.cod.percent}
                            onChange={e => setDlRates(rates => rates.map((r, i) => i === idx ? { ...r, cod: { ...r.cod, percent: e.target.value } } : r))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" type="button" onClick={() => setShowXBModal(false)}>Cancel</Button>
              <Button onClick={handleUpdateSheet}>Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
    </>
  );
};

export default EditUser;

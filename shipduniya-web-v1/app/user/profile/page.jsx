"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import p1 from "../../../../assets/p1.docx";
// import p2 from "../../../../assets/p2.docx";
// import p3 from "../../../../assets/p3.docx";
import JSZip from "jszip";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  Check,
  CreditCard,
  Mail,
  MapPin,
  Pen,
  PenBox,
  Pencil,
  Phone,
  Plus,
  User,
  X,
} from "lucide-react";
import downloadAgreement from "./downloadAgreement";
import downloadTerms from "./downloadTerms";

const profileSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    address: z
      .string()
      .min(3, { message: "Address must be at least 3 characters" }),
    pincode: z
      .string()
      .min(6, { message: "Pincode must be at least 6 characters" }),

    aadharNumber: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .regex(/^\d{12}$/, { message: "Aadhar must be 12 digits" })
        .optional()
    ),

    panNumber: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, { message: "Invalid PAN format" })
        .optional()
    ),

    gstNumber: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/, {
          message: "Invalid GST format",
        })
        .optional()
    ),
    avatar: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.aadharNumber && !data.panNumber && !data.gstNumber) {
      const message = "At least one of Aadhar, PAN, or GST must be provided";
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["aadharNumber"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["panNumber"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["gstNumber"],
      });
    }
  });

const AccountSchema = z.object({
  accountHolderName: z.string().min(3),
  accountNumber: z.string().min(10),
  bankName: z.string().min(2),
  branchName: z.string().min(2),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/),
  accountType: z.enum(["savings", "current"]),
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [alert, setAlert] = useState(false);
  const [account, setAccount] = useState(null);
  const [activeAccountId, setActiveAccountId] = useState(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBankAccount, setEditingBankAccount] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // State to store the ID of the bank account to be deleted
  const [bankIdToDelete, setBankIdToDelete] = useState(null);
  const [hasActiveAccount, setHasActiveAccount] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleRowClick = (bank) => {
    setSelectedAccount(bank);
    setShowDialog(true);
  };

  const confirmActivation = async () => {
    if (selectedAccount) {
      try {
        await axiosInstance.put("/users/activebank", {
          bankId: selectedAccount._id,
        });
        await fetchProfileData(); // Refetch profile to update active account
        setHasActiveAccount(true);
        setAlert({
          type: "success",
          message: "Account activated successfully!",
        });
      } catch (error) {
        setAlert({ type: "error", message: error.message });
      }
      setShowDialog(false);
    }
  };

  const cancelActivation = () => {
    setSelectedAccount(null);
    setShowDialog(false);
  };

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      pincode: "",
      aadharNumber: "",
      panNumber: "",
      gstNumber: "",
      avatar: null,
    },
  });
  const accountForm = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
      ifscCode: "",
      accountType: "savings",
    },
  });

  const editAccountForm = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
      ifscCode: "",
      accountType: "savings",
    },
  });

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      setProfile(response.data);
      console.log("Profile date : ", response.data);
      console.log("avatar : ", response.data.avatar);
      // Check if there's an active account
      const activeAccount = response.data.bankDetails.find(
        (acc) => acc.isActive === "true"
      );
      setHasActiveAccount(!!activeAccount);
      if (activeAccount) {
        setActiveAccountId(activeAccount._id);
      }

      profileForm.reset({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address || "",
        pincode: response.data.pincode || "",
        aadharNumber: response.data.aadharNumber || "",
        panNumber: response.data.panNumber || "",
        gstNumber: response.data.gstNumber || "",
        avatar: response.data.avatar || null,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const onProfileSubmit = async (values) => {
    setIsUpdating(true);

    try {
      const formData = new FormData();

      // Append valid non-object fields or JSON-stringify objects
      for (const key in values) {
        const value = values[key];
        if (value !== undefined && value !== null) {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : value
          );
        }
      }

      // Append avatar if it's a valid File
      if (avatarFile instanceof File) {
        formData.append("avatar", avatarFile);
      }

      console.log("FormData contents:");
      console.log("avatarFile in onProfileSubmit:", avatarFile);
      console.log("FormData:");
      for (const [k, v] of formData.entries()) {
        console.log(k, v);
      }

      await axiosInstance.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({ type: "success", message: "Profile updated successfully!" });
      setIsEditing(false);
      await fetchProfileData(); // Refresh profile data
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Update failed." });
    } finally {
      setIsUpdating(false);
    }
  };

  const AddAnAccount = async (values) => {
    console.log("here is Values for form data :",values);
    setIsUpdating(true);
    try {
      await axiosInstance.post("/users/add-bank-account", values);
      setAlert({ type: "success", message: "Profile updated successfully!" });
      setIsEditing(false);
      fetchProfileData();
    } catch (error) {
      console.log("error for adding Account : ",error.message)
      setAlert({ type: "error", message: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchBankDetails = async () => {
    const ifsc = accountForm.watch("ifscCode");
    if (ifsc.length === 11) {
      try {
        const response = await fetch(
          `https://bank-apis.justinclicks.com/API/V1/IFSC/${ifsc}`
        );
        const data = await response.json();
        console.log(data);
        if (data && data.length > 0) {
          accountForm.setValue("bankName", data.BANK || "");
          accountForm.setValue(
            "branchName",
            data.BRANCH + " " + data.CENTRE || ""
          );
          setBankDetails(data);
          setActiveAccountId(data[0]._id);
        }
      } catch (error) {}
    }
  };
  useEffect(() => {
    fetchBankDetails();
  }, [accountForm.watch("ifscCode")]);


  const editAccountDetails = async (bankId, event) => {
    event.stopPropagation(); // Prevent row click

    try {
      // Find the bank account being edited
      const bankToEdit = profile.bankDetails.find(
        (bank) => bank._id === bankId
      );

      if (!bankToEdit) {
        setAlert({ type: "error", message: "Bank account not found" });
        return;
      }

      // Set the editing bank account
      setEditingBankAccount(bankToEdit);

      // Reset the form with the current bank details
      editAccountForm.reset({
        accountHolderName: bankToEdit.accountHolderName,
        accountNumber: bankToEdit.accountNumber,
        bankName: bankToEdit.bankName,
        branchName: bankToEdit.branchName,
        ifscCode: bankToEdit.ifscCode,
        accountType: bankToEdit.accountType,
      });

      // Open the edit modal
      setIsEditModalOpen(true);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load bank details" });
      console.error("Error preparing bank account edit:", err);
    }
  };

  // Add this function to handle the form submission
  const handleUpdateBankAccount = async (values) => {
    try {
      // Make the API call with the updated values
      await axiosInstance.put(`/users/bank-details/${editingBankAccount._id}`, {
        ...values,
      });

      // Show success message
      setAlert({
        type: "success",
        message: "Bank account updated successfully!",
      });

      // Close the modal
      setIsEditModalOpen(false);

      // Refresh the profile data
      await fetchProfileData();
    } catch (error) {
      // Show error message
      setAlert({
        type: "error",
        message:
          error.response?.data?.message || "Failed to update bank account",
      });
      console.error("Error updating bank account:", error);
    }
  };

  // Function to open the confirmation dialog
  const openDeleteDialog = (bankId, event) => {
    event.stopPropagation();
    setBankIdToDelete(bankId);
    setDeleteDialogOpen(true);
  };

  // Function to handle the actual deletion after confirmation
  const confirmDelete = async () => {
    if (!bankIdToDelete) return;

    try {
      await axiosInstance.delete(`/users/bank-account/${bankIdToDelete}`);
      setAlert({
        type: "success",
        message: "Bank account deleted successfully!",
      });
      await fetchProfileData();
      // Check if there are any active accounts after deletion
      const activeAccount = profile.bankDetails.find(
        (acc) => acc.isActive === "true" && acc._id !== bankIdToDelete
      );
      setHasActiveAccount(!!activeAccount);
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message || "Failed to delete bank account",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBankIdToDelete(null);
    }
  };

  useEffect(() => {
    if (profile?.avatar?.data?.data) {
      const byteArray = new Uint8Array(profile.avatar.data.data);
      const base64String = btoa(
        byteArray.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      const contentType = profile.avatar.contentType || "image/jpeg";
      const imageUrl = `data:${contentType};base64,${base64String}`;
      setAvatarUrl(imageUrl);
    }
  }, [profile]);

  if (loading) return <p>Loading profile...</p>;

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your account settings</CardDescription>
          </div>
          <div className="flex flex-col gap-1">
            <p
              className="text-xs cursor-pointer text-blue-500 font-bold"
              onClick={() =>
                downloadTerms()
              }
            >
              Download Terms and Conditions
            </p>
            <p
              className="text-xs cursor-pointer text-blue-500 font-bold"
              onClick={() =>
                downloadAgreement(profile.name || "User")
              }
            >
              Download Signed Agreement
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alert && <Alert type={alert.type}>{alert.message}</Alert>}
        {!hasActiveAccount && (
          <Alert type="warning" className="mb-4">
            Please add and activate at least one bank account to complete your
            profile.
          </Alert>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-8">
          <div className="bg-white rounded-lg shadow">
            {/* Personal Information */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Personal Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-md flex items-center"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <PenBox size={16} />
                      Edit Profile
                    </div>
                  )}
                </button>
              </div>

              {isEditing ? (
                <Form {...profileForm}>
                  <form
                    className="grid grid-cols-1 "
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  >
                    <div className="flex flex-wrap gap-20">
                      <div className="flex flex-col">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-red-500">
                                Name *
                              </FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone </FormLabel>
                              <FormControl>
                                <Input {...field} disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-red-500">
                                Email *
                              </FormLabel>
                              <FormControl>
                                <Input {...field} disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex flex-col">
                        <FormField
                          control={profileForm.control}
                          name="aadharNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Aadhar Number </FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="panNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-red-500">
                                PAN Number *{" "}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="gstNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GST Number</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-red-500">
                                Address *
                              </FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-red-500">
                                Pin Code *
                              </FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium text-gray-700">
                            Upload Avatar
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatarFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="col-span-full">
                          <button
                            type="submit"
                            className="mt-4 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Save Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="flex flex-row justify-evenly mr-48  items-start gap-6">
                  <div className="flex justify-center lg:justify-end w-full lg:w-auto">
                    <img
                      src={
                        avatarUrl ||
                        "https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg"
                      }
                      alt="User Avatar"
                      className="min-w-32 h-32 rounded-full object-cover border border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-500">
                        <User className="h-4 w-4 mr-2" />
                        Name
                      </label>
                      <p className="text-gray-900">{profile?.name}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </label>
                      <p className="text-gray-900">{profile.email}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-500">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Aadhar Number
                      </label>
                      <p className="text-gray-900">{profile.aadharNumber}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-500">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone
                      </label>
                      <p className="text-gray-900">{profile.phone}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        Address
                      </label>
                      <p className="text-gray-900">{profile.address}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        Pincode
                      </label>
                      <p className="text-gray-900">{profile.pincode}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        Pan Number
                      </label>
                      <p className="text-gray-900">{profile.panNumber}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-500">
                        <Building2 className="h-4 w-4 mr-2" />
                        GST Number
                      </label>
                      <p className="text-gray-900">{profile.gstNumber}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex">
          {/* Bank Accounts */}
          <div className="p-6 w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Bank Accounts <span className="text-red-500">*</span>
                </h2>
                <p className="text-sm text-gray-500">
                  At least one bank account is required and must be set as
                  active
                </p>
              </div>
              <button
                onClick={() => setIsAddingAccount(!isAddingAccount)}
                className="px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-500 hover:bg-blue-50 rounded-md flex items-center"
              >
                {isAddingAccount ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </>
                )}
              </button>
            </div>

            {isAddingAccount && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Add New Account
                </h3>

                <Form {...accountForm}>
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    onSubmit={accountForm.handleSubmit(AddAnAccount)}
                  >
                    <FormField
                      control={accountForm.control}
                      name="accountHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Holder Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accountForm.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accountForm.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accountForm.control}
                      name="branchName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accountForm.control}
                      name="ifscCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IFSC Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accountForm.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="savings">Savings</SelectItem>
                              <SelectItem value="current">Current</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-full">
                      <button
                        type="submit"
                        className="mt-4 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add Account
                      </button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {/* Available Accounts */}
            <div className="border-2 rounded-lg">
              <Table className="w-full border-collapse">
                {/* Table Header */}
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="px-4 py-4 text-left text-gray-700 font-medium">
                      Status
                    </TableHead>
                    <TableHead className="px-4 py-4 text-left text-gray-700 font-medium">
                      Account Holder
                    </TableHead>
                    <TableHead className="px-4 py-4 text-left text-gray-700 font-medium">
                      Account Number
                    </TableHead>
                    <TableHead className="px-4 py-4 text-left text-gray-700 font-medium">
                      Bank Name
                    </TableHead>
                    <TableHead className="px-4 py-4 text-left text-gray-700 font-medium">
                      Branch Name
                    </TableHead>
                    <TableHead className="px-4 py-4 text-left text-gray-700 font-medium">
                      IFSC Code
                    </TableHead>
                    <TableHead className="px-4 py-4 text-left text-gray-700 font-medium">
                      Account Type
                    </TableHead>
                    <TableHead className="px-4 py-4 text-left text-gray-700 font-medium">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="bg-white">
                  {profile.bankDetails.map((bank) => (
                    <TableRow
                      key={bank._id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        bank._id === activeAccountId ? "bg-blue-50" : ""
                      }`}
                    >
                      <TableCell
                        className="px-4 py-4"
                        onClick={() => handleRowClick(bank)}
                      >
                        {bank._id === activeAccountId && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-900">
                        {bank.accountHolderName}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-900">
                        {bank.accountNumber}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-900">
                        {bank.bankName}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-900">
                        {bank.branchName}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-900">
                        {bank.ifscCode}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-900 capitalize">
                        {bank.accountType}
                      </TableCell>
                      <TableCell className="flex justify-between items-center px-4 py-4 text-sm text-gray-900 capitalize">
                        <Button
                          className="mr-2"
                          onClick={(e) => editAccountDetails(bank._id, e)}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={(e) => openDeleteDialog(bank._id, e)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Edit Bank Account Modal */}
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Bank Account</DialogTitle>
                  </DialogHeader>

                  <Form {...editAccountForm}>
                    <form
                      onSubmit={editAccountForm.handleSubmit(
                        handleUpdateBankAccount
                      )}
                      className="space-y-4"
                    >
                      <FormField
                        control={editAccountForm.control}
                        name="accountHolderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Holder Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={editAccountForm.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={editAccountForm.control}
                        name="ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IFSC Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={editAccountForm.control}
                          name="bankName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bank Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={editAccountForm.control}
                          name="branchName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Branch Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={editAccountForm.control}
                        name="accountType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="savings">Savings</SelectItem>
                                <SelectItem value="current">Current</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Confirmation Delete Dialog */}
              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    Are you sure you want to delete this bank account?
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={confirmDelete}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Confirmation Dialog */}
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Account Activation</DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to activate the account:</p>
                  <div className="my-4">
                    <p className="font-semibold flex gap-6 mb-2">
                      Account Holder Name:
                      <span className="font-medium text-gray-500">
                        {selectedAccount?.accountHolderName}
                      </span>
                    </p>
                    <p className="font-semibold flex gap-8">
                      Account Number:
                      <span className="font-medium text-gray-500">
                        {selectedAccount?.accountNumber}
                      </span>
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={cancelActivation}>
                      No, Cancel
                    </Button>
                    <Button
                      className="border-2 border-primary text-blue-400 hover:text-white  hover:bg-blue-400"
                      onClick={confirmActivation}
                    >
                      Yes, Activate
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;

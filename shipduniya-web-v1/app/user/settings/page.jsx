"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeftCircle,
  BookOpen,
  HandIcon,
  Handshake,
  Pencil,
  Plus,
  Warehouse,
  X,
} from "lucide-react";
import axiosInstance from "@/utils/axios";
import ApiDoc from "../_components/ApiDoc";
import { toast } from "@/hooks/use-toast";

// Import a Modal/Dialog component (assuming you have one in your ui library)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useWatch } from "react-hook-form";
import ChannelPartnerApi from "../_components/ChannelPartnerApi";

// Warehouse Form Validation Schema
const warehouseFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(20, { message: "Name must be no more than 20 characters long" }),
    
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters long" })
    .max(100),
    
  pincode: z
    .string()
    .min(6, { message: "Pincode must be at least 6 characters long" })
    .regex(/^\d{6,}$/, { message: "Pincode must be numeric and at least 6 digits" }),
    
  capacity: z.coerce.number().min(1, { message: "Capacity must be greater than 0" }),
  
  managerName: z
    .string()
    .min(3, { message: "Manager's name must be at least 3 characters long" })
    .max(20, { message: "Manager's name  must be no more than 20 characters long" }),
  
  managerMobile: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
  
  status: z.enum(["operational", "under maintenance"]),
  city: z.string().optional(),
  state: z.string().optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
});


export default function Settings() {
  const [miniWareHouses, setMiniWareHouses] = useState([]);
  const [activeWarehouseId, setActiveWarehouseId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showWarehouse, setShowWarehouse] = useState(false);
  const [showApiDoc, setShowApiDoc] = useState(false);
  // New state for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);
  // New states for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState(null);
  const [WarehouseCity, setWarehouseCity] = useState(null);
  const [WarehouseState, setWarehouseState] = useState(null);
  const [showChannelPartner, setShowChannelPartner] = useState(false);
  // Fetch Warehouses API
  const fetchWareHouses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/warehouse");
      setMiniWareHouses(response.data.warehouses);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchWareHouses();
  }, []);

  // Form Handler
  const wareHouseForm = useForm({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: "",
      address: "",
      pincode: "",
      capacity: 0,
      managerName: "",
      managerMobile: "",
      status: "operational",
      city: "",
      state: "",
      gstNumber:"",
      panNumber:""
    },
  });

  // Handle form submission for create & update
  const onSubmit = async (data) => {
    setSubmitting(true);
    console.log("Data : ",data);
    try {
      if (isEditMode) {
        console.log("Data inside Edit Submission:",data);
        const response = await axiosInstance.put(
          `/warehouse/${currentWarehouse._id}`,
          data
        );
        console.log("Response of Update:",response);
        // toast.success("Warehouse updated successfully");
        fetchWareHouses();
      } else {
        // Create new warehouse
        const response = await axiosInstance.post("/warehouse", data);
        // toast.success("Warehouse created successfully");
        fetchWareHouses();
      }
      wareHouseForm.reset();
      setShowForm(false);
      // Reset edit mode
      setIsEditMode(false);
      setCurrentWarehouse(null);
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setSubmitting(false);
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


  const editWarehouse = async (id) => {
    const warehouse = miniWareHouses.find((wh) => wh._id === id);
    if (warehouse) {
      const { District, State } = await fetchLocation(warehouse.pincode);

      wareHouseForm.reset({
        name: warehouse.name,
        address: warehouse.address,
        pincode: warehouse.pincode,
        capacity: warehouse.capacity,
        managerName: warehouse.managerName,
        managerMobile: warehouse.managerMobile,
        status: warehouse.status,
        city: District || "",
        state: State || "",
        gstNumber:warehouse?.gstNumber,
       panNumber: warehouse?.panNumber
      });

      setCurrentWarehouse(warehouse);
      setIsEditMode(true);
      setShowForm(true);
    }
  };

  // Actual deletion function that calls the API
  const performDeleteWarehouse = async (id) => {
    try {
      await axiosInstance.delete(`/warehouse/${id}`);
      // toast.success("Warehouse deleted successfully");
      fetchWareHouses();
    } catch (e) {
      console.error("Error deleting warehouse", e);
    }
  };

  // Handle delete button click to show confirmation modal
  const handleDeleteClick = (id) => {
    setWarehouseToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm deletion from modal
  const confirmDelete = async () => {
    if (warehouseToDelete) {
      await performDeleteWarehouse(warehouseToDelete);
      setWarehouseToDelete(null);
      setShowDeleteModal(false);
    }
  };

  // Toggle form view for create mode (reset edit mode)
  const toggleForm = () => {
    // If switching to create mode, reset the form and edit mode
    if (showForm && isEditMode) {
      wareHouseForm.reset({
        name: "",
      address: "",
      pincode: "",
      capacity: 0,
      managerName: "",
      managerMobile: "",
      status: "operational",
      city: "",
      state: "",
      gstNumber:"",
      panNumber:""
      })
      setIsEditMode(false);
      setCurrentWarehouse(null)
    } 
    setShowForm((prev) => !prev);
  
};

  const watchedPincode = useWatch({
    control: wareHouseForm.control,
    name: "pincode",
  });
  useEffect(() => {
    if (isEditMode && currentWarehouse) {
      wareHouseForm.reset({
        name: currentWarehouse.name || "",
        address: currentWarehouse.address || "",
        pincode: currentWarehouse.pincode || "",
        capacity: currentWarehouse.capacity || 0,
        managerName: currentWarehouse.managerName || "",
        managerMobile: currentWarehouse.managerMobile || "",
        status: currentWarehouse.status || "operational",
        city: currentWarehouse.city || "",
        state: currentWarehouse.state || "",
        gstNumber: currentWarehouse.gstNumber || "",
        panNumber: currentWarehouse.panNumber || ""
      });
    }
  }, [isEditMode, currentWarehouse, wareHouseForm]);
  

  useEffect(() => {
    const fetchCityState = async () => {
      if (watchedPincode?.length === 6) {
        const { District, State } = await fetchLocation(watchedPincode);
        if (District && State) {
          wareHouseForm.setValue("city", District);
          wareHouseForm.setValue("state", State);
        }
      }
    };

    fetchCityState();
  }, [watchedPincode]);

  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!showWarehouse && !showApiDoc && !showChannelPartner && (
            <div className="flex justify-center gap-8">
              <button onClick={() => setShowWarehouse(true)}>
                <Card className="group relative overflow-hidden p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Warehouse className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center">
                      WareHouse
                    </h2>
                    <p className="text-muted-foreground text-center">
                      Manage your inventory and storage solutions
                    </p>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-600 rounded-xl transition-colors" />
                </Card>
              </button>
              <button className="p-4" onClick={() => setShowApiDoc(true)}>
                <Card className="group relative overflow-hidden p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center">
                      API Docs
                    </h2>
                    <p className="text-muted-foreground text-center">
                      Explore our API documentation and guides
                    </p>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-600 rounded-xl transition-colors" />
                </Card>
              </button>
               <button className="p-4" onClick={() => setShowChannelPartner(true)}>
                <Card className="group relative overflow-hidden p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Handshake className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center">
                      Channel Partner 
                    </h2>
                    <p className="text-muted-foreground text-center">
                      Access the API endpoints for managing channel partners
                    </p>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-600 rounded-xl transition-colors" />
                </Card>
              </button>
            </div>
          )}

          {showWarehouse && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Warehouse Management
                </h2>
                <button
                  onClick={toggleForm}
                  className="px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-md flex items-center"
                >
                  {showForm ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {isEditMode ? "Edit Warehouse" : "Create Warehouse"}
                    </>
                  )}
                </button>
              </div>

              {/* Form on Top of Table */}
              {showForm && (
                <div className="border shadow rounded-lg p-6 bg-white mb-6">
                  <h2 className="text-lg font-semibold mb-4 text-center">
                    {isEditMode ? "Edit Warehouse" : "Add New Warehouse"}
                  </h2>
                  <Form {...wareHouseForm}>
                    <form onSubmit={wareHouseForm.handleSubmit(onSubmit)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={wareHouseForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={wareHouseForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={wareHouseForm.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pincode</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={wareHouseForm.control}
                          name="capacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capacity</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value) || 0)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={wareHouseForm.control}
                          name="managerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Manager Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={wareHouseForm.control}
                          name="managerMobile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Manager Contact</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={wareHouseForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled
                                  placeholder="Auto-filled"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={wareHouseForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled
                                  placeholder="Auto-filled"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> <FormField
                        control={wareHouseForm.control}
                        name="gstNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gst Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> <FormField
                      control={wareHouseForm.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pan Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                      </div>
                      <Button
                        type="submit"
                     
                        className="mt-4"
                        disabled={submitting}
                      >
                        {submitting
                          ? "Submitting..."
                          : isEditMode
                          ? "Update Warehouse"
                          : "Create Warehouse"}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}


              {/* Warehouse Table */}
              <div className="border rounded-lg bg-white shadow p-4">
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Warehouse List
                </h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Pincode</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {miniWareHouses.map((warehouse) => (
                      <TableRow
                        key={warehouse._id}
                        className={`cursor-pointer ${
                          activeWarehouseId === warehouse._id
                            ? "bg-blue-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <TableCell>
                          {activeWarehouseId === warehouse._id && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              Active
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{warehouse.name}</TableCell>
                        <TableCell>{warehouse.address}</TableCell>
                        <TableCell>{warehouse.capacity}</TableCell>
                        <TableCell>{warehouse.pincode}</TableCell>
                        <TableCell>{warehouse.managerName}</TableCell>
                        <TableCell>
                          <Button
                            className="mr-2"
                            onClick={() => editWarehouse(warehouse._id)}
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(warehouse._id)}
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Delete Confirmation Modal */}
              <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this warehouse? This
                      action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => setShowDeleteModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={confirmDelete}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Back Button */}
              <Button
                variant="outline"
                className="mt-8 flex items-center"
                onClick={() => setShowWarehouse(false)}
              >
                <ArrowLeftCircle className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          )}
          {showApiDoc && <ApiDoc setShowApiDoc={setShowApiDoc} />}
          {showChannelPartner && <ChannelPartnerApi setShowChannelPartner={setShowChannelPartner} />}
        </div>
      </CardContent>
    </Card>
  );
}

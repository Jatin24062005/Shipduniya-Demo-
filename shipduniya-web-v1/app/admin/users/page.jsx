"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import EditUser from "../_components/EditUser";
import axiosInstance from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RateSheetModal from "./RateSheetModal";

const options = [
  { percentage: 50, multiplier: 1.5 },
  { percentage: 100, multiplier: 2 },
  { percentage: 150, multiplier: 2.5 },
];

// --- Xpressbees ratesheet data (copied from BronzeSheet.jsx) ---

// --- End Xpressbees ratesheet data ---

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addingUser, setAddingUser] = useState(false);
  const [customerFilter, setCustomerFilter] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openCustomerTypeDialog, setOpenCustomerTypeDialog] = useState(null);
  const [selectedCustomerType, setSelectedCustomerType] = useState("");

  // Synced states for custom percentage and multiplier
  const [selectedPercentage, setSelectedPercentage] = useState(0);
  const [selectedMultiplier, setSelectedMultiplier] = useState(1);
  const [showRateModal, setShowRateModal] = useState(false);

  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  // Sync multiplier when percentage changes
  useEffect(() => {
    const derived = options.find(
      (opt) => opt.percentage === Number(selectedPercentage)
    );
    if (derived && derived.multiplier !== selectedMultiplier) {
      setSelectedMultiplier(derived.multiplier);
    }
  }, [selectedPercentage]);

  // Sync percentage when multiplier changes
  useEffect(() => {
    const derived = options.find(
      (opt) => opt.multiplier === Number(selectedMultiplier)
    );
    if (derived && derived.percentage !== selectedPercentage) {
      setSelectedPercentage(derived.percentage);
    }
  }, [selectedMultiplier]);

  const [editingCustomerTypeUser, setEditingCustomerTypeUser] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  const handleEdit = (user) => setEditingUser(user);

  const handleSave = async (updatedUser) => {
    try {
      await axiosInstance.patch(`/admin/users/${updatedUser._id}`, updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );
      setEditingUser(null);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      await axiosInstance.post("/admin/user", newUser);
      setUsers((prev) => [...prev, newUser]);
      setAddingUser(false);
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await axiosInstance.delete(`/admin/user/${id}`);
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm("Delete selected users?")) {
      try {
        await Promise.all(
          selectedUsers.map((id) => axiosInstance.delete(`/admin/user/${id}`))
        );
        setSelectedUsers([]);
        fetchUsers();
      } catch (err) {
        console.error("Bulk delete error:", err);
      }
    }
  };

  const handleSetCustomerType = async (type) => {
    try {
      await Promise.all(
        selectedUsers.map((id) =>
          axiosInstance.patch(`/admin/users/${id}`, { customerType: type })
        )
      );
      fetchUsers();
    } catch (err) {
      console.error("Bulk customer type error:", err);
    }
  };

  const handleBlockUnblock = async () => {
    if (window.confirm("Block/Unblock selected accounts?")) {
      try {
        await Promise.all(
          selectedUsers.map((id) =>
            axiosInstance.patch(`/admin/users/${id}`, { blocked: true })
          )
        );
        fetchUsers();
      } catch (err) {
        console.error("Block/Unblock error:", err);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const createdAt = new Date(user.createdAt);
    const matchesDate =
      createdAt >= dateRange.from && createdAt <= dateRange.to;
    const matchesCustomer =
      !customerFilter || user.customerType?.toLowerCase() === customerFilter;
    const matchesUserType =
      !userTypeFilter || user.userType?.toLowerCase() === userTypeFilter;
    return matchesDate && matchesCustomer && matchesUserType;
  });

  // --- Xpressbees ratesheet modal state ---



  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <Button onClick={() => setAddingUser(true)}>+ Add User</Button>
      </div>


      <div className="flex justify-between mb-3">
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>

      <div className="flex justify-between mb-3">
        <div className="flex gap-2">
          {["All", "Bronze", "Gold", "Diamond", "Silver", "Custom"].map(
            (type) => (
              <Button
                key={type}
                variant={
                  customerFilter === type.toLowerCase() ||
                    (type === "All" && !customerFilter)
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setCustomerFilter(type === "All" ? "" : type.toLowerCase())
                }
              >
                {type}
              </Button>
            )
          )}
        </div>
        <div className="flex gap-2">
          {[
            { label: "All", value: "" },
            { label: "Warehouse Pickup", value: "wp" },
            { label: "Direct Pickup", value: "dp" },
            { label: "Deleted", value: "d" },
          ].map(({ label, value }) => (
            <Button
              key={label}
              variant={userTypeFilter === value ? "default" : "outline"}
              onClick={() => setUserTypeFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="flex mt-4 gap-3 mb-4">
          <Button onClick={() => setOpenCustomerTypeDialog(true)}>
            Customer Type
          </Button>

          <Button variant="destructive" onClick={handleBulkDelete}>
            Delete
          </Button>
          <Button onClick={handleBlockUnblock}>Block / Unblock</Button>
        </div>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedUsers(
                      e.target.checked ? filteredUsers.map((u) => u._id) : []
                    )
                  }
                  checked={
                    filteredUsers.length > 0 &&
                    selectedUsers.length === filteredUsers.length
                  }
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Mobile</TableHead>
              <TableHead className="hidden md:table-cell">
                Customer Type
              </TableHead>
              <TableHead className="hidden md:table-cell">User Type</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={(e) => {
                      setSelectedUsers((prev) =>
                        e.target.checked
                          ? [...prev, user._id]
                          : prev.filter((id) => id !== user._id)
                      );
                    }}
                  />
                </TableCell>
                <TableCell>{user._id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell className="hidden md:table-cell">{user.phone || "123"}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    {user.customerType || "Bronze"}
                    <button
                      onClick={() => {
                        setEditingCustomerTypeUser(user);
                        setShowRateModal(true);
                      }}
                      className="ml-1"
                      title="Edit Customer Type"
                    >
                      <EditIcon className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.userType === "wp"
                    ? "Warehouse Pickup"
                    : user.userType === "dp"
                      ? "Direct Pickup"
                      : user.userType}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="export"
                    onClick={() => handleEdit(user)}
                  >
                    <EditIcon className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <button
                    className="rounded bg-red-500 px-2 text-white hover:bg-red-600"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {showRateModal && <RateSheetModal showXBModal={showRateModal} setShowXBModal={setShowRateModal} user={editingCustomerTypeUser} handleSave={handleSave} />}

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        {editingUser && (
          <EditUser
            user={editingUser}
            onSave={handleSave}
            onClose={() => setEditingUser(null)}
          />
        )}
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addingUser} onOpenChange={() => setAddingUser(false)}>
        {addingUser && (
          <EditUser onSave={handleAddUser} onClose={() => setAddingUser(false)} />
        )}
      </Dialog>
    </div>
  );
};

export default UserDetails;

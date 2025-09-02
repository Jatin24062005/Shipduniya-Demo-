import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Item } from "@radix-ui/react-select";


const ApprovalPendingTable = ({data, actionLoading, onAdminClick }) => {
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [expandedSellers, setExpandedSellers] = useState({});
  const [cityStateMap, setCityStateMap] = useState({});




  const toggleSeller = (sellerIndex) => {
    setExpandedSellers((prev) => ({
      ...prev,
      [sellerIndex]: !prev[sellerIndex],
    }));
  };
  
  const fetchCityState = async () => {
    const pincodes = Array.from(
      new Set(
        data
          .map((d) => d.adminInfo?.pincode)
          .filter((p) => p && p.length === 6 && !cityStateMap[p])
      )
    );

    const results = await Promise.all(
      pincodes.map(async (pincode) => {
        try {
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`
          );
          const json = await res.json();
          const loc = json?.[0]?.PostOffice?.[0];
         
          return [pincode, loc ? `${loc.District}, ${loc.State}` : "-"];
        } catch {
          return [pincode, "-"];
        }
      })
    );

    setCityStateMap((prev) =>
      Object.fromEntries([...Object.entries(prev), ...results])
    );
  };
   useEffect(() => {
      if (data.length) fetchCityState();
    }, [data]);



  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        All Approval Pending
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S. No</TableHead>
            <TableHead>Admin ID</TableHead>
            <TableHead>Admin Name</TableHead>
            <TableHead>City & State</TableHead>
            <TableHead>Pincode</TableHead>
            <TableHead>Total Users</TableHead>
            <TableHead>Total Users COD</TableHead> 
          </TableRow>
        </TableHeader>
        <TableBody>
  {data.map((admin, i) => {
   
    const City_State = admin.city || (cityStateMap && cityStateMap[admin?.adminInfo?.pincode]) || "Unknown";

    return (
      <TableRow key={admin.adminId || i} className="hover:bg-gray-50">
        <TableCell>{i + 1}</TableCell>
        <TableCell>
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => onAdminClick(admin.adminId)}
          >
            {admin.adminId}
          </span>
        </TableCell>
        <TableCell>{admin?.adminInfo?.name }</TableCell>
        <TableCell>{City_State}</TableCell>
        <TableCell>{admin.adminInfo?.pincode}</TableCell>
        <TableCell>{admin.totalUser || 0}</TableCell>
        <TableCell>{admin.totalUsersCOD || 0}</TableCell>
      </TableRow>
    );
  })}
</TableBody>

      </Table>
    </div>
  );
};

export default ApprovalPendingTable;

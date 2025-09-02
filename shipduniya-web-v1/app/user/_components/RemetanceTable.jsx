import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const RemetanceTable = ({
  Remittances,
  viewDetails,
  dateRange,
  shippingPartner,
}) => {
  const filteredRemittances = Array.isArray(Remittances)
    ? Remittances.filter((remittance) => {
        const remittanceDate = new Date(remittance.createdAt);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);

        const matchesDateRange =
          remittanceDate >= fromDate && remittanceDate <= toDate;

        const matchesPartnerType =
          shippingPartner === "All"
            ? true
            : remittance.courier?.toLowerCase().includes(shippingPartner.toLowerCase());

        return matchesDateRange && matchesPartnerType;
      })
    : [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">#</TableHead>
          <TableHead className="text-left">AWB Number</TableHead>
          <TableHead className="text-left">Order ID</TableHead>
          <TableHead className="text-left">Courier</TableHead>
          <TableHead className="text-left">COD Amount</TableHead>
          <TableHead className="text-left">Paid Amount</TableHead>
          <TableHead className="text-left">Status</TableHead>
          <TableHead className="text-left">Created At</TableHead>
          <TableHead className="text-left">Download</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredRemittances.map((remittance, index) => (
          <TableRow key={remittance._id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{remittance.awbNumber || "—"}</TableCell>
            <TableCell>{remittance.orderId || "—"}</TableCell>
            <TableCell>{remittance.courier || "—"}</TableCell>
            <TableCell>₹{remittance.codAmount?.toFixed(2) || "0.00"}</TableCell>
            <TableCell>₹{ remittance.status === "paid"? remittance.codAmount?.toFixed(2):remittance.paidAmount?.toFixed(2) || "0.00"}</TableCell>
            <TableCell>
              <Button
                className={`text-xs px-3 py-1 text-white ${
                  remittance.status === "paid"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              >
                <Clock className="mr-1 h-4 w-4" />
                {remittance.status || "Pending"}
              </Button>
            </TableCell>
            <TableCell>
              {remittance.createdAt
                ? new Date(remittance.createdAt).toLocaleDateString()
                : "—"}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                className="text-xs border border-gray-400"
              >
                Download
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RemetanceTable;

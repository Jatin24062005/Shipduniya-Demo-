"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";


const DetailsExtraWeight = ({ admin, onBack ,fetchdata}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([admin]);
  const [selecetedDispute ,setSelectedDispute] = useState(null)
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
  const [selectedDisputeIds,setSelectedDisputeIds]  = useState(null)

  const [loading, setLoading] = useState({ resolve: false, reject: false });

  const { toast } = useToast()


// Example: when user clicks "View"
const handleOpenDispute = (dispute) => {
  setSelectedDispute(dispute);
  setIsDisputeDialogOpen(true);
};


  const toggleRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === data.length ? [] : data.map((item) => item?._id)
    );
  };

  // ✅ Bulk Resolve
  const handleBulkResolve = async () => {
    if (selectedRows.length === 0) return;
    try {
      setLoading((prev) => ({ ...prev, resolve: true }));
      await axiosInstance.post("/weightReconciliation/resolve-action", {
        weightReconciliationIds: selectedRows,
      });
      console.log("Successfully Bulk Resolve!");
      toast({
        title: "Success",
        description: "Action completed successfully",
      });
      await fetchdata(); 
      setSelectedRows([]); // clear selection
    } catch (error) {
      console.log("Failed to resolve", error.message);
      toast({ title: `Failed to Resolve Dispute`,description: error.message, variant: "destructive" });

    } finally {
      setLoading((prev) => ({ ...prev, resolve: false }));
    }
  };

  // ✅ Bulk Reject
  const handleBulkReject = async () => {
    if (selectedRows.length === 0) return;
    try {
      setLoading((prev) => ({ ...prev, reject: true }));
      await axiosInstance.post("/weightReconciliation/reject-action", {
        weightReconciliationIds: selectedRows,
      });
      console.log("Successfully Bulk Reject!");
      toast({
        title: "Success",
        description: "Reject Action completed successfully",
      });
      await fetchdata(); // ✅ Auto refresh
      setSelectedRows([]); // clear selection
    } catch (error) {
      console.log("Failed to reject", error.message);
      toast({ title: `Failed to Reject Dispute`,description: error.message, variant: "destructive" });

    } finally {
      setLoading((prev) => ({ ...prev, reject: false }));
    }
  };
  
  return (
    <Card className="w-full">
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Extra-Weight Reconciliation</h2>
          <Button variant="outline" className="text-sm" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>

      <CardContent>
        <Tabs defaultValue="extraweight" className="w-full my-4" >
          <div className="flex justify-center mt-6 w-full">
            <TabsList className="flex gap-4 bg-white/20 backdrop-blur-md shadow-md mb-9 border-slate-800">
              <TabsTrigger
                value="extraweight"
                className="w-[200px] text-center data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Weight Reconciliation
              </TabsTrigger>
              <TabsTrigger
                value="dispute"
                className="w-[200px] text-center data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                All Dispute
              </TabsTrigger>
              <TabsTrigger
                value="paid"
                className="w-[200px] text-center data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: ExtraWeight Reconciliation */}
          <TabsContent value="extraweight">
  <Table>
    {/* Table header only once */}
    <TableHeader>
      <TableRow>
        <TableHead>
          <input type="checkbox" />
        </TableHead>
        <TableHead>Captured Date</TableHead>
        <TableHead>AWB Number</TableHead>
        <TableHead>Order ID</TableHead>
        <TableHead>Entered Weight</TableHead>
        <TableHead>Captured Weight</TableHead>
        <TableHead>Weight Charges</TableHead>
        <TableHead>Product</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Action / Dates</TableHead>
      </TableRow>
    </TableHeader>

    {/* Table body with mapped rows */}
    <TableBody>
      {(admin?.details).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt))?.map((item, index) => (
        <TableRow key={index}>
          <TableCell>
            <input type="checkbox" />
          </TableCell>
          <TableCell>
            {item.createdAt 
              ? new Date(item.createdAt).toLocaleDateString()
              : "-"}
          </TableCell>
          <TableCell>{item.awbNumber}</TableCell>
          <TableCell>{item.orderId}</TableCell>
          <TableCell>
            Deadweight: {item.enteredWeight.deadWeight} <br />
            L×B×H: {item.enteredWeight.length}×{item.enteredWeight.breadth}×{item.enteredWeight.height} <br />
            Volumetric: {item.enteredWeight.volumetricWeight}
          </TableCell>
          <TableCell>{item.appliedWeight}</TableCell>
          <TableCell>
            Forward: {item.partnerDetails.charges} <br />
            Charged Slab Rate: {item?.ExtraWeightCharges || 200}
          </TableCell>
          <TableCell className="max-w-28">{item.product}</TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCell>
            {item.deliveryDate &&
              `Delivered: ${new Date(item.deliveryDate).toLocaleDateString()}` || item.action}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TabsContent>


<TabsContent value="dispute">
{selectedRows.length > 0 && (
  <div className="flex justify-end w-full mb-4">
    <div className="flex space-x-2">
      <Button
        variant="success"
        size="sm"
        className="bg-slate-200 border border-2"
        disabled={loading.resolve}
        onClick={handleBulkResolve}
      >
        {loading.resolve ? "Resolving..." : "Bulk Resolve"}
      </Button>

      <Button
        variant="destructive"
        size="sm"
        disabled={loading.reject}
        onClick={handleBulkReject}
      >
        {loading.reject ? "Rejecting..." : "Bulk Reject"}
      </Button>
    </div>
  </div>
)}

  <Table>
    <TableHeader>
      <TableRow>
        <TableHead> <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={
              selectedRows.length > 0 &&
              selectedRows.length ===
                admin?.details?.filter((i) => i.status === "dispute").length
            }
          /></TableHead>
        <TableHead>Captured Date</TableHead>
        <TableHead>AWB</TableHead>
        <TableHead>Order ID</TableHead>
        <TableHead>Entered Weight</TableHead>
        <TableHead>Captured Weight</TableHead>
        <TableHead>Weight Charges</TableHead>
        <TableHead>Product</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Details</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {(admin?.details || []).filter((item)=> item.status === "dispute").map((item, idx) => (
        <TableRow key={idx}>
          <TableCell> <input
                type="checkbox"
                checked={selectedRows.includes(item._id)}
                onChange={() => handleSelect(item._id)}
              /></TableCell>
          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
          <TableCell>{item.awbNumber}</TableCell>
          <TableCell>{item.orderId}</TableCell>
          <TableCell>
            Deadweight: {item.enteredWeight.deadWeight} <br />
            L×B×H: {item.enteredWeight.length}×{item.enteredWeight.breadth}×{item.enteredWeight.height} <br />
            Volumetric: {item.enteredWeight.volumetricWeight}
          </TableCell>
          <TableCell>{item.appliedWeight}</TableCell>
          <TableCell>
            Forward: {item.partnerDetails?.charges} <br />
            Charged Slab Rate: {item.ExtraWeightCharges}
          </TableCell>
          <TableCell className="max-w-28">{item.product}</TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCell>
              <Button variant="outline" size="sm" onClick ={()=> handleOpenDispute(item)}>
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
              {selecetedDispute && (
  <Dialog open={isDisputeDialogOpen} onOpenChange={setIsDisputeDialogOpen}>                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Actions - Related</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p><b>Action Date:</b> {item.actionDate && new Date(item.actionDate).toLocaleString()}</p>
                      <p><b>AWB:</b> {item.awbNumber}</p>
                      <p><b>Remarks:</b> {item.remark}</p>
                      {item.Image && (
                        <img src={item.Image} alt="Proof" className="max-w-full rounded border" />
                      )}
                    </div>
                  </DialogContent>
                  </Dialog>
              )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TabsContent>


          <TabsContent value="paid">
          <Table>
    {/* Table header only once */}
    <TableHeader>
      <TableRow>
     
        <TableHead>Captured Date</TableHead>
        <TableHead>AWB Number</TableHead>
        <TableHead>Order ID</TableHead>
        <TableHead>Entered Weight</TableHead>
        <TableHead>Captured Weight</TableHead>
        <TableHead>Weight Charges</TableHead>
        <TableHead>Product</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Action / Dates</TableHead>
      </TableRow>
    </TableHeader>

    {/* Table body with mapped rows */}
    <TableBody>
      {(admin?.details).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt))?.map((item, index) => (
        <TableRow key={index}>
        
          <TableCell>
            {item.createdAt 
              ? new Date(item.createdAt).toLocaleDateString()
              : "-"}
          </TableCell>
          <TableCell>{item.awbNumber}</TableCell>
          <TableCell>{item.orderId}</TableCell>
          <TableCell>
            Deadweight: {item.enteredWeight.deadWeight} <br />
            L×B×H: {item.enteredWeight.length}×{item.enteredWeight.breadth}×{item.enteredWeight.height} <br />
            Volumetric: {item.enteredWeight.volumetricWeight}
          </TableCell>
          <TableCell>{item.appliedWeight}</TableCell>
          <TableCell>
            Forward: {item.partnerDetails.charges} <br />
            Charged Slab Rate: {item?.ExtraWeightCharges || 200}
          </TableCell>
          <TableCell className="max-w-28">{item.product}</TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCell>
            {item.deliveryDate &&
              `Delivered: ${new Date(item.deliveryDate).toLocaleDateString()}` || item.action}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailsExtraWeight;

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Download, Upload, PlusCircle, FileUp } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DetailsExtraWeight from "../_components/viewDetailsExtraWeight"
import axiosInstance from "@/utils/axios"
import ExcelJS from "exceljs";
import { useToast } from "@/hooks/use-toast"


export default function WeightReconciliation() {
  const [awbNumber, setAwbNumber] = useState("")
  const [appliedWeight, setAppliedWeight] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  const [viewDetailExtraWeight,setViewDetailsExtraWeight] = useState(false)
  const {toast} = useToast()
  const [data,setData] = useState(null);
  const [selectedData , setSelectedData] = useState()
  const [loading,setLoading] = useState()


  const fetchExtraWeightData = async ()=>{
    try {
      const res = await axiosInstance.get("/weightReconciliation/get-weight-reconciliation-for-admin");
      console.log("Response From ExtraWeight Reconciliation for Admin : ",res.data)
      setData(res.data.data)

    } catch (error) {
      
      console.log("Failed to Fetch Extra Wieght reconciliation table Data : ",error.message);
    } 
  }

  const handleClickSellerId = async (data) =>{
 
    setSelectedData(data);
    console.log(data)
   setViewDetailsExtraWeight(true);
  }


  const handleAddSubmit = async (e) => {
    e.preventDefault()
    console.log("Add:", { awbNumber, appliedWeight })
    if(loading) return

    setLoading(true)
    try {
        const response = await axiosInstance.post("/weightReconciliation/extra-weight-reconciliation",{
            awbNumber,
            appliedWeight
        })

        console.log("Successfully Made Extra Weight Reconciliation : ",response.data)
      toast({ title: "Extra Weight Reconciliation", description: `Transaction Created Successfully` });
    fetchExtraWeightData();
        
        
    } catch (error) {
        console.error("Failed Submit ExtraWeightReconciliation : ",error.message)
        toast({ title: `Failed Submit ExtraWeight`,description: error.message, variant: "destructive" });

    }finally{
      setLoading(false);
    setIsAddOpen(false)
    
  }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])

  }

  const handleUpload = async() => {
    if (!file) {
      setError("Please select a file before uploading.")
      return
    }

    if(loading) return;

    setLoading(true);
    try {

      
    const formData = new FormData();
    formData.append("file", file);
    
      setError("")
      const response = await axiosInstance.post(
        "/weightReconciliation/extra-weight-reconciliation-bulk",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("File uploaded successfully!")
      console.log("Bulk Upload File:", response.data)
      fetchExtraWeightData();
      setIsBulkOpen(false)
      
    } catch (error) {
       console.log("Failed to Bulk Extra weight Reconciliation : ",error.message)
       toast({ title: `Failed Submit ExtraWeight`,description: error.message, variant: "destructive" });

    }finally{
      setLoading(false)
    }
  
  }
  const handleDownloadSchema = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bulk Weight Reconciliation Schema");
  
    const headings = [
      "Applied Date",
      "Courier",
      "AWB Number*",
      "Order Id",
      "Dead Weight",
      "Package Length",
      "Package Breadth",
      "Package Height",
      "Volumetric Weight",
      "Booking Slab",
      "Applied Weight*",
      "Forward Charges",
      "Extra Weight Charges",
      "RTO Charges",
      "Extra Weight Charge (Yes/No)",
      "Product Name",
      "Product SKU",
      "Product Quantity",
      "Status",
      "Images",
    ];
  
    const example1 = [
      "",                // Applied Date
      "",                // Courier
      "1435612345678",   // AWB Number (example)
      "", "", "", "", "", "", "", 
      "20000",           // Applied Weight (example)
      "", "", "", "", "", "", "", ""
    ];
  
    const example2 = [
      "",                // Applied Date
      "",                // Courier
      "1752345678",      // AWB Number (example)
      "", "", "", "", "", "", "", 
      "8000",            // Applied Weight (example)
      "", "", "", "", "", "", "", ""
    ];
  
    // Add heading row
    const headingRow = worksheet.addRow(headings);
  
    // Style headings
    headingRow.eachCell((cell) => {
      const isImportant =
        cell.value === "AWB Number*" || cell.value === "Applied Weight*";
  
      cell.font = {
        bold: true,
        color: { argb: isImportant ? "FFFF0000" : "FFFFFFFF" }, // red if important, white otherwise
      };
  
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isImportant ? "FFC7CE" : "4472C4" }, // light red for important, blue for others
      };
  
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  
    // Add example rows
    worksheet.addRow(example1);
    worksheet.addRow(example2);
  
    // Auto width
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) maxLength = columnLength;
      });
      column.width = maxLength < 15 ? 15 : maxLength + 2;
    });
  
    // Set heading row height
    headingRow.height = 25;
  
    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Bulk weight Dispute Schema.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  useEffect(()=>{
fetchExtraWeightData()
  },[])

  if(viewDetailExtraWeight){
    return(
        <DetailsExtraWeight admin={selectedData} onBack={() => setViewDetailsExtraWeight(false)} fetchdata={fetchExtraWeightData}/>
    )
  }


  return (
    <Card className="w-full h-full min-h-fit">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <CardTitle className="text-xl">Extra Weight Reconciliation</CardTitle>
          <CardDescription>
            Manage extra weight reconciliation entries and bulk uploads
          </CardDescription>
        </div>
        <div className="flex gap-3">
          {/* Add Extra Weight Button */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <button
                className={`text-sm flex w-fit font-semibold px-4 py-4 rounded-lg border border-primary text-primary `}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Extra Weight
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Add Extra Weight Reconciliation
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Enter the AWB number and applied weight to add a reconciliation entry.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="awbNumber" className="w-32 text-right font-medium whitespace-nowrap">
                    AWB Number
                  </Label>
                  <Input
                    id="awbNumber"
                    value={awbNumber}
                    onChange={(e) => setAwbNumber(e.target.value)}
                    placeholder="e.g. 1234567890"
                    required
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Label htmlFor="appliedWeight" className="w-32 text-right font-medium whitespace-nowrap">
                    Applied Weight
                  </Label>
                  <Input
                    id="appliedWeight"
                    type="number"
                    min="0"
                    step="0.01"
                    value={appliedWeight}
                    onChange={(e) => setAppliedWeight(e.target.value)}
                    placeholder="Weight in grams"
                    required
                    className="flex-1"
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto">
                    {loading ? "Saving...": "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Bulk Upload Button */}
          <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
            <DialogTrigger asChild>
              <button
                className={`text-sm flex w-fit font-semibold px-4 py-4 rounded-lg border border-pink-500 text-pink-400 `}
              >
                <FileUp className="mr-2 h-5 w-5" />
                Bulk Upload
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Bulk Upload</DialogTitle>
                <DialogDescription>
                  Upload your Excel file for bulk data import or download the required schema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="excel-file" className="text-right">
                    Excel File
                  </Label>
                  <Input
                    id="excel-file"
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="col-span-3"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert variant="default" className="border-green-500 text-green-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between gap-2">
                  <Button variant="outline" onClick={()=>handleDownloadSchema()} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Schema
                  </Button>
                  <Button onClick={handleUpload} className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    {loading ? "Uploading...": "Upload"}

                  </Button>
                </div>
              </div>
              <DialogFooter />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">S.No</TableHead>
              <TableHead className="text-center">Seller ID</TableHead>
              <TableHead className="text-center">Seller Name</TableHead>
              <TableHead className="text-center">Total AWB</TableHead>
              <TableHead className="text-center">Total Dispute AWB</TableHead>
              <TableHead className="text-center">Total Extra Weight (kg)</TableHead>
              <TableHead className="text-center">Total Extra Charges (Rs)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow key={row.sellerId}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-blue-500 cursor-pointer text-center hover:underline" onClick={()=>handleClickSellerId(row)}>{row.seller._id}</TableCell>
                <TableCell className="text-center">{row.seller.name}</TableCell>
                <TableCell className="text-center">{row.totalAwb}</TableCell>
                <TableCell className="text-center">{row.totalDisputeAwb}</TableCell>
                <TableCell className="text-center">{`${(row.totalExtraWeight/1000).toFixed(2)}`}</TableCell>
                <TableCell className="text-center">{(row.totalExtraCharges).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

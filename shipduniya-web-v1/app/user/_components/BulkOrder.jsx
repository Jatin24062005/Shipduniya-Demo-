import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Download, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ExcelJS from "exceljs";
import { useToast } from "@/hooks/use-toast";
import { set } from "date-fns";

export default function BulkUploadComponent({ isOpen, setIsOpen, onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Please upload a valid Excel file (.xlsx)");
      }
    }
  };

  // Handle file upload
  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      const response = await onUpload(file);
      // Build the success message with error detail if available
      if (response) {
        const successMessage = response.message;
        setSuccess(successMessage);
        setError(null);
        setFile(null);
        setIsOpen(false);
      }
    } catch (err) {
      console.log(err);
      // setError(err);
    }
  }, [file, onUpload, setIsOpen, toast]);

  // Handle schema download using ExcelJS
  const handleDownloadSchema = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Schema");
  
    const headings = [
      "CONSIGNEE NAME*",
      "CONSIGNEE ADDRESS1*",
      "CONSIGNEE ADDRESS2 (OPTIONAL)",
      "ORDER NUMBER",
      "ORDER TYPE*",
      "PINCODE*",
      "CHANNEL PARTNER",
      "INSURANCE",
      "MOBILE*",
      "INVOICE NUMBER*",
      "TELEPHONE (OPTIONAL)",
      "CITY*",
      "STATE*",
      "LENGTH* (CM)",
      "BREADTH* (CM)",
      "HEIGHT* (CM)",
      "COLLECTABLE AMOUNT",
      "DECLARED VALUE*",
      "ITEM DESCRIPTION*",
      "DG SHIPMENT (OPTIONAL)",
      "QUANTITY*",
      "VOLUMETRIC WEIGHT(G)",
      "ACTUAL WEIGHT(GM)",
    ];
  
    const example1 = [
      "Ratan",
      "Block Noida Sector 1",
      "",
      "2383465658",
      "prepaid",
      "201301",
      "Default",
      "No",
      "9812345678",
      "INV/001",
      "",
      "Noida",
      "Pradesh",
      "10",
      "5",
      "5",
      "0",
      "1000",
      "Glass Bottle",
      "",
      "1",
      "",
      "500",
    ];
  
    const example2 = [
      "Ratan",
      "Block Noida Sector 1",
      "",
      "242343254",
      "cod",
      "201301",
      "Default",
      "Yes",
      "9876543210",
      "INV/002",
      "",
      "Noida",
      "Pradesh",
      "10",
      "5",
      "5",
      "1000",
      "20000",
      "Glass Bottle",
      "",
      "1",
      "",
      "500",
    ];
  
    // Add heading row
    const headingRow = worksheet.addRow(headings);
  
    // Style headings (bold, white text, dark fill, center alignment)
    headingRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "0d1b2a" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FDE9D9" }, // Blue background
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
  
    // Auto set column widths based on longest content
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 15 ? 15 : maxLength + 2; // min 15, else padding
    });
  
    // Set row height for headings (to avoid cut text)
    headingRow.height = 25;
  
    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk_upload_schema.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload</DialogTitle>
          <DialogDescription>
            Upload your Excel file for bulk data import or download the required
            schema.
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
            <Alert
              variant="default"
              className="border-green-500 text-green-700"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadSchema}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Schema
            </Button>
            <Button onClick={handleUpload} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}

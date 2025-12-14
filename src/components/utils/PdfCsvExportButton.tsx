"use client";

import React, { useState } from "react";
import { Download, FileText, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MRT_TableInstance, MRT_RowData } from "material-react-table";
import { exportToCSV, exportToPDF } from "./PdfCsvExportHelpers";

interface PdfCsvExportButtonProps<T extends MRT_RowData = any> {
  table: MRT_TableInstance<T>;
  disabled?: boolean;
  filename?: string;
  title?: string;
}

export const PdfCsvExportButton = <T extends MRT_RowData = any,>({
  table,
  disabled = false,
  filename = "export",
  title = "Export",
}: PdfCsvExportButtonProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCSVExport = () => {
    const csvFilename = `${filename}-export-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(table, csvFilename);
    setIsOpen(false);
  };

  const handlePDFExport = async () => {
    const pdfFilename = `${filename}-export-${new Date().toISOString().split('T')[0]}.pdf`;
    await exportToPDF(table, pdfFilename, title);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-8 w-8 p-0 hover:bg-gray-100 mt-1"
        >
          <Download className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-28 p-1">
        <div className="space-y-1">
          <button
            onClick={handleCSVExport}
            className="flex w-full items-center px-2 py-1 text-xs hover:bg-gray-100 rounded-md cursor-pointer"
          >
            <Table className="mr-2 h-3 w-3" />
            Export CSV
          </button>
          <button
            onClick={handlePDFExport}
            className="flex w-full items-center px-2 py-1 text-xs hover:bg-gray-100 rounded-md cursor-pointer"
          >
            <FileText className="mr-2 h-3 w-3" />
            Export PDF
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

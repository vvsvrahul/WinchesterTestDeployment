import { MRT_TableInstance, MRT_RowData } from "material-react-table";

/**
 * Export table data to PDF format
 */
export const exportToPDF = async <T extends MRT_RowData = any>(
  table: MRT_TableInstance<T>,
  filename: string = "export.pdf",
  title?: string
) => {
  try {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();

    if (title) {
      doc.setFontSize(16);
      doc.text(title, 14, 22);
    }

    const columns = table.getVisibleFlatColumns();
    const data = table.getRowModel().rows.map(row => row.original);

    const headers = columns
      .filter(col => {
        const accessorKey = (col.columnDef as any).accessorKey;
        const columnId = (col.columnDef as any).id;
        const header = col.columnDef.header;
        
        return (accessorKey || columnId) && 
               header && 
               header !== 'Actions' && 
               !accessorKey?.toLowerCase().includes('action');
      })
      .map(col => String(col.columnDef.header));

    const rows = data.map((row: any) => 
      columns
        .filter(col => {
          const accessorKey = (col.columnDef as any).accessorKey;
          const columnId = (col.columnDef as any).id;
          const header = col.columnDef.header;
          
          return (accessorKey || columnId) && 
                 header && 
                 header !== 'Actions' && 
                 !accessorKey?.toLowerCase().includes('action');
        })
        .map(col => {
          const accessorKey = (col.columnDef as any).accessorKey;
          const columnId = (col.columnDef as any).id;
          
          let value = '';
          if (accessorKey) {
            value = row[accessorKey];
            if (accessorKey === 'createdOn' && value) {
              return new Date(value).toLocaleDateString();
            }
          } else if (columnId) {
            const cellValue = (col.columnDef as any).Cell ? (col.columnDef as any).Cell({ row: { original: row } } as any) : '';
            value = cellValue;
          }
          
          if ((col.columnDef as any).accessorFn) {
            value = (col.columnDef as any).accessorFn(row);
          }
          
          return value || '';
        })
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: title ? 30 : 20,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
    });

    doc.save(filename);
  } catch (error) {
    alert('Failed to export PDF. Please try again.');
  }
};

/**
 * Export table data to CSV format
 */
export const exportToCSV = <T extends MRT_RowData = any>(
  table: MRT_TableInstance<T>,
  filename: string = "export.csv"
) => {
  try {
    const columns = table.getVisibleFlatColumns();
    const data = table.getRowModel().rows.map(row => row.original);

    const headers = columns
      .filter(col => {
        const accessorKey = (col.columnDef as any).accessorKey;
        const columnId = (col.columnDef as any).id;
        const header = col.columnDef.header;
        
        return (accessorKey || columnId) && 
               header && 
               header !== 'Actions' && 
               !accessorKey?.toLowerCase().includes('action');
      })
      .map(col => String(col.columnDef.header));

    const rows = data.map((row: any) => 
      columns
        .filter(col => {
          const accessorKey = (col.columnDef as any).accessorKey;
          const columnId = (col.columnDef as any).id;
          const header = col.columnDef.header;
          
          return (accessorKey || columnId) && 
                 header && 
                 header !== 'Actions' && 
                 !accessorKey?.toLowerCase().includes('action');
        })
        .map(col => {
          const accessorKey = (col.columnDef as any).accessorKey;
          const columnId = (col.columnDef as any).id;
          
          let value = '';
          if (accessorKey) {
            value = row[accessorKey];
            if (accessorKey === 'createdOn' && value) {
              return new Date(value).toLocaleDateString();
            }
          } else if (columnId) {
            const cellValue = (col.columnDef as any).Cell ? (col.columnDef as any).Cell({ row: { original: row } } as any) : '';
            value = cellValue;
          }
          
          if ((col.columnDef as any).accessorFn) {
            value = (col.columnDef as any).accessorFn(row);
          }
          
          return value || '';
        })
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    alert('Failed to export CSV. Please try again.');
  }
};

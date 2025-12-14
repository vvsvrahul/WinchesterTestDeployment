"use client";

import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  useMaterialReactTable,
} from "material-react-table";
import { useQuery } from "@tanstack/react-query";
import { AdvanceSearchCriteria, Site, Department } from "@/types";
import {
  siteAdvancedSearch,
  departmentLookup,
  primerTypeLookup,
} from "@/api/services";
import { useFormik } from "formik";
import { Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { PdfCsvExportButton } from "@/components/utils/PdfCsvExportButton";
import { siteTableColumnConfig, siteTableInitialState } from "@/config";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SitesPage(): React.JSX.Element {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: () => {},
  });

  
  const [sorting, setSorting] = useState<MRT_SortingState>([{ id: "siteCode", desc: false }]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: [
      "sites-list",
      {
        pagination,
        sorting,
        search: formik.values.search,
      },
    ],
    queryFn: () => {
      const searchCriteria = new AdvanceSearchCriteria();
      searchCriteria.queryParams.pageIndex = pagination.pageIndex;
      searchCriteria.queryParams.pageSize = pagination.pageSize;
      searchCriteria.queryParams.sort = sorting[0]?.id;
      searchCriteria.queryParams.descending = sorting[0]?.desc;
      searchCriteria.queryParams.filter = formik.values.search;

      return siteAdvancedSearch(searchCriteria);
    },
  });

  const { data: departmentsData } = useQuery({
    queryKey: ["all-departments"],
    queryFn: () => departmentLookup({ PageSize: 1000 }),
  });

  const { data: primersData } = useQuery({
    queryKey: ["all-primers"],
    queryFn: () => primerTypeLookup({ PageSize: 1000 }),
  });

  const handleEditSite = (site: Site) => {
    router.push(`/admin/sites/${site.id}`);
  };

  const getDepartmentCount = (siteId: number): number => {
    if (!departmentsData?.data?.items) return 0;
    return departmentsData.data.items.filter((dept) => dept.siteId === siteId)
      .length;
  };

  const getDepartmentsForSite = (siteId: number): Department[] => {
    if (!departmentsData?.data?.items) return [];
    return departmentsData.data.items.filter((dept) => dept.siteId === siteId);
  };

  const getPrimerCount = (departmentId: number): number => {
    if (!primersData?.data?.items) return 0;
    return primersData.data.items.filter(
      (primer) => primer.departmentId === departmentId
    ).length;
  };

  const columns = useMemo<MRT_ColumnDef<Site>[]>(
    () => [
      ...siteTableColumnConfig,
      {
        id: "departmentCount",
        header: "Total No. of Departments",
        size: 200,
        Cell: ({ row }) => {
          const siteId = row.original.id;
          return getDepartmentCount(siteId);
        },
      },
    ],
    [departmentsData, primersData]
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.data?.items ?? [],
    initialState: siteTableInitialState,
    state: {
      pagination,
      sorting,
      isLoading,
      expanded,
    },
    enableGlobalFilter: false,
    enableEditing: true,
    enableMultiSort: false,
    enableColumnActions: false,
    enableSelectAll: false,
    enableMultiRowSelection: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: (updaterOrValue: any) => {
      if (typeof updaterOrValue === "function") {
        setExpanded(updaterOrValue);
      } else {
        setExpanded(updaterOrValue);
      }
    },
    rowCount: data?.data?.count ?? 0,
    manualPagination: true,
    enableRowActions: true,
    enableExpanding: true,
    enableColumnPinning: false,
    positionActionsColumn: "first",
    positionExpandColumn: "last",
    enableExpandAll: true,
    enableSubRowSelection: false,
    displayColumnDefOptions: {
      "mrt-row-expand": {
        header: "",
      },
    },
    meta: {
      handleEdit: handleEditSite,
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex items-center gap-2 ml-auto">
        <PdfCsvExportButton<Site>
          table={table}
          disabled={!data?.data?.items || data.data.items.length === 0}
          filename="sites"
          title="Sites Export"
        />
      </div>
    ),
    renderRowActions: ({ row }) => (
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger
            onClick={() => handleEditSite(row.original)}
            className="cursor-pointer px-2.5"
          >
            <Edit className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Update Site</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    renderDetailPanel: ({ row }) => {
      const departments = getDepartmentsForSite(row.original.id);

      return (
        <div className="p-4 bg-gray-50">
          <h4 className="font-semibold text-lg mb-3">
            Departments for {row.original.siteName}
          </h4>
          {departments.length === 0 ? (
            <p className="text-gray-500">No departments found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Department Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Site Code
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Site Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Total No. of Primers
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department) => (
                    <tr key={department.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {department.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.original.siteCode}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.original.siteName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {getPrimerCount(department.id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    },
  });

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl py-4 font-semibold">Sites</h3>
        <Button
          className="cursor-pointer"
          onClick={() => router.push("/admin/sites/add")}
        >
          Add Site
        </Button>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="py-2">
          <div className="flex gap-2 justify-end">
            <div className="w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                name="search"
                placeholder="Search sites..."
                onChange={formik.handleChange}
                value={formik.values.search}
                className="w-full font-semibold pl-10 h-10"
              />
            </div>
          </div>
        </div>
      </form>
      <MaterialReactTable table={table} />
    </div>
  );
}

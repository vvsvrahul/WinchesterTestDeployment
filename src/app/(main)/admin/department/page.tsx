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
import { Department, AdvanceSearchCriteria, PrimerDto } from "@/types";
import {
  departmentAdvancedSearch,
  primerTypeLookup,
  siteLookup,
} from "@/api/services";
import { useFormik } from "formik";
import { Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PdfCsvExportButton } from "@/components/utils/PdfCsvExportButton";
import {
  departmentTableColumnConfig,
  departmentTableInitialState,
} from "@/config";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DepartmentPage(): React.JSX.Element {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: () => {},
  });
    
  const [sorting, setSorting] = useState<MRT_SortingState>([{ id: "name", desc: false }]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: [
      "departments-list",
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

      return departmentAdvancedSearch(searchCriteria);
    },
  });

  const { data: primersData } = useQuery({
    queryKey: ["all-primers"],
    queryFn: () => primerTypeLookup({ PageSize: 1000 }),
  });

  const { data: sitesData } = useQuery({
    queryKey: ["all-sites"],
    queryFn: () => siteLookup({ PageSize: 1000 }),
  });

  const handleEditDepartment = (department: Department) => {
    router.push(`/admin/department/${department.id}`);
  };

  const getPrimerCount = (departmentId: number): number => {
    if (!primersData?.data?.items) return 0;
    return primersData.data.items.filter(
      (primer) => primer.departmentId === departmentId
    ).length;
  };

  const getPrimersForDepartment = (departmentId: number): PrimerDto[] => {
    if (!primersData?.data?.items) return [];
    return primersData.data.items.filter(
      (primer) => primer.departmentId === departmentId
    );
  };

  const getSiteInfo = (
    siteId: number | null
  ): { siteCode: string; siteName: string } => {
    if (!siteId || !sitesData?.data?.items)
      return { siteCode: "", siteName: "" };
    const site = sitesData.data.items.find((s) => s.id === siteId);
    return site
      ? { siteCode: site.siteCode, siteName: site.siteName }
      : { siteCode: "", siteName: "" };
  };

  const columns = useMemo<MRT_ColumnDef<Department>[]>(
    () => [
      ...departmentTableColumnConfig.map((col) => {
        if (col.id === "siteCode") {
          return {
            ...col,
            accessorFn: (row: Department) => {
              const siteInfo = getSiteInfo(row.siteId);
              return siteInfo.siteCode;
            },
            Cell: ({ row }: { row: any }) => {
              const siteInfo = getSiteInfo(row.original.siteId);
              return siteInfo.siteCode;
            },
          };
        }
        if (col.id === "siteName") {
          return {
            ...col,
            accessorFn: (row: Department) => {
              const siteInfo = getSiteInfo(row.siteId);
              return siteInfo.siteName;
            },
            Cell: ({ row }: { row: any }) => {
              const siteInfo = getSiteInfo(row.original.siteId);
              return siteInfo.siteName;
            },
          };
        }
        return col;
      }),
      {
        id: "primerCount",
        header: "Total No. of Primers",
        size: 200,
        Cell: ({ row }) => {
          const departmentId = row.original.id;
          return getPrimerCount(departmentId);
        },
      },
    ],
    [primersData, sitesData]
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.data?.items ?? [],
    initialState: departmentTableInitialState,
    state: {
      pagination,
      sorting,
      isLoading,
      expanded,
    },
    enableGlobalFilter: false,
    enableColumnFilters: true,
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
      handleEdit: handleEditDepartment,
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex items-center gap-2 ml-auto">
        <PdfCsvExportButton<Department>
          table={table}
          disabled={!data?.data?.items || data.data.items.length === 0}
          filename="departments"
          title="Departments Export"
        />
      </div>
    ),
    renderRowActions: ({ row }) => (
      <div className="flex">
        <Tooltip>
          <TooltipTrigger
            onClick={() => handleEditDepartment(row.original)}
            className="cursor-pointer px-2.5"
          >
            <Edit className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Update Department</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    renderDetailPanel: ({ row }) => {
      const primers = getPrimersForDepartment(row.original.id);
      const siteInfo = getSiteInfo(row.original.siteId);

      return (
        <div className="p-4 bg-gray-50">
          <h4 className="font-semibold text-lg mb-3">
            Primers for {row.original.name}
          </h4>
          {primers.length === 0 ? (
            <p className="text-gray-500">No primers found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Department
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Site Code
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      High Drop Test
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Comm Mil Cert
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {primers.map((primer) => (
                    <tr key={primer.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {primer.primerType}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.original.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {siteInfo.siteCode}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {primer.highDropTest}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {primer.commMilCert}
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
        <h3 className="text-2xl py-4 font-semibold">Departments</h3>
        <Button
          className="cursor-pointer"
          onClick={() => router.push("/admin/department/add")}
        >
          Add Department
        </Button>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="py-2">
          <div className="flex gap-2 justify-end">
            <div className="w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                name="search"
                placeholder="Search departments..."
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

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
import { PrimerDto, AdvanceSearchCriteria, DropTestDto } from "@/types";
import {
  primerAdvancedSearch,
  departmentLookup,
  siteLookup,
  dropTestAdvanceSearch,
} from "@/api/services";
import { primerTableColumnConfig, primerTableInitialState } from "@/config";
import { useFormik } from "formik";
import { Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PdfCsvExportButton } from "@/components/utils/PdfCsvExportButton";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PrimerPage(): React.JSX.Element {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: () => {},
  });

  const [sorting, setSorting] = useState<MRT_SortingState>([{ id: "primerType", desc: false }]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: [
      "primers-list",
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

      return primerAdvancedSearch(searchCriteria);
    },
  });

  const { data: departmentsData } = useQuery({
    queryKey: ["all-departments"],
    queryFn: () => departmentLookup({ PageSize: 1000 }),
  });

  const { data: sitesData } = useQuery({
    queryKey: ["all-sites"],
    queryFn: () => siteLookup({ PageSize: 1000 }),
  });

  const { data: dropTestsData } = useQuery({
    queryKey: ["all-drop-tests"],
    queryFn: () => {
      const searchCriteria = new AdvanceSearchCriteria();
      searchCriteria.queryParams.pageIndex = 0;
      searchCriteria.queryParams.pageSize = 10000; // Get all drop tests
      return dropTestAdvanceSearch(searchCriteria);
    },
  });

  const handleEditPrimer = (primer: PrimerDto) => {
    router.push(`/admin/primer/${primer.id}`);
  };

  const getDepartmentName = (departmentId: number | null): string => {
    if (!departmentId || !departmentsData?.data?.items) return "";
    const department = departmentsData.data.items.find(
      (d) => d.id === departmentId
    );
    return department?.name || "";
  };

  const getSiteCode = (departmentId: number | null): string => {
    if (
      !departmentId ||
      !departmentsData?.data?.items ||
      !sitesData?.data?.items
    )
      return "";
    const department = departmentsData.data.items.find(
      (d) => d.id === departmentId
    );
    if (!department?.siteId) return "";
    const site = sitesData.data.items.find((s) => s.id === department.siteId);
    return site?.siteCode || "";
  };

  const getSiteName = (departmentId: number | null): string => {
    if (
      !departmentId ||
      !departmentsData?.data?.items ||
      !sitesData?.data?.items
    )
      return "";
    const department = departmentsData.data.items.find(
      (d) => d.id === departmentId
    );
    if (!department?.siteId) return "";
    const site = sitesData.data.items.find((s) => s.id === department.siteId);
    return site?.siteName || "";
  };

  const getDropTestsForPrimer = (primerId: number): DropTestDto[] => {
    if (!dropTestsData?.data?.items) return [];
    return dropTestsData.data.items
      .filter((dropTest) => dropTest.primerId === primerId)
      .slice(0, 5);
  };

  const columns = useMemo<MRT_ColumnDef<PrimerDto>[]>(() => {
    const config = [...primerTableColumnConfig];

    const departmentIndex = config.findIndex((col) => col.id === "department");
    if (departmentIndex !== -1) {
      config[departmentIndex] = {
        ...config[departmentIndex],
        accessorFn: (row: PrimerDto) => getDepartmentName(row.departmentId),
        Cell: ({ row }) => getDepartmentName(row.original.departmentId),
      };
    }

    const siteCodeIndex = config.findIndex((col) => col.id === "siteCode");
    if (siteCodeIndex !== -1) {
      config[siteCodeIndex] = {
        ...config[siteCodeIndex],
        accessorFn: (row: PrimerDto) => getSiteCode(row.departmentId),
        Cell: ({ row }) => getSiteCode(row.original.departmentId),
      };
    }

    return config;
  }, [departmentsData, sitesData]);

  const table = useMaterialReactTable({
    columns,
    data: data?.data?.items ?? [],
    initialState: primerTableInitialState,
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
      handleEdit: handleEditPrimer,
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex items-center gap-2 ml-auto">
        <PdfCsvExportButton<PrimerDto>
          table={table}
          disabled={!data?.data?.items || data.data.items.length === 0}
          filename="primers"
          title="Primers Export"
        />
      </div>
    ),
    renderRowActions: ({ row }) => (
      <div className="flex">
        <Tooltip>
          <TooltipTrigger
            onClick={() => handleEditPrimer(row.original)}
            className="cursor-pointer px-2.5"
          >
            <Edit className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Update Primer</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    renderDetailPanel: ({ row }) => {
      const dropTests = getDropTestsForPrimer(row.original.id);
      const departmentName = getDepartmentName(row.original.departmentId);
      const siteName = getSiteName(row.original.departmentId);

      return (
        <div className="p-4 bg-gray-50">
          <h4 className="font-semibold text-lg mb-3">
            Drop Tests for {row.original.primerType}
          </h4>
          {dropTests.length === 0 ? (
            <p className="text-gray-500">No drop tests found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Test Date
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Lot Number
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Test Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Disposition
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Inspector
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Primer
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Site Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Department
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dropTests.map((dropTest) => (
                    <tr key={dropTest.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {dropTest.testDate
                          ? new Date(dropTest.testDate).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {dropTest.lotNumber}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {dropTest.testTypeName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {dropTest.disposition}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {dropTest.inspector}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {dropTest.primerName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {siteName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {departmentName}
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
        <h3 className="text-2xl py-4 font-semibold">Primers</h3>
        <Button
          className="cursor-pointer"
          onClick={() => router.push("/admin/primer/add")}
        >
          Add Primer
        </Button>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="py-2">
          <div className="flex gap-2 justify-end">
            <div className="w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                name="search"
                placeholder="Search primers..."
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

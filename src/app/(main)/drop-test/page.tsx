"use client";

import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  useMaterialReactTable,
} from "material-react-table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdvanceSearchCriteria, DropTestDto } from "@/types";
import {
  dropTestAdvanceSearch,
  exportReportDropTestById,
} from "@/api/services";
import { dropTestTableIntialState } from "@/config";
import { useFormik } from "formik";
import {
  InputSelect,
  InputSelectTrigger,
} from "@/components/extend/input-select";
import { primerTypeLookup, departmentLookup, siteLookup } from "@/api/services";
import { Input } from "@/components/ui/input";
import { Search, Edit, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PdfCsvExportButton } from "@/components/utils/PdfCsvExportButton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dropTestTableColumnConfig, dispositionStyles } from "./columns";

export default function DropTest(): React.JSX.Element {
  const formik = useFormik({
    initialValues: {
      primerType: "",
      department: "",
      siteCode: "",
      testType: "",
      search: "",
    },
    onSubmit: () => {},
  });
  const [primerType, setPrimerType] = useState("");
  const [department, setDepartment] = useState("");
  const [siteCode, setSiteCode] = useState("");
  const [testType, setTestType] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const router = useRouter();

  const primerTypeApi = useQuery({
    queryKey: ["primer-type-lookup", { Filter: formik.values.primerType }],
    queryFn: () => {
      return primerTypeLookup({
        Filter: formik.values.primerType,
        PageSize: 100,
      });
    },
  });

  const departmentApi = useQuery({
    queryKey: ["department-lookup", { Filter: formik.values.department }],
    queryFn: () => {
      return departmentLookup({
        Filter: formik.values.department,
        PageSize: 100,
      });
    },
  });

  const siteApi = useQuery({
    queryKey: ["site-lookup", { Filter: formik.values.siteCode }],
    queryFn: () => {
      return siteLookup({
        Filter: formik.values.siteCode,
        PageSize: 100,
      });
    },
  });

  const exportReportDropTestByIdApi = useMutation({
    mutationKey: ["export-drop-test-by-id"],
    mutationFn: ({ id, testNumber }: { id: number; testNumber?: number | string | null }) => {
      return exportReportDropTestById(id);
    },
    onSuccess: (res, { testNumber, id }) => {
      try {
        const blob = new Blob([res.data], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        const testNum = testNumber || id;
        link.download = `Primer Drop Test Report-${testNum}.pdf`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("PDF downloaded successfully", {
          duration: 3000,
          description: `Drop test report ${testNum} has been saved to your downloads folder.`,
        });
      } catch (error) {
        toast.error("Failed to download PDF", {
          duration: 4000,
          description: "An error occurred while saving the PDF file.",
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to generate PDF", {
        duration: 4000,
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "drop-test-list",
      {
        pagination,
        sorting,
        primerType,
        department,
        siteCode,
        testType,
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

      if (primerType != "") {
        searchCriteria.criteria.push({
          name: "primertype",
          display: "primertype",
          fieldType: "",
          values: [primerType],
        });
      }

      if (department != "") {
        searchCriteria.criteria.push({
          name: "department",
          display: "department",
          fieldType: "",
          values: [department],
        });
      }

      if (siteCode != "") {
        searchCriteria.criteria.push({
          name: "sitecode",
          display: "sitecode",
          fieldType: "",
          values: [siteCode],
        });
      }

      if (testType != "") {
        searchCriteria.criteria.push({
          name: "testtype",
          display: "testtype",
          fieldType: "",
          values: [testType],
        });
      }

      return dropTestAdvanceSearch(searchCriteria);
    },
  });

  const columns = useMemo<MRT_ColumnDef<DropTestDto>[]>(
    () => dropTestTableColumnConfig,
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.data?.items ?? [],
    initialState: dropTestTableIntialState,
    state: {
      pagination,
      sorting,
      isLoading,
    },
    enableGlobalFilter: false,
    enableEditing: true,
    enableMultiSort: false,
    enableColumnActions: false,
    enableSelectAll: false,
    enableMultiRowSelection: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: data?.data?.count ?? 0,
    manualPagination: true,
    enableFilters: false,
    renderRowActions: ({ row }) => {
      const isInProgress = row.original.disposition?.trim() === "In-Progress";
      
      return (
        <div className="flex justify-around">
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                router.push(`/drop-test/${row.original.id}`);
              }}
              className="cursor-pointer"
            >
              {isInProgress ? (
                <Edit className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{isInProgress ? "Update Test" : "View Test"}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                toast.info("Generating PDF...", {
                  duration: 4000,
                  description: "Please wait while the PDF is being generated.",
                });
                exportReportDropTestByIdApi.mutate({ 
                  id: row.original.id!, 
                  testNumber: row.original.legacyId 
                });
              }}
              className="cursor-pointer"
            >
              <FileText className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Export PDF</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex items-center gap-2 ml-auto">
        <PdfCsvExportButton<DropTestDto>
          table={table}
          disabled={!data?.data?.items || data.data.items.length === 0}
          filename="drop-tests"
          title="Drop Tests Export"
        />
      </div>
    ),
  });

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl py-4 font-semibold">Primer Drop Tests</h3>
        <Link href="/drop-test/add">
          <Button className="cursor-pointer">Add Drop Test</Button>
        </Link>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="">
          <div className="flex gap-2 justify-between items-end overflow-x-auto py-4">
            <div className="flex gap-2 flex-shrink-0">
              <div className="w-[200px]">
                <InputSelect
                  className="w-full"
                  options={
                    siteApi.data?.data?.items
                      ?.filter((i) => i.siteCode && i.siteCode.trim() !== "")
                      ?.map((i) => {
                        return {
                          value: i.siteCode,
                          label: i.siteCode,
                        };
                      }) ?? []
                  }
                  value={formik.values.siteCode}
                  onValueChange={(val) => {
                    formik.setFieldValue("siteCode", val);
                  }}
                  clearable
                  placeholder="Site Name"
                  shoudlFilter={false}
                  onFilter={(e: React.FormEvent<HTMLInputElement>) => {
                    formik.setFieldValue("siteCode", e.currentTarget.value);
                  }}
                  onSelectionChange={(val: string) => {
                    setSiteCode(val);
                  }}
                >
                  {(provided) => <InputSelectTrigger {...provided} />}
                </InputSelect>
              </div>
              <div className="w-[200px]">
                <InputSelect
                  className="w-full"
                  options={
                    departmentApi.data?.data?.items
                      ?.filter((i) => i.name && i.name.trim() !== "")
                      ?.map((i) => {
                        return {
                          value: i.name,
                          label: i.name,
                        };
                      }) ?? []
                  }
                  value={formik.values.department}
                  onValueChange={(val) => {
                    formik.setFieldValue("department", val);
                  }}
                  clearable
                  placeholder="Department"
                  shoudlFilter={false}
                  onFilter={(e: React.FormEvent<HTMLInputElement>) => {
                    formik.setFieldValue("department", e.currentTarget.value);
                  }}
                  onSelectionChange={(val: string) => {
                    setDepartment(val);
                  }}
                >
                  {(provided) => <InputSelectTrigger {...provided} />}
                </InputSelect>
              </div>
              <div className="w-[200px]">
                <InputSelect
                  className="w-full"
                  options={
                    primerTypeApi.data?.data?.items
                      ?.map((i) => {
                        return {
                          value: i.primerType,
                          label: i.primerType,
                        };
                      })
                      ?.filter(
                        (option, index, self) =>
                          // Remove duplicates based on value
                          index ===
                          self.findIndex((o) => o.value === option.value)
                      ) ?? []
                  }
                  value={formik.values.primerType}
                  onValueChange={(val) => {
                    formik.setFieldValue("primerType", val);
                  }}
                  clearable
                  placeholder="Primer"
                  shoudlFilter={false}
                  onFilter={(e: React.FormEvent<HTMLInputElement>) => {
                    formik.setFieldValue("primerType", e.currentTarget.value);
                  }}
                  onSelectionChange={(val: string) => {
                    setPrimerType(val);
                  }}
                >
                  {(provided) => <InputSelectTrigger {...provided} />}
                </InputSelect>
              </div>
              <div className="w-[200px]">
                <InputSelect
                  className="w-full"
                  options={[
                    { value: "Regular Run", label: "Regular Run" },
                    { value: "Retest", label: "Retest" },
                  ]}
                  value={formik.values.testType}
                  onValueChange={(val) => {
                    formik.setFieldValue("testType", val);
                  }}
                  clearable
                  placeholder="Test Type"
                  shoudlFilter={false}
                  onFilter={(e: React.FormEvent<HTMLInputElement>) => {
                    formik.setFieldValue("testType", e.currentTarget.value);
                  }}
                  onSelectionChange={(val: string) => {
                    setTestType(val);
                  }}
                >
                  {(provided) => <InputSelectTrigger {...provided} />}
                </InputSelect>
              </div>
            </div>
            <div className="w-[200px] relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                name="search"
                placeholder="Search"
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

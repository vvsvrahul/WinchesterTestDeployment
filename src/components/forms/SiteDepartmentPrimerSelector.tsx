"use client";

import { departmentLookup, primerTypeLookup, siteLookup } from "@/api/services";
import InputMapper from "@/components/extend/input-mapper";
import { Department, PrimerDto, Site } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "sonner";

interface SiteDepartmentPrimerSelectorProps {
  className?: string;
  isDisabled: boolean;
  values: any;
  errors: any;
  touched: any;
  onSiteSelectionChange?: (val: string, item: Site) => void;
  onDepartmentSelectionChange?: (val: string, item: Department) => void;
  onPrimerSelectionChange?: (val: string, item: PrimerDto) => void;
}

export default function SiteDepartmentPrimerSelector({
  className,
  isDisabled,
  values,
  errors,
  touched,
  onSiteSelectionChange,
  onDepartmentSelectionChange,
  onPrimerSelectionChange,
}: SiteDepartmentPrimerSelectorProps) {
  const siteApi = useQuery({
    queryKey: ["site-lookup"],
    queryFn: () => {
      return siteLookup({
        Filter: "",
        PageSize: 1000,
      });
    },
  });

  const departmentApi = useQuery({
    queryKey: ["department-lookup"],
    queryFn: () => {
      return departmentLookup({
        Filter: "",
        PageSize: 1000,
      });
    },
  });

  const primerTypeApi = useQuery({
    queryKey: ["primer-type-lookup"],
    queryFn: () => {
      return primerTypeLookup({
        Filter: "",
        PageSize: 1000,
      });
    },
  });

  useEffect(() => {
    if (siteApi.error) {
      toast.error("Error fetching sites.", {
        description: siteApi.error.message,
        duration: 4000,
      });
    }
  }, [siteApi]);

  useEffect(() => {
    if (departmentApi.error) {
      toast.error("Error fetching departments.", {
        description: departmentApi.error.message,
        duration: 4000,
      });
    }
  }, [departmentApi]);

  useEffect(() => {
    if (primerTypeApi.error) {
      toast.error("Error fetching primer names.", {
        description: primerTypeApi.error.message,
        duration: 4000,
      });
    }
  }, [primerTypeApi]);

  return (
    <div
      className={`flex flex-wrap p-4 gap-3 border border-red-500 rounded-xl ${className}`}
    >
      <div className="flex-auto">
        <InputMapper
          className="!w-full !min-w-[150px]"
          field={{
            name: "primer",
            label: "Primer",
            type: "select",
            placeholder: "Select Primer",
            disabled: isDisabled,
            required: true,
          }}
          options={
            primerTypeApi.data?.data?.items.map((i: PrimerDto) => ({
              value: i.primerType.trim(),
              label: i.primerType.trim(),
              item: i,
            })) ?? []
          }
          value={values?.primer || ""}
          onSelectionChange={(val: string, item: PrimerDto) => {
            if (item?.departmentId && departmentApi.data?.data?.items) {
              const department = departmentApi.data.data.items.find(
                (d: Department) => d.id === item.departmentId
              );
              if (department) {
                if (department.siteId && siteApi.data?.data?.items) {
                  const site = siteApi.data.data.items.find(
                    (s: Site) => s.id === department.siteId
                  );
                  if (site) {
                    onPrimerSelectionChange?.(val, {
                      ...item,
                      department: { ...department, site },
                    });
                    return;
                  }
                }
                onPrimerSelectionChange?.(val, {
                  ...item,
                  department,
                });
                return;
              }
            }
            onPrimerSelectionChange?.(val, item);
          }}
          error={errors?.primer ? errors.primer : ""}
          touched={touched?.primer ? touched.primer : false}
        />
      </div>
      <div className="flex-auto">
        <InputMapper
          className="!w-full !min-w-[150px]"
          field={{
            name: "departmentName",
            label: "Department",
            type: "select",
            placeholder: "Select Department",
            disabled: isDisabled,
            required: true,
          }}
          options={
            departmentApi.data?.data?.items.map((i: Department) => ({
              value: i.name?.trim() || "",
              label: i.name?.trim() || "",
              item: i,
            })) ?? []
          }
          value={values?.departmentName || ""}
          onSelectionChange={(val: string, item: Department) => {
            onDepartmentSelectionChange?.(val, item);
          }}
          error={errors?.departmentName ? errors.departmentName : ""}
          touched={touched?.departmentName ? touched.departmentName : false}
        />
      </div>
      <div className="flex-auto">
        <InputMapper
          className={"!w-full !min-w-[150px]"}
          field={{
            name: "siteCode",
            label: "Site",
            type: "select",
            placeholder: "Select Site",
            required: true,
            disabled: isDisabled,
          }}
          options={
            siteApi.data?.data?.items.map((i: Site) => ({
              value: i.siteCode?.trim() || "",
              label: i.siteCode?.trim() || "",
              item: i,
            })) ?? []
          }
          value={values?.siteCode || ""}
          onSelectionChange={(val: string, item: Site) => {
            onSiteSelectionChange?.(val, item);
          }}
          error={errors?.siteCode ? errors?.siteCode : ""}
          touched={touched?.siteCode ? touched?.siteCode : false}
        />
      </div>
    </div>
  );
}

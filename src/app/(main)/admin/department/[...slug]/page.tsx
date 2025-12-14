"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import DepartmentForm from "./DepartmentForm";

export default function Page() {
  const params = useParams();

  const departmentDetails = useQuery({
    queryKey: ["departmentDetails", params.slug?.[0]],
    queryFn: async () => {
      const { getDepartmentById } = await import("@/api/services");
      return getDepartmentById(parseInt(params.slug?.[0] as string));
    },
    enabled: params.slug?.[0] !== "add" && params.slug?.[0] !== undefined,
  });

  return (
    <DepartmentForm
      initialData={departmentDetails.data?.data}
      isEdit={params.slug?.[0] !== "add"}
      departmentId={params.slug?.[0] as string}
    />
  );
}

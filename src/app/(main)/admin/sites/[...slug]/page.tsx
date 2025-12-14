"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import SiteForm from "./SiteForm";

export default function Page() {
  const params = useParams();

  const siteDetails = useQuery({
    queryKey: ["siteDetails", params.slug?.[0]],
    queryFn: async () => {
      const { getSiteById } = await import("@/api/services");
      return getSiteById(parseInt(params.slug?.[0] as string));
    },
    enabled: params.slug?.[0] !== "add" && params.slug?.[0] !== undefined,
  });

  return (
    <SiteForm
      initialData={siteDetails.data?.data}
      isEdit={params.slug?.[0] !== "add"}
      siteId={params.slug?.[0] as string}
    />
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import PrimerForm from "./PrimerForm";

export default function Page() {
  const params = useParams();

  const primerDetails = useQuery({
    queryKey: ["primerDetails", params.slug?.[0]],
    queryFn: async () => {
      const { getPrimerById } = await import("@/api/services");
      return getPrimerById(parseInt(params.slug?.[0] as string));
    },
    enabled: params.slug?.[0] !== "add" && params.slug?.[0] !== undefined,
  });

  return (
    <PrimerForm
      initialData={primerDetails.data?.data}
      isEdit={params.slug?.[0] !== "add"}
      primerId={params.slug?.[0] as string}
    />
  );
}

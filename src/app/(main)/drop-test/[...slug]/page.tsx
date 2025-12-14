"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import DropTestForm from "./DropTestForm";
import {
  createDropTest,
  getDropTestById,
  updateDropTest,
} from "@/api/services";
import { DropTestDto, DropTestFormInterface } from "@/types";
import { getFinalValuesForDropTestTable } from "@/config";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { FormikState } from "formik";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const testDetails = useQuery({
    queryKey: ["testDetails", params.slug?.[0]],
    queryFn: () => {
      return getDropTestById(params.slug?.[0] as string);
    },
    enabled: params.slug?.[0] !== "add",
  });

  const updateTestDetails = useMutation({
    mutationKey: ["updateTestDetails"],
    mutationFn: async (data: DropTestDto) => {
      return params.slug?.[0] !== "add"
        ? updateDropTest(data)
        : createDropTest(data);
    },
    onError: (error) => {
      toast.error("Error saving drop test details.", {
        description: error.message,
        duration: 4000,
      });
    },
    onSuccess: (data) => {
      toast.success("Drop test details saved successfully.", {
        duration: 4000,
      });

      if (params.slug?.[0] !== "add") {
        testDetails.refetch();
      }
    },
  });

  const handleSave = (
    data: DropTestFormInterface,
    saveType: "progress" | "finalize",
    resetForm: (nextState?: Partial<FormikState<DropTestFormInterface>>) => void
  ) => {
    updateTestDetails.mutate(getFinalValuesForDropTestTable(data), {
      onSuccess: (data) => {
        resetForm();
        if (saveType === "progress") {
          router.push("/drop-test");
        } else {
          router.push(`/drop-test/${data?.data?.id || params.slug?.[0]}`);
        }
      },
    });
  };

  return (
    <div className="container mx-auto relative">
      {testDetails.isLoading || testDetails.isRefetching ? (
        <div className="flex flex-col items-center justify-start pt-[40vh] absolute top-0 left-0 right-0 bottom-0 bg-white/70 z-10">
          <LoaderCircle className="animate-spin" />
          <p>Loading Primer Drop Test Details</p>
        </div>
      ) : null}
      <DropTestForm
        initialData={
          params.slug?.[0] !== "add"
            ? testDetails.data?.data ?? new DropTestDto()
            : new DropTestDto()
        }
        isDisabled={
          params.slug?.[0] !== "add"
            ? testDetails.data?.data?.dispositionId !== 4
            : false ||
              testDetails.isLoading ||
              testDetails.isRefetching ||
              updateTestDetails.isPending
        }
        onSaveProgress={handleSave}
        onFinalize={handleSave}
        isEdit={params.slug?.[0] !== "add"}
      />
    </div>
  );
}

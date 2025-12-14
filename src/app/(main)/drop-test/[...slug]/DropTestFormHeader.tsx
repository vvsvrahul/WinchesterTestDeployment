"use client";

import { DropTestDto } from "@/types";
import React from "react";

const styles = {
  "1": {
    label: "Accepted",
    color: "text-white bg-green-600 px-1 rounded leading-0",
  },
  "2": {
    label: "Rejected",
    color: "text-white bg-red-600 px-1 rounded leading-0",
  },
  "3": {
    label: "Retest",
    color: "text-white bg-yellow-600 px-1 rounded leading-0",
  },
  "4": {
    label: "In Progress",
    color: "text-white bg-blue-600 px-1 rounded leading-0",
  },
};

export default function DropTestFormHeader({
  dispositionId,
  isEdit,
  intialData,
}: {
  dispositionId: number | undefined;
  isEdit: boolean;
  intialData?: DropTestDto;
}) {
  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  return isEdit ? (
    dispositionId !== 4 ? (
      <div className="sticky top-0 z-10 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <p className="text-left text-2xl font-semibold">
            Primer Drop Test -{" "}
            <span
              className={
                dispositionId &&
                styles?.[dispositionId.toString() as keyof typeof styles]
                  ? styles[dispositionId.toString() as keyof typeof styles]
                      .color
                  : ""
              }
            >
              {styles?.[dispositionId?.toString() as keyof typeof styles]
                ? styles[dispositionId?.toString() as keyof typeof styles].label
                : "Update Primer Drop Test"}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-base">
          <div>
            <span className="font-medium text-gray-600">Primer: </span>
            <span className="text-gray-900">
              {intialData?.primerName || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Test Type: </span>
            <span className="text-gray-900">
              {intialData?.testTypeName || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Test Date: </span>
            <span className="text-gray-900">
              {formatDate(intialData?.testDate)}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Inspector: </span>
            <span className="text-gray-900">
              {intialData?.inspector || "N/A"}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div className="sticky top-0 z-10 flex flex-col">
        <div className="flex items-center justify-between">
          <p className="text-left text-2xl font-semibold">
            Primer Drop Test -{" "}
            <span className={styles["4"].color}>{styles["4"].label}</span>
          </p>
        </div>
        <div className="text-base">
          <span className="font-medium text-gray-600">Test Number: </span>
          <span className="text-gray-900">{intialData?.legacyId || "N/A"}</span>
        </div>
      </div>
    )
  ) : (
    <div>
      <p className="text-2xl font-semibold text-left">New Primer Drop Test</p>
    </div>
  );
}

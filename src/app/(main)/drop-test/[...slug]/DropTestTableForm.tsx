"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import React from "react";

export default function DropTestTableForm({
  isEdit,
  errors,
  touched,
  values,
  handleChange,
  handleBlur,
  isDisabled,
}: {
  isEdit: boolean;
  errors: any;
  touched: any;
  values: any;
  handleChange: any;
  handleBlur: any;
  isDisabled: boolean;
}) {
  return (
    <div className="w-full h-full">
      <Table className="!h-full">
        <TableHeader>
          <TableRow className="[&>th]:text-center text-lg">
            <TableHead>HT</TableHead>
            <TableHead>#FR</TableHead>
            <TableHead>#MF</TableHead>
            <TableHead>%MF</TableHead>
            <TableHead>K-FC</TableHead>
            <TableHead>P*K</TableHead>
            <TableHead>S-FC</TableHead>
            <TableHead>P*S</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 16 }).map((_, index) => {
            const row = 16 - index;
            return (
              <TableRow
                className="text-center [&>td:not(:last-child)]:border-r-1 text-base"
                key={`drop-test-form-table-row-${index}`}
              >
                <TableCell>
                  <span className="font-medium text-lg rounded-full shadow h-8 w-8 flex items-center justify-center mx-auto bg-gray-100">
                    {row}
                  </span>
                </TableCell>
                <TableCell>{values?.numberFired?.[row]}</TableCell>
                <TableCell className="w-[100px] border-l-red-500">
                  <Input
                    type="number"
                    className={`!max-w-[100px] ${
                      errors?.misfires?.[row] && touched?.misfires?.[row]
                        ? "border-destructive"
                        : ""
                    } border-red-500 [&>input]:!opacity-100 disabled:text-blue-500 disabled:opacity-100 !text-base`}
                    value={values?.misfires?.[row]}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        const syntheticEvent = {
                          ...e,
                          target: {
                            ...e.target,
                            name: e.target.name,
                            value: null,
                          },
                        };
                        handleChange(syntheticEvent);
                      } else {
                        handleChange(e);
                      }
                    }}
                    onBlur={handleBlur}
                    name={`misfires.${row}`}
                    disabled={isDisabled}
                  />
                  {errors?.misfires?.[row] && touched?.misfires?.[row] && (
                    <div className="text-xs text-destructive text-left">
                      {errors?.misfires?.[row]}
                    </div>
                  )}
                </TableCell>
                <TableCell>{values?.percentMisfire?.[row]}</TableCell>
                <TableCell>{values?.varianceFactorK?.[row]}</TableCell>
                <TableCell>{values?.ptimesK?.[row]}</TableCell>
                <TableCell>{values?.skewnessFactorS?.[row]}</TableCell>
                <TableCell>{values?.ptimesS?.[row]}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

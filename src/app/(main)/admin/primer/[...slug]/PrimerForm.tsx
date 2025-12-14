"use client";

import React, { useMemo } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PrimerDto, Department } from "@/types";
import { 
  getPrimerById, 
  createPrimer, 
  updatePrimer,
  departmentLookup 
} from "@/api/services";
import { 
  primerValidationSchema, 
  primerBasicFields, 
  primerHTypeFields, 
  primerPhysicalFields, 
  primerTestFields 
} from "@/config";
import InputMapper from "@/components/extend/input-mapper";
import PrimerTypeField from "@/components/forms/PrimerTypeField";

interface PrimerFormProps {
  initialData: any;
  isEdit: boolean;
  primerId?: string;
}

export default function PrimerForm({
  initialData,
  isEdit,
  primerId,
}: PrimerFormProps): React.JSX.Element {
  const router = useRouter();

  const updatePrimerMutation = useMutation({
    mutationFn: updatePrimer,
  });

  const createPrimerMutation = useMutation({
    mutationFn: createPrimer,
  });

  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentLookup({ PageSize: 1000 }),
    enabled: true,
  });


  const initialValues = useMemo(() => ({
    primerType: initialData?.primerType ?? "",
    hplusType: initialData?.hplusType ?? "",
    hminusType: initialData?.hminusType ?? "",
    testHplusValue: initialData?.testHplusValue ?? "",
    testHminusValue: initialData?.testHminusValue ?? "",
    reTestHplusValue: initialData?.reTestHplusValue ?? "",
    reTestHminusValue: initialData?.reTestHminusValue ?? "",
    ballWeight: initialData?.ballWeight ?? "",
    ballDiameter: initialData?.ballDiameter ?? "",
    headSpace: initialData?.headSpace ?? "",
    firingPinMax: initialData?.firingPinMax ?? "",
    firingPinMin: initialData?.firingPinMin ?? "",
    highDropTest: initialData?.highDropTest ?? "",
    allFireValue: initialData?.allFireValue ?? "",
    noFireValue: initialData?.noFireValue ?? "",
    commMilCert: initialData?.commMilCert ?? "",
    departmentId: initialData?.departmentId ?? null,
    status: initialData?.status ?? true,
  }), [initialData]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: primerValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const parseNumeric = (value: any) => value !== "" ? parseFloat(value.toString()) : 0;
        
        const primerPayload = {
          primerType: values.primerType,
          hplusType: parseNumeric(values.hplusType),
          hminusType: parseNumeric(values.hminusType),
          testHplusValue: parseNumeric(values.testHplusValue),
          testHminusValue: parseNumeric(values.testHminusValue),
          reTestHplusValue: parseNumeric(values.reTestHplusValue),
          reTestHminusValue: parseNumeric(values.reTestHminusValue),
          ballWeight: parseNumeric(values.ballWeight),
          ballDiameter: parseNumeric(values.ballDiameter),
          headSpace: parseNumeric(values.headSpace),
          firingPinMax: parseNumeric(values.firingPinMax),
          firingPinMin: parseNumeric(values.firingPinMin),
          highDropTest: parseNumeric(values.highDropTest),
          allFireValue: parseNumeric(values.allFireValue),
          noFireValue: parseNumeric(values.noFireValue),
          commMilCert: values.commMilCert,
          departmentId: values.departmentId,
          status: values.status,
        };

        if (isEdit && primerId) {
          await updatePrimerMutation.mutateAsync({
            id: parseInt(primerId),
            createdOn: new Date().toISOString(),
            ...primerPayload,
          });
        } else {
          await createPrimerMutation.mutateAsync(primerPayload);
        }

        router.push("/admin/primer");
      } catch (error) {
        console.error("Error saving primer:", error);
      }
    },
  });

  const handleCancel = () => {
    router.push("/admin/primer");
  };

  const handlePrimerSelect = (selectedPrimer: PrimerDto) => {
    formik.setValues({
      primerType: "",
      hplusType: selectedPrimer.hplusType?.toString() || "",
      hminusType: selectedPrimer.hminusType?.toString() || "",
      testHplusValue: selectedPrimer.testHplusValue?.toString() || "",
      testHminusValue: selectedPrimer.testHminusValue?.toString() || "",
      reTestHplusValue: selectedPrimer.reTestHplusValue?.toString() || "",
      reTestHminusValue: selectedPrimer.reTestHminusValue?.toString() || "",
      ballWeight: selectedPrimer.ballWeight?.toString() || "",
      ballDiameter: selectedPrimer.ballDiameter?.toString() || "",
      headSpace: selectedPrimer.headSpace?.toString() || "",
      firingPinMax: selectedPrimer.firingPinMax?.toString() || "",
      firingPinMin: selectedPrimer.firingPinMin?.toString() || "",
      highDropTest: selectedPrimer.highDropTest?.toString() || "",
      allFireValue: selectedPrimer.allFireValue?.toString() || "",
      noFireValue: selectedPrimer.noFireValue?.toString() || "",
      commMilCert: selectedPrimer.commMilCert || "",
      departmentId: selectedPrimer.departmentId || null,
      status: true,
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <Card className="!w-full overflow-auto max-h-[calc(100vh-19vh)] p-0 pb-4">
      <CardHeader className="sticky top-0 z-10 bg-white border-b !p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold">
            {isEdit ? "Edit Primer" : "New Primer"}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => formik.handleSubmit()}
              className="px-8 bg-red-600 hover:bg-red-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Basic Information</CardTitle>
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium">Status</label>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue('status', !formik.values.status)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formik.values.status ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formik.values.status ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${
                  formik.values.status ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formik.values.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {primerBasicFields.map((field) => {
                if (field.name === "primerType") {
                  return (
                    <PrimerTypeField
                      key={field.name}
                      value={formik.values.primerType || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.errors.primerType as string}
                      touched={formik.touched.primerType as boolean}
                      onPrimerSelect={handlePrimerSelect}
                      isEdit={isEdit}
                    />
                  );
                }

                const getOptions = () => {
                  if (field.name === "departmentId" && departmentsData?.data?.items) {
                    return departmentsData.data.items.map((department: Department) => ({
                      value: department.id.toString(),
                      label: department.name,
                    }));
                  }
                  if (field.name === "commMilCert") {
                    return [
                      { value: "Military", label: "Military" },
                      { value: "Commercial", label: "Commercial" },
                      { value: "Certified", label: "Certified" }
                    ];
                  }
                  return [];
                };

                const getSelectValue = () => {
                  if (field.name === "departmentId") {
                    return formik.values.departmentId ? formik.values.departmentId.toString() : "";
                  }
                  if (field.name === "commMilCert") {
                    const currentValue = formik.values.commMilCert || "";
                    const options = [
                      { value: "Military", label: "Military" },
                      { value: "Commercial", label: "Commercial" },
                      { value: "Certified", label: "Certified" }
                    ];
                    
                    const exactMatch = options.find(option => option.value === currentValue);
                    if (exactMatch) return exactMatch.value;
                    
                    const caseInsensitiveMatch = options.find(option => 
                      option.value.toLowerCase() === currentValue.toLowerCase()
                    );
                    if (caseInsensitiveMatch) return caseInsensitiveMatch.value;
                    
                    const partialMatch = options.find(option => 
                      option.value.toLowerCase().trim() === currentValue.toLowerCase().trim()
                    );
                    if (partialMatch) return partialMatch.value;
                    
                    return currentValue;
                  }
                  return (formik.values?.[field?.name as keyof typeof formik.values] !== undefined
                    ? formik.values[field.name as keyof typeof formik.values]
                    : "");
                };

                return (
                  <InputMapper
                    key={field.name}
                    field={field}
                    value={getSelectValue()}
                    onChange={(e) => {
                      if (field.name === "departmentId") {
                        const event = {
                          target: {
                            name: field.name,
                            value: e.target.value ? parseInt(e.target.value) : null,
                          },
                        };
                        formik.handleChange(event);
                      } else if (field.name === "commMilCert") {
                        formik.handleChange(e);
                      } else {
                        formik.handleChange(e);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.errors[field.name as keyof typeof formik.errors] as string}
                    touched={
                      formik.touched[field.name as keyof typeof formik.touched] as
                        | boolean
                        | undefined
                    }
                    options={getOptions()}
                    inputType={field.inputType || "text"}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">H+ and H- Type Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {primerHTypeFields.map((field) => (
                <InputMapper
                  key={field.name}
                  field={field}
                  value={
                    formik.values?.[field?.name as keyof typeof formik.values] !== undefined
                      ? formik.values[field.name as keyof typeof formik.values]
                      : ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors[field.name as keyof typeof formik.errors] as string}
                  touched={
                    formik.touched[field.name as keyof typeof formik.touched] as
                      | boolean
                      | undefined
                  }
                  inputType={field.inputType || "text"}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Physical Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {primerPhysicalFields.map((field) => (
                <InputMapper
                  key={field.name}
                  field={field}
                  value={
                    formik.values?.[field?.name as keyof typeof formik.values] !== undefined
                      ? formik.values[field.name as keyof typeof formik.values]
                      : ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors[field.name as keyof typeof formik.errors] as string}
                  touched={
                    formik.touched[field.name as keyof typeof formik.touched] as
                      | boolean
                      | undefined
                  }
                  inputType={field.inputType || "text"}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Test Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {primerTestFields.map((field) => (
                <InputMapper
                  key={field.name}
                  field={field}
                  value={
                    formik.values?.[field?.name as keyof typeof formik.values] !== undefined
                      ? formik.values[field.name as keyof typeof formik.values]
                      : ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors[field.name as keyof typeof formik.errors] as string}
                  touched={
                    formik.touched[field.name as keyof typeof formik.touched] as
                      | boolean
                      | undefined
                  }
                  inputType={field.inputType || "text"}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}

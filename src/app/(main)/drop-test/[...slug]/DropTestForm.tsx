"use client";

import { FormikState, useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  headerFields,
  manufacturingFields,
  testFields,
  primerDetailsFields,
  dropTestFields,
  ballFields,
  firingPinFields,
  headSpaceFields,
  resultsFields,
  fireHeightFields,
  specFields,
  statusFields,
  dropTestValidationSchema,
  getIntialValuesForDropTestForm,
  Disposition,
} from "@/config";
import InputMapper from "@/components/extend/input-mapper";
import { useRouter } from "next/navigation";
import {
  Department,
  DropTestDto,
  DropTestFormInterface,
  PrimerDto,
  Site,
} from "@/types";
import DropTestTableForm from "./DropTestTableForm";
import { calculateDropTest } from "@/config/constants/dropTestCalculations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DropTestFormHeader from "./DropTestFormHeader";
import SiteDepartmentPrimerSelector from "@/components/forms/SiteDepartmentPrimerSelector";
import { FileText } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { exportReportDropTestById } from "@/api/services";

interface DropTestFormProps {
  initialData: DropTestDto;
  isEdit: boolean;
  isDisabled: boolean;
  onSaveProgress: (
    data: DropTestFormInterface,
    saveType: "progress" | "finalize",
    resetForm: (nextState?: Partial<FormikState<DropTestFormInterface>>) => void
  ) => void;
  onFinalize: (
    data: DropTestFormInterface,
    saveType: "progress" | "finalize",
    resetForm: (nextState?: Partial<FormikState<DropTestFormInterface>>) => void
  ) => void;
}

export default function DropTestForm({
  initialData,
  isEdit,
  isDisabled = false,
  onSaveProgress,
  onFinalize,
}: DropTestFormProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isClaculated, setIsCalculated] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
    resetForm,
    validateForm,
    setTouched,
  } = useFormik<DropTestFormInterface>({
    initialValues: getIntialValuesForDropTestForm(initialData),
    validationSchema: dropTestValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (isClaculated) {
        onFinalize(values, "finalize", resetForm);
      } else {
        setIsOpen(true);
      }
      setSubmitting(false);
    },
  });

  const router = useRouter();

  const defaultHPlusLabel = "H+  S";
  const defaultHMinusLabel = "H-  S";

  const hPlusTypeLabel =
    values?.hplusType !== null && values?.hplusType !== undefined
      ? `H+${values.hplusType} S`
      : defaultHPlusLabel;

  const hMinusTypeLabel =
    values?.hminusType !== null && values?.hminusType !== undefined
      ? `H-${values.hminusType} S`
      : defaultHMinusLabel;

  const exportReportDropTestByIdApi = useMutation({
    mutationKey: ["export-drop-test-by-id"],
    mutationFn: (id: number) => {
      return exportReportDropTestById(id);
    },
    onSuccess: (res, id) => {
      try {
        const blob = new Blob([res.data], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        const testNumber = initialData?.legacyId || id;
        link.download = `Primer Drop Test Report-${testNumber}.pdf`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("PDF downloaded successfully", {
          duration: 3000,
          description: `Drop test report ${testNumber} has been saved to your downloads folder.`,
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

  useEffect(() => {
    if (isClaculated) {
      setIsCalculated(false);
    }
  }, [values]);

  useEffect(() => {
    const newValues = getIntialValuesForDropTestForm(initialData);
    if (JSON.stringify(newValues) !== JSON.stringify(values)) {
      setValues(newValues);
    }
  }, [initialData]);

  const onSiteSelectionChange = useCallback(
    (val: string, item: Site) => {
      setValues((prevValues) => ({
        ...prevValues,
        siteCode: val,
        siteId: item?.id ? item.id : "",
      }));
    },
    [setValues]
  );

  const onDepartmentSelectionChange = useCallback(
    (val: string, item: Department) => {
      setValues((prevValues) => ({
        ...prevValues,
        departmentName: val,
        departmentId: item?.id ? item.id : "",
      }));
    },
    [setValues]
  );

  const onPrimerSelectionChange = useCallback(
    (val: string, item: PrimerDto) => {
      setValues((values) => {
        const testType = values.testType?.trim() || "Regular Run";
        const isRetest = testType === "Retest";

        // Extract department and site from the primer's department relationship
        const department = item?.department;
        const site = department?.site;

        // Set firingPinMeas based on firingPinMinSpec
        // If firingPinMinSpec > 0, set firingPinMeas to null (empty)
        // Otherwise, set firingPinMeas to 0
        const firingPinMinSpec = item?.firingPinMin ?? null;
        const firingPinMeas = 
          firingPinMinSpec !== null && firingPinMinSpec > 0 
            ? null 
            : 0;

        return {
          ...values,
          primer: item?.primerType?.trim() ?? "",
          primerId: item?.id ?? "",
          commMilCert: item?.commMilCert?.trim() ?? "",
          testHplusValue: item?.testHplusValue ?? null,
          testHminusValue: item?.testHminusValue ?? null,
          reTestHplusValue: item?.reTestHplusValue ?? null,
          reTestHminusValue: item?.reTestHminusValue ?? null,
          hplusType: item?.hplusType ?? null,
          hminusType: item?.hminusType ?? null,
          ballWeight: item?.ballWeight ?? null,
          ballDiameter: item?.ballDiameter ?? null,
          headSpaceSpec: item?.headSpace ?? null,
          firingPinMaxSpec: item?.firingPinMax ?? null,
          firingPinMinSpec: firingPinMinSpec,
          firingPinMeas: firingPinMeas,
          allFireHeightSpec: isRetest 
            ? item?.reTestHplusValue ?? null 
            : item?.testHplusValue ?? null,
          noFireHeightSpec: isRetest 
            ? item?.reTestHminusValue ?? null 
            : item?.testHminusValue ?? null,
          allFireHeight: 0,
          noFireHeight: 0,
          sampleSize: item?.commMilCert
            ? item.commMilCert.trim() === "Military" ||
              item.commMilCert.trim() === "Certified"
              ? 50
              : 25
            : null,
          // Auto-populate department if available, otherwise clear
          departmentName: department?.name?.trim() ?? "",
          departmentId: department?.id ?? "",
          // Auto-populate site if available, otherwise clear
          siteCode: site?.siteCode?.trim() ?? "",
          siteId: site?.id ?? "",
        };
      });
    },
    [setValues]
  );

  return (
    <Card className="!w-full overflow-auto max-h-[calc(100vh-19vh)] p-0 pb-4">
      <CardHeader className="sticky top-0 z-10 bg-white border-b !p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold">
            <DropTestFormHeader
              dispositionId={initialData?.dispositionId || 1}
              isEdit={isEdit}
              intialData={initialData}
            />
          </CardTitle>
          <div className="flex flex-wrap gap-2 [&>button]:cursor-pointer">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                router.push("/drop-test");
              }}
            >
              {isDisabled ? "Back" : "Cancel"}
            </Button>
            {!isDisabled ? (
              <>
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={async () => {
                    if (values?.primer === "" && !values?.primer) {
                      toast.warning("Please Select a Primer to Calculate", {
                        duration: 4000,
                        description:
                          "Primer field is required to perform calculations.",
                      });
                      return;
                    }

                    // Validate the form before calculating
                    await setTouched({
                      firingPinMeas: true,
                    });
                    
                    const validationErrors = await validateForm();
                    
                    // Check for validation errors
                    if (validationErrors && Object.keys(validationErrors).length > 0) {
                      if (validationErrors.firingPinMeas) {
                        toast.error("Validation Error", {
                          duration: 4000,
                          description: validationErrors.firingPinMeas as string,
                        });
                        return;
                      }
                    }

                    // If validation passes, proceed with calculation
                      const calculatedValues = calculateDropTest({ ...values });
                      setValues(calculatedValues);
                      setIsCalculated(true);
                      if (resultsRef.current) {
                        resultsRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }
                  }}
                  type="button"
                  disabled={isDisabled}
                >
                  Calculate
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                  type="button"
                  onClick={() => {
                    if (values?.primer === "" && !values?.primer) {
                      toast.warning("Please Select a Primer to Save Progress", {
                        duration: 4000,
                        description:
                          "Primer field is required to save progress.",
                      });
                      return;
                    }
                    onSaveProgress(
                      {
                        ...values,
                        disposition: "In-Progress",
                        dispositionId: 4,
                      },
                      "progress",
                      resetForm
                    );
                  }}
                  disabled={isDisabled}
                >
                  Save Progress
                </Button>
                <Button
                  className="hover:bg-red-600"
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (values?.disposition === "In-Progress") {
                      toast.error(
                        "Please change the disposition before finalizing.",
                        {
                          duration: 4000,
                          description:
                            "Disposition cannot be 'In-Progress' when finalizing.",
                        }
                      );
                      return;
                    }
                    handleSubmit();
                  }}
                >
                  Finalize
                </Button>
              </>
            ) : (
              <Button
                className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                onClick={() => {
                  toast.info("Generating PDF...", {
                    duration: 4000,
                    description:
                      "Please wait while the PDF is being generated.",
                  });
                  exportReportDropTestByIdApi.mutate(initialData.id!);
                }}
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <SiteDepartmentPrimerSelector
            isDisabled={isDisabled}
            values={values}
            errors={errors}
            touched={touched}
            onSiteSelectionChange={onSiteSelectionChange}
            onDepartmentSelectionChange={onDepartmentSelectionChange}
            onPrimerSelectionChange={onPrimerSelectionChange}
            className={`${
              isDisabled
                ? "text-blue-500 [&>div>div>button>div>div>div]:!text-blue-500 [&>div>div>button]:disabled:opacity-100 [&>div>div>*]:text-base [&>div>div>input]:disabled:text-blue-500 [&>div>div>input]:disabled:opacity-100"
                : ""
            }`}
          />
          {/* Top Header Section - Red Border */}
          <div className="flex flex-wrap gap-x-6 gap-4">
            {/* Left side - Basic info */}
            <div className="border border-red-500 rounded-xl p-4 flex flex-col gap-3 flex-auto">
              {headerFields.map((field) => (
                <InputMapper
                  key={`drop-test-form-${field.name}`}
                  field={{
                    ...field,
                    disabled: isDisabled ? true : field.disabled,
                  }}
                  className={`${
                    isDisabled
                      ? "text-blue-500 [&>*]:text-base [&>input]:disabled:text-blue-500 [&>input]:disabled:opacity-100"
                      : ""
                  }`}
                  value={values[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors[field.name as keyof typeof errors] as string}
                  touched={
                    touched[field.name as keyof typeof touched] as
                      | boolean
                      | undefined
                  }
                />
              ))}
            </div>

            {/* Right side - Manufacturing and Test info */}
            <div className="border border-red-500 rounded-xl p-4 flex flex-col gap-4 flex-auto">
              {/* MFG Column */}
              <div className="grid grid-cols-2 gap-3">
                {manufacturingFields.map((field, index) => (
                  <InputMapper
                    key={`field.name-${index}`}
                    inputType={field.inputType || "text"}
                    className={`!min-w-[100px] ${
                      index === 2 ? "col-span-2" : ""
                    } ${
                      isDisabled
                        ? "text-blue-500 [&>button]:disabled:text-blue-500 [&>button]:disabled:opacity-100 [&>*]:text-base [&>input]:disabled:text-blue-500 [&>input]:disabled:opacity-100"
                        : ""
                    }`}
                    field={{
                      ...field,
                      disabled: isDisabled ? true : field.disabled,
                    }}
                    value={
                      values?.[field?.name as keyof typeof values] !== undefined
                        ? values[field.name as keyof typeof values]
                        : ""
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[field.name as keyof typeof errors] as string}
                    touched={
                      touched[field.name as keyof typeof touched] as
                        | boolean
                        | undefined
                    }
                  />
                ))}
              </div>
              {/* Test Column */}
              <div className="grid grid-cols-2 gap-3">
                {testFields.map((field, index) => (
                  <InputMapper
                    key={`field.name-${index}`}
                    inputType={field.inputType || "text"}
                    className={`!min-w-[100px] ${
                      index === 2 ? "col-span-2" : ""
                    } ${
                      isDisabled
                        ? "text-blue-500 [&>button]:disabled:text-blue-500 [&>button]:disabled:opacity-100 [&>*]:text-base [&>input]:disabled:text-blue-500 [&>input]:disabled:opacity-100"
                        : ""
                    }`}
                    field={{
                      ...field,
                      disabled: isDisabled ? true : field.disabled,
                    }}
                    value={
                      values?.[field?.name as keyof typeof values] !== undefined
                        ? values[field.name as keyof typeof values]
                        : ""
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[field.name as keyof typeof errors] as string}
                    touched={
                      touched[field.name as keyof typeof touched] as
                        | boolean
                        | undefined
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-wrap gap-x-6 gap-4">
            {/* Left Column - Drop Test Table (Green Border) */}
            <div className="border border-black rounded-xl flex-auto p-4">
              <DropTestTableForm
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                isEdit={isEdit}
                isDisabled={isDisabled}
              />
            </div>

            {/* Middle Column - Primer Details (Red Border) */}
            <div className="flex flex-col gap-4 flex-auto">
              <div className="border border-red-500 rounded-xl p-4 flex flex-col gap-3">
                {primerDetailsFields.map((field) => (
                  <InputMapper
                    key={`drop-test-form-${field.name}`}
                    className={
                      "[&>input]:!opacity-100 [&>input]:disabled:text-blue-500 [&>input]:disabled:opacity-100"
                    }
                    field={{
                      ...field,
                      disabled: isDisabled ? true : field.disabled,
                    }}
                    value={
                      values?.[field?.name as keyof typeof values] !== undefined
                        ? values[field.name as keyof typeof values]
                        : ""
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[field.name as keyof typeof errors] as string}
                    touched={
                      touched[field.name as keyof typeof touched] as
                        | boolean
                        | undefined
                    }
                  />
                ))}
              </div>

              {/* Drop Test Measurements (Blue Border) */}
              <div className="flex flex-col gap-4 [&>div]:flex [&>div]:gap-3 [&>div]:flex-col [&>div]:border [&>div]:border-blue-500 [&>div]:rounded-xl [&>div]:p-4 [&>div>h4]:font-bold [&>div>h4]:text-center">
                <div className="!border-red-500">
                  <h4>Hi-Drop Test</h4>
                  {dropTestFields.map((field) => (
                    <InputMapper
                      key={`drop-test-form-${field.name}`}
                      className={
                        "[&>input]:!opacity-100 [&>input]:disabled:text-blue-500 [&>input]:disabled:opacity-100"
                      }
                      inputType="number"
                      field={{
                        ...field,
                        disabled: isDisabled ? true : field.disabled,
                      }}
                      value={
                        values?.[field?.name as keyof typeof values] !==
                        undefined
                          ? values[field.name as keyof typeof values]
                          : ""
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        errors[field.name as keyof typeof errors] as string
                      }
                      touched={
                        touched[field.name as keyof typeof touched] as
                          | boolean
                          | undefined
                      }
                    />
                  ))}
                </div>

                <div>
                  <h4>Ball</h4>
                  {ballFields.map((field) => {
                    const fieldValue = values?.[field?.name as keyof typeof values];
                    const formattedValue = 
                      field.name === "ballWeight" &&
                      fieldValue !== null && 
                      fieldValue !== undefined && 
                      !isNaN(Number(fieldValue))
                        ? Number(fieldValue).toFixed(2)
                        : fieldValue ?? "";

                    return (
                      <InputMapper
                        key={`drop-test-form-${field.name}`}
                        className={
                          "[&>input]:!opacity-100 [&>input]:disabled:text-blue-500 [&>input]:disabled:opacity-100"
                        }
                        field={{
                          ...field,
                          disabled: isDisabled ? true : field.disabled,
                        }}
                        value={formattedValue}
                        inputType="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors[field.name as keyof typeof errors] as string
                        }
                        touched={
                          touched[field.name as keyof typeof touched] as
                            | boolean
                            | undefined
                        }
                      />
                    );
                  })}
                </div>
                <div>
                  <h4>Firing Pin</h4>
                  {firingPinFields.map((field) => {
                    const fieldValue = values?.[field?.name as keyof typeof values];
                    // Format firingPinMinSpec and firingPinMaxSpec to 3 decimals, firingPinMeas as is
                    const formattedValue = 
                      (field.name === "firingPinMinSpec" || field.name === "firingPinMaxSpec") &&
                      fieldValue !== null && 
                      fieldValue !== undefined && 
                      !isNaN(Number(fieldValue))
                        ? Number(fieldValue).toFixed(3)
                        : fieldValue !== null && fieldValue !== undefined
                        ? fieldValue
                        : "";

                    return (
                    <InputMapper
                      key={`drop-test-form-${field.name}`}
                      className={
                        "[&>input]:!opacity-100 [&>input]:disabled:text-blue-500 [&>input]:disabled:opacity-100"
                      }
                      inputType="number"
                      field={{
                        ...field,
                        disabled: isDisabled ? true : field.disabled,
                      }}
                        value={formattedValue}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        errors[field.name as keyof typeof errors] as string
                      }
                      touched={
                        touched[field.name as keyof typeof touched] as
                          | boolean
                          | undefined
                      }
                    />
                    );
                  })}
                </div>

                <div>
                  <h4>Head Space</h4>
                  {headSpaceFields.map((field) => {
                    const fieldValue = values?.[field?.name as keyof typeof values];
                    const formattedValue = 
                      fieldValue !== null && 
                      fieldValue !== undefined && 
                      !isNaN(Number(fieldValue))
                        ? Number(fieldValue).toFixed(3)
                        : "";

                    return (
                      <InputMapper
                        key={`drop-test-form-${field.name}`}
                        className="text-blue-500 [&>input]:!opacity-100"
                        inputType="number"
                        field={{
                          ...field,
                          disabled: isDisabled ? true : field.disabled,
                        }}
                        value={formattedValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors[field.name as keyof typeof errors] as string
                        }
                        touched={
                          touched[field.name as keyof typeof touched] as
                            | boolean
                            | undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/*Sub Content Area */}
          <div className="flex flex-wrap gap-x-6 gap-4">
            {/* Left Content - Results (Green Border) */}
            <div
              className="border border-green-500 rounded-xl p-4 flex flex-col gap-3 flex-auto"
              ref={resultsRef}
            >
              <div className="flex-auto">
                <h4 className="text-center font-bold mb-2">Results</h4>
                <div className="flex flex-col justify-center gap-3 items-center">
                  {resultsFields.map((field) => {
                    const dynamicLabel =
                      field.name === "h5S"
                        ? hPlusTypeLabel
                        : field.name === "h2S"
                          ? hMinusTypeLabel
                          : field.label;

                    
                    const fieldValue = values?.[field?.name as keyof typeof values];
                    const formattedValue = 
                      fieldValue !== null && 
                      fieldValue !== undefined && 
                      !isNaN(Number(fieldValue))
                        ? Number(fieldValue).toFixed(2)
                        : "";

                    return (
                      <InputMapper
                        className="!max-w-[100px] text-blue-500 [&>input]:disabled:opacity-100 [&>input]:border-green-500"
                        key={`drop-test-form-${field.name}`}
                        inputType="number"
                        field={{
                          ...field,
                          label: dynamicLabel,
                          disabled: true,
                        }}
                        value={formattedValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={undefined}
                        touched={undefined}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex-auto border border-blue-500 rounded-xl">
              <div className="grid grid-rows-5 grid-cols-4 p-4 gap-3 w-full">
                <div className="row-start-1 row-end-3 col-start-1 col-end-3 flex flex-col gap-3">
                  {fireHeightFields.map((field) => (
                    <InputMapper
                      className="!min-w-[100px] [&>input]:border [&>input]:border-green-500 [&>input]:disabled:text-blue-500 [&>input]:disabled:opacity-100"
                      key={`drop-test-form-${field.name}`}
                      inputType="number"
                      field={{
                        ...field,
                        disabled: isDisabled ? true : field.disabled,
                      }}
                      value={
                        values?.[field?.name as keyof typeof values] !==
                        undefined
                          ? values[field.name as keyof typeof values]
                          : ""
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        errors[field.name as keyof typeof errors] as string
                      }
                      touched={
                        touched[field.name as keyof typeof touched] as
                          | boolean
                          | undefined
                      }
                    />
                  ))}
                </div>
                <div className="row-start-1 row-end-2 col-start-3 col-end-5">
                  <div className="">
                    <Label
                      htmlFor="date"
                      className="px-1 mb-1 font-semibold text-gray-700 !text-lg"
                    >
                      Sample Size
                      {/* <span className="text-destructive">*</span> */}
                    </Label>
                    <Input
                      className={`!min-w-[100px] ${
                        errors?.sampleSize && touched?.sampleSize
                          ? "border-destructive"
                          : ""
                      } text-blue-500 text-base disabled:opacity-100`}
                      placeholder="Sample Size"
                      id="sampleSize"
                      disabled={true}
                      type="number"
                      name="sampleSize"
                      value={values?.sampleSize || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors?.sampleSize && touched?.sampleSize ? (
                      <div className="text-xs text-destructive">
                        {errors.sampleSize}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="row-start-2 row-end-3 col-start-3 col-end-5 flex justify-around items-end font-semibold text-gray-700 text-sm">
                  <p>Regular Run</p>
                  <p>Restest Value</p>
                </div>
                <div className="row-start-3 row-end-4 col-start-1 col-end-2 flex flex-col gap-3 justify-center items-center font-semibold text-gray-700 text-sm">
                  <p>{hPlusTypeLabel}</p>
                  <p>{hMinusTypeLabel}</p>
                </div>
                <div className="row-start-3 row-end-4 col-start-2 col-end-3 flex flex-col gap-3 justify-center text-right items-right font-semibold text-gray-700 text-sm">
                  <p>H Plus Spec:</p>
                  <p>H Minus Spec:</p>
                </div>
                <div className="row-start-3 row-end-4 col-start-3 col-end-4 flex flex-col gap-1 justify-center items-center font-semibold text-sm [&>input]:text-base [&>input]:text-blue-500 [&>input]:disabled:opacity-100">
                  <Input
                    className="!max-w-[200px] !h-8"
                    type="number"
                    value={
                      values?.testHplusValue !== null && 
                      values?.testHplusValue !== undefined && 
                      !isNaN(Number(values.testHplusValue))
                        ? Number(values.testHplusValue).toFixed(2)
                        : ""
                    }
                    disabled={true}
                    name="testHplusValue"
                  />
                  <Input
                    className="!max-w-[200px] !h-8"
                    type="number"
                    value={
                      values?.testHminusValue !== null && 
                      values?.testHminusValue !== undefined && 
                      !isNaN(Number(values.testHminusValue))
                        ? Number(values.testHminusValue).toFixed(2)
                        : ""
                    }
                    disabled={true}
                    name="testHminusValue"
                  />
                </div>
                <div className="row-start-3 row-end-4 col-start-4 col-end-5 flex flex-col gap-1 justify-center items-center font-semibold text-sm [&>input]:text-base [&>input]:text-blue-500 [&>input]:disabled:opacity-100">
                  <Input
                    className="!max-w-[200px] !h-8"
                    type="number"
                    value={
                      values?.reTestHplusValue !== null && 
                      values?.reTestHplusValue !== undefined && 
                      !isNaN(Number(values.reTestHplusValue))
                        ? Number(values.reTestHplusValue).toFixed(2)
                        : ""
                    }
                    disabled={true}
                    name="reTestHplusValue"
                  />
                  <Input
                    className="!max-w-[200px] !h-8"
                    key={`drop-test-form-testHplusValue`}
                    type="number"
                    disabled={true}
                    value={
                      values?.reTestHminusValue !== null && 
                      values?.reTestHminusValue !== undefined && 
                      !isNaN(Number(values.reTestHminusValue))
                        ? Number(values.reTestHminusValue).toFixed(2)
                        : ""
                    }
                    name="reTestHminusValue"
                  />
                </div>
                <div className="row-start-4 row-end-6 col-start-1 col-end-3 flex flex-col gap-3">
                  {specFields.map((field) => {
                    const fieldValue = values?.[field?.name as keyof typeof values];
                    const formattedValue = 
                      fieldValue !== null && 
                      fieldValue !== undefined && 
                      !isNaN(Number(fieldValue))
                        ? Number(fieldValue).toFixed(2)
                        : "";

                    return (
                    <InputMapper
                      key={`drop-test-form-${field.name}`}
                      className="text-blue-500 [&>input]:!opacity-100"
                      inputType="number"
                      field={{
                        ...field,
                        disabled: isDisabled ? true : field.disabled,
                      }}
                        value={formattedValue}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        errors[field.name as keyof typeof errors] as string
                      }
                      touched={
                        touched[field.name as keyof typeof touched] as
                          | boolean
                          | undefined
                      }
                    />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="flex flex-wrap gap-x-6 gap-4">
            <div className="border border-red-500 rounded-xl p-4 flex flex-col gap-3 flex-auto">
              {statusFields.map((field, index) => (
                <InputMapper
                  field={{
                    ...field,
                    disabled: isDisabled ? true : field.disabled,
                  }}
                  className={`${
                    isDisabled
                      ? "text-blue-500 [&>button>div>div>div]:!text-blue-500 [&>button]:disabled:opacity-100 [&>div>div>*]:text-base [&>input]:disabled:text-blue-500 [&>input]:!opacity-100"
                      : ""
                  }`}
                  key={`form-field-${field.name}-${index}`}
                  options={field.options || []}
                  value={
                    values?.[field?.name as keyof typeof values] !== undefined
                      ? values[field.name as keyof typeof values]
                      : ""
                  }
                  onValueChange={(val: string) => {
                    setFieldValue(field.name, val);
                    if (field.name === "disposition") {
                      setFieldValue(
                        "dispositionId",
                        Object.entries(Disposition).find(
                          ([key, value]) => value === val
                        )?.[0] || 4
                      );
                    }
                    if (field.name === "testType") {
                      const isRetest = val?.trim() === "Retest";
                      setFieldValue(
                        "allFireHeightSpec",
                        isRetest ? values.reTestHplusValue : values.testHplusValue
                      );
                      setFieldValue(
                        "noFireHeightSpec",
                        isRetest ? values.reTestHminusValue : values.testHminusValue
                      );
                    }
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors[field.name as keyof typeof errors] as string}
                  touched={
                    touched[field.name as keyof typeof touched] as
                      | boolean
                      | undefined
                  }
                />
              ))}
            </div>
            {isEdit ? (
              <div className="flex-auto border border-blue-500 rounded-xl p-4 font-semibold text-xl flex flex-col justify-center items-center">
                <h4>Test Number:</h4>
                <h3 className="text-blue-500">{values?.testNumber || ""}</h3>
              </div>
            ) : null}
          </div>

          {/* Dialog for confirmation */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Are you sure you want to Finalize this test?
                </DialogTitle>
                <DialogDescription className="text-lg">
                  Once Finalized, you will not be able to edit the values again.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    setIsOpen(false);
                    onFinalize(values, "finalize", resetForm);
                  }}
                >
                  Yes, Finalize
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </CardContent>
    </Card>
  );
}

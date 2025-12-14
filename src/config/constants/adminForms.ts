import { InputField } from "@/types";
import * as Yup from "yup";

export const siteValidationSchema = Yup.object({
  siteCode: Yup.string().required("Site Code is required").trim().min(1, "Site Code cannot be empty"),
  name: Yup.string().required("Site Name is required").trim().min(1, "Site Name cannot be empty"),
  status: Yup.boolean()
});

export const siteFields: InputField<any>[] = [
  { label: "Site Code", name: "siteCode", type: "input", placeholder: "Enter site code" },
  { label: "Site Name", name: "name", type: "input", placeholder: "Enter site name" }
];

export const departmentValidationSchema = Yup.object({
  name: Yup.string().required("Department Name is required").trim().min(1, "Department Name cannot be empty"),
  siteId: Yup.string().required("Site is required").test("is-not-empty", "Please select a site", (value) => value !== ""),
  status: Yup.boolean()
});

export const departmentFields: InputField<any>[] = [
  { label: "Department Name", name: "name", type: "input", placeholder: "Enter department name" },
  { label: "Site", name: "siteId", type: "select", placeholder: "Select a site" }
];

const createNumericValidation = (fieldName: string) => Yup.mixed()
  .test('is-number', `${fieldName} must be a valid number (numbers only)`, (value) => {
      if (value === '' || value === null || value === undefined) return true;
    const numericRegex = /^-?\d*\.?\d+$/;
    const stringValue = String(value);
    return numericRegex.test(stringValue) && !isNaN(Number(value));
    })
  .test('is-required', `${fieldName} is required`, (value) => {
      return value !== '' && value !== null && value !== undefined;
    })
  .test('is-positive', `${fieldName} must be a positive number`, (value) => {
      if (value === '' || value === null || value === undefined) return true;
      return Number(value) >= 0;
  });

export const primerValidationSchema = Yup.object({
  primerType: Yup.string().required("Primer Name is required").trim().min(1, "Primer Name cannot be empty"),
  departmentId: Yup.number().required("Department is required").nullable().transform((value, originalValue) => (originalValue === "" ? null : value)),
  commMilCert: Yup.string().required("Comm Mil Cert is required").trim().min(1, "Comm Mil Cert cannot be empty"),
  highDropTest: createNumericValidation('High Drop Test'),
  hplusType: createNumericValidation('H+ Type'),
  hminusType: createNumericValidation('H- Type'),
  ballWeight: createNumericValidation('Ball Weight'),
  ballDiameter: createNumericValidation('Ball Diameter'),
  headSpace: createNumericValidation('Head Space'),
  testHplusValue: createNumericValidation('Test H+ Value'),
  testHminusValue: createNumericValidation('Test H- Value'),
  reTestHplusValue: createNumericValidation('Re-Test H+ Value'),
  reTestHminusValue: createNumericValidation('Re-Test H- Value'),
  firingPinMax: createNumericValidation('Firing Pin Max'),
  firingPinMin: createNumericValidation('Firing Pin Min'),
  allFireValue: createNumericValidation('All Fire Value'),
  noFireValue: createNumericValidation('No Fire Value'),
});

export const primerBasicFields: InputField<any>[] = [
  { label: "Primer Name", name: "primerType", type: "input", placeholder: "Enter primer name" },
  { label: "Department", name: "departmentId", type: "select", placeholder: "Select a department" },
  { label: "Comm Mil Cert", name: "commMilCert", type: "select", placeholder: "Select comm mil cert" },
  { label: "High Drop Test", name: "highDropTest", type: "input", inputType: "number", placeholder: "Enter high drop test(0-100)" }
];

export const primerHTypeFields: InputField<any>[] = [
  { label: "H+ Type", name: "hplusType", type: "input", inputType: "number", placeholder: "Enter H+ type (e.g., 4)" },
  { label: "H- Type", name: "hminusType", type: "input", inputType: "number", placeholder: "Enter H- type (e.g., 2)" }
];

export const primerPhysicalFields: InputField<any>[] = [
  { label: "Ball Weight", name: "ballWeight", type: "input", inputType: "number", placeholder: "Enter ball weight (e.g., 1.94)" },
  { label: "Ball Diameter", name: "ballDiameter", type: "input", inputType: "number", placeholder: "Enter ball diameter (e.g., 3.12345)" },
  { label: "Head Space", name: "headSpace", type: "input", inputType: "number", placeholder: "Enter head space (e.g., 0.5)" }
];

export const primerTestFields: InputField<any>[] = [
  { label: "Test H+ Value", name: "testHplusValue", type: "input", inputType: "number", placeholder: "Enter test H+ value (e.g., 9.2)" },
  { label: "Test H- Value", name: "testHminusValue", type: "input", inputType: "number", placeholder: "Enter test H- value (e.g., 2.0)" },
  { label: "Re-Test H+ Value", name: "reTestHplusValue", type: "input", inputType: "number", placeholder: "Enter re-test H+ value (e.g., 10.0)" },
  { label: "Re-Test H- Value", name: "reTestHminusValue", type: "input", inputType: "number", placeholder: "Enter re-test H- value (e.g., 2.0)" },
  { label: "Firing Pin Max", name: "firingPinMax", type: "input", inputType: "number", placeholder: "Enter firing pin max (e.g., 0.125)" },
  { label: "Firing Pin Min", name: "firingPinMin", type: "input", inputType: "number", placeholder: "Enter firing pin min (e.g., 0.100)" },
  { label: "All Fire Value", name: "allFireValue", type: "input", inputType: "number", placeholder: "Enter all fire value (e.g., 0.0)" },
  { label: "No Fire Value", name: "noFireValue", type: "input", inputType: "number", placeholder: "Enter no fire value (e.g., 0.0)" }
];

export const siteFormFields: InputField<any>[] = [
  { label: "Site Code", name: "siteCode", type: "input", placeholder: "Enter site code" },
  { label: "Site Name", name: "name", type: "input", placeholder: "Enter site name" }
];

export const departmentFormFields: InputField<any>[] = [
  { label: "Department Name", name: "name", type: "input", placeholder: "Enter department name" },
  { label: "Site", name: "siteId", type: "select", placeholder: "Select a site" }
];

export const primerFormSections = {
  basic: { title: "Basic Information", fields: primerBasicFields },
  hType: { title: "H+ and H- Type Values", fields: primerHTypeFields },
  physical: { title: "Physical Properties", fields: primerPhysicalFields },
  test: { title: "Test Values", fields: primerTestFields }
};

export const siteFormSections = {
  basic: { title: "Site Details", fields: siteFormFields }
};

export const departmentFormSections = {
  basic: { title: "Department Details", fields: departmentFormFields }
};

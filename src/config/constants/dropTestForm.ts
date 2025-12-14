import {
  DropTestDto,
  DropTestFormFieldNames,
  DropTestFormInterface,
  InputField,
} from "@/types";
import * as Yup from "yup";
import { Disposition, TestType } from "../enums";

export const dropTestValidationSchema = Yup.object({
  // Basic Info
  siteCode: Yup.string().required("Site is required"),
  departmentName: Yup.string().required("Department is required"),
  primer: Yup.string().required("Primer is required"),
  lotNumber: Yup.string(),
  eotmNumber: Yup.string(),
  crossSection: Yup.string(),

  // Manufacturing Info
  mfgDate: Yup.date().required("MFG Date is required"),
  mfgShift: Yup.string().required("MFG Shift is required"),
  mfgUnit: Yup.string().required("MFG Unit is required"),

  // Test Info
  testDate: Yup.date().required("Test Date is required"),
  testShift: Yup.string().required("Test Shift is required"),
  testUnit: Yup.string().required("Test Unit is required"),

  // Primer Details
  primerENumber: Yup.string(),
  primerShellcaseE: Yup.string(),
  headStamp: Yup.string(),

  // Drop Test Measurements
  highDropHeight: Yup.number().nullable(),
  qtyDropped: Yup.number().nullable(),
  qtyMisfired: Yup.number().nullable(),

  // Ball Measurements
  ballWeight: Yup.number().nullable(),
  ballDiameter: Yup.number().nullable(),

  // Firing Pin Specs
  firingPinMinSpec: Yup.number().nullable(),
  firingPinMaxSpec: Yup.number().nullable(),
  firingPinMeas: Yup.number()
    .nullable()
    .when("firingPinMinSpec", {
      is: (firingPinMinSpec: number | null | undefined) => 
        firingPinMinSpec !== null && firingPinMinSpec !== undefined && firingPinMinSpec > 0,
      then: (schema) => 
        schema
          .required("Firing Pin Meas is required when Firing Pin Min Spec is greater than zero")
          .typeError("Firing Pin Meas must be a number"),
      otherwise: (schema) => schema.nullable(),
    }),

  // Head Space
  headSpaceSpec: Yup.number().nullable(),

  // All Fire Height
  allFireHeight: Yup.number().required("All Fire Height is required"),
  noFireHeight: Yup.number().required("No Fire Height is required"),

  // Results
  hBar: Yup.number().nullable(),
  sDev: Yup.number().nullable(),
  h5S: Yup.number().nullable(),
  h2S: Yup.number().nullable(),

  // Specs
  allFireHeightSpec: Yup.number().required("All Fire Height Spec is required"),
  noFireHeightSpec: Yup.number().required("No Fire Height Spec is required"),

  // Sample Size
  sampleSize: Yup.number().required("Sample Size is required"),

  // Test Status
  testType: Yup.string().required("Test Type is required"),
  disposition: Yup.string().required("Disposition is required"),
  inspector: Yup.string().required("Inspector is required"),
  testNumber: Yup.string().nullable(),
  dispositionId: Yup.number().nullable(),
  siteId: Yup.number().nullable(),

  misfires: Yup.object().shape({
    1: Yup.number().nullable(),
    2: Yup.number().nullable(),
    3: Yup.number().nullable(),
    4: Yup.number().nullable(),
    5: Yup.number().nullable(),
    6: Yup.number().nullable(),
    7: Yup.number().nullable(),
    8: Yup.number().nullable(),
    9: Yup.number().nullable(),
    10: Yup.number().nullable(),
    11: Yup.number().nullable(),
    12: Yup.number().nullable(),
    13: Yup.number().nullable(),
    14: Yup.number().nullable(),
    15: Yup.number().nullable(),
    16: Yup.number().nullable(),
  }),
});

// Top Header Fields
export const headerFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "Lot #",
    name: "lotNumber",
    type: "input",
  },
  {
    label: "EO/TM #",
    name: "eotmNumber",
    type: "input",
  },
  {
    label: "Cross Sec. Q",
    name: "crossSection",
    type: "input",
  },
];

// Manufacturing Fields
export const manufacturingFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "Mfg. Date",
    name: "mfgDate",
    type: "date",
    required: true,
  },
  {
    label: "Mfg. Shift",
    name: "mfgShift",
    type: "input",
    required: true,
    inputType: "number",
  },
  {
    label: "Mfg. Unit",
    name: "mfgUnit",
    type: "input",
    required: true,
    inputType: "text",
  },
];

// Test Fields
export const testFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "Test Date",
    name: "testDate",
    type: "date",
    required: true,
  },
  {
    label: "Test Shift",
    name: "testShift",
    type: "input",
    required: true,
    inputType: "number",
  },
  {
    label: "Test Unit",
    name: "testUnit",
    type: "input",
    required: true,
    inputType: "text",
  },
];

// Primer Details (Right side of header)
export const primerDetailsFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "Primer E#",
    name: "primerENumber",
    type: "input",
  },
  {
    label: "Primer SC E#",
    name: "primerShellcaseE",
    type: "input",
  },
  {
    label: "Headstamp",
    name: "headStamp",
    type: "input",
  },
];

// Drop Test Measurements
export const dropTestFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "Qty Dropped",
    name: "qtyDropped",
    type: "input",
    disabled: false,
  },
  {
    label: "Qty Misfired",
    name: "qtyMisfired",
    type: "input",
    disabled: false,
  },
  {
    label: "High Drop Height",
    name: "highDropHeight",
    type: "input",
    disabled: false,
  },
];

// Ball Measurements
export const ballFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "Ball Weight",
    name: "ballWeight",
    type: "input",
    disabled: true,
  },
  {
    label: "Ball Diameter",
    name: "ballDiameter",
    type: "input",
    disabled: true,
  },
];

// Firing Pin Fields
export const firingPinFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "FiringPinMinSpec",
    name: "firingPinMinSpec",
    type: "input",
    disabled: true,
  },
  {
    label: "FiringPinMaxSpec",
    name: "firingPinMaxSpec",
    type: "input",
    disabled: true,
  },
  {
    label: "FiringPinMeas",
    name: "firingPinMeas",
    type: "input",
    disabled: false,
  },
];

// Head Space Fields
export const headSpaceFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "HeadSpaceSpec",
    name: "headSpaceSpec",
    type: "input",
    disabled: true,
  },
];

// Results Fields
export const resultsFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "H Bar",
    name: "hBar",
    type: "input",
  },
  {
    label: "S Dev",
    name: "sDev",
    type: "input",
  },
  {
    label: "H+5 S",
    name: "h5S",
    type: "input",
  },
  {
    label: "H-2 S",
    name: "h2S",
    type: "input",
  },
];

// Fire Height Fields
export const fireHeightFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "All Fire Height",
    name: "allFireHeight",
    type: "input",
    required: true,
  },
  {
    label: "No Fire Height",
    name: "noFireHeight",
    type: "input",
    required: true,
  },
];

// Spec Fields
export const specFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "All Fire Height Spec",
    name: "allFireHeightSpec",
    type: "input",
    disabled: true,
  },
  {
    label: "No Fire Height Spec",
    name: "noFireHeightSpec",
    type: "input",
    disabled: true,
  },
];

// Bottom Status Fields
export const statusFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "Test Type",
    name: "testType",
    type: "select",
    required: true,
    options: Object.keys(TestType)
      .filter((key) => isNaN(Number(key))) // Remove numeric keys
      .map((key) => ({
        label: key,
        value: key,
      })),
  },
  {
    label: "Disposition",
    name: "disposition",
    type: "select",
    disabled: false,
    required: true,
    options: Object.keys(Disposition)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: key,
      })),
  },
  {
    label: "Inspector",
    name: "inspector",
    type: "input",
    required: true,
  },
];

// Additional Fields
export const additionalFields: InputField<DropTestFormFieldNames>[] = [
  {
    label: "Test Number",
    name: "testNumber",
    type: "input",
    required: true,
    disabled: true,
  },
];

export const getIntialValuesForDropTestForm = (
  initialData: DropTestDto
): DropTestFormInterface => {
  return {
    // Header Fields
    id: initialData.id || 0,
    primer: initialData?.primerName?.trim() || "",
    primerId: initialData.primerId || "",
    lotNumber: initialData.lotNumber?.trim() || "",
    eotmNumber: initialData.eoTmnumber?.trim() || "",
    crossSection: initialData.crossSecQ?.trim() || "",

    hplusType: initialData.hplusType,
    hminusType: initialData.hminusType,

    // Manufacturing Fields
    mfgDate: initialData.mfgdate || formatToLocalISO(new Date()),
    mfgShift: initialData.mfgshift ?? null,
    mfgUnit: initialData.mfgunit?.trim() || "",

    // Test Fields
    testDate: initialData.testDate || formatToLocalISO(new Date()),
    testShift: initialData.testShift,
    testUnit: initialData.testUnit?.trim() || "",

    // Primer Details
    primerENumber: initialData.primerEnumber?.trim() || "",
    primerShellcaseE: initialData.primerShellcaseEnumber?.trim() || "",
    headStamp: initialData.headStamp?.trim() || "",

    // Drop Test Fields
    highDropHeight: initialData.highDropHeight,
    qtyDropped: initialData.qtyDropped,
    qtyMisfired: initialData.qtyMisfired,

    // Ball Fields
    ballWeight: initialData.ballWeight,
    ballDiameter: initialData.ballDiameter,

    // Firing Pin Fields
    firingPinMinSpec: initialData.firingPinMinSpec,
    firingPinMaxSpec: initialData.firingPinMaxSpec,
    firingPinMeas: (() => {
      // If firingPinMinSpec > 0, set firingPinMeas to null (empty)
      // Otherwise, set firingPinMeas to 0
      // For existing forms (id > 0), preserve the existing value
      const firingPinMinSpec = initialData.firingPinMinSpec;
      const isNewForm = !initialData.id || initialData.id === 0;
      
      if (isNewForm) {
        // For new forms, apply the rule based on firingPinMinSpec
        if (firingPinMinSpec !== null && firingPinMinSpec !== undefined && firingPinMinSpec > 0) {
          return null;
        }
        return 0;
      } else {
        // For existing forms, preserve the existing value
        return initialData.firingPinMeas ?? null;
      }
    })(),

    // Head Space
    headSpaceSpec: initialData.headSpaceSpec,

    // Results
    hBar: initialData.hbarCalc,
    sDev: initialData.sdevCalc,
    h5S: initialData.hplusCal,
    h2S: initialData.hminusCal,

    // Fire Heights
    allFireHeight: initialData.allFireHeight,
    noFireHeight: initialData.noFireHeight,

    // Specs
    testHplusValue: initialData.testHplusValue,
    testHminusValue: initialData.testHminusValue,
    reTestHplusValue: initialData.reTestHplusValue,
    reTestHminusValue: initialData.reTestHminusValue,
    
    testType: initialData.testTypeName?.trim() || "",
    
    allFireHeightSpec: (() => {
      const testType = initialData.testTypeName?.trim() || "";
      const isRetest = testType === "Retest";
      return isRetest ? initialData.reTestHplusValue : initialData.testHplusValue;
    })(),
    noFireHeightSpec: (() => {
      const testType = initialData.testTypeName?.trim() || "";
      const isRetest = testType === "Retest";
      return isRetest ? initialData.reTestHminusValue : initialData.testHminusValue;
    })(),

    // Sample Size
    sampleSize: initialData.sampleSize,
    disposition: initialData.disposition?.trim() || "In-Progress",
    dispositionId: initialData.dispositionId || 4,
    inspector: initialData.inspector?.trim() || "",

    // Additional Fields
    testNumber: initialData.legacyId || null,

    legacySource: initialData.legacySource?.trim() || "",
    commMilCert: initialData.commMilCert?.trim() || "",
    siteCode: initialData.siteCode?.trim() || "",
    siteId: initialData.siteId || "",
    departmentId: initialData.departmentId || "",
    departmentName: initialData.departmentName || "",
    status: initialData.status || 0,

    //table fields
    misfires: {
      1: initialData.misfires1 ?? null,
      2: initialData.misfires2 ?? null,
      3: initialData.misfires3 ?? null,
      4: initialData.misfires4 ?? null,
      5: initialData.misfires5 ?? null,
      6: initialData.misfires6 ?? null,
      7: initialData.misfires7 ?? null,
      8: initialData.misfires8 ?? null,
      9: initialData.misfires9 ?? null,
      10: initialData.misfires10 ?? null,
      11: initialData.misfires11 ?? null,
      12: initialData.misfires12 ?? null,
      13: initialData.misfires13 ?? null,
      14: initialData.misfires14 ?? null,
      15: initialData.misfires15 ?? null,
      16: initialData.misfires16 ?? null,
    },
    percentMisfire: {
      1: initialData.percentMisfire1 || 0,
      2: initialData.percentMisfire2 || 0,
      3: initialData.percentMisfire3 || 0,
      4: initialData.percentMisfire4 || 0,
      5: initialData.percentMisfire5 || 0,
      6: initialData.percentMisfire6 || 0,
      7: initialData.percentMisfire7 || 0,
      8: initialData.percentMisfire8 || 0,
      9: initialData.percentMisfire9 || 0,
      10: initialData.percentMisfire10 || 0,
      11: initialData.percentMisfire11 || 0,
      12: initialData.percentMisfire12 || 0,
      13: initialData.percentMisfire13 || 0,
      14: initialData.percentMisfire14 || 0,
      15: initialData.percentMisfire15 || 0,
      16: initialData.percentMisfire16 || 0,
    },
    numberFired: {
      1: initialData.numberFired1 || 0,
      2: initialData.numberFired2 || 0,
      3: initialData.numberFired3 || 0,
      4: initialData.numberFired4 || 0,
      5: initialData.numberFired5 || 0,
      6: initialData.numberFired6 || 0,
      7: initialData.numberFired7 || 0,
      8: initialData.numberFired8 || 0,
      9: initialData.numberFired9 || 0,
      10: initialData.numberFired10 || 0,
      11: initialData.numberFired11 || 0,
      12: initialData.numberFired12 || 0,
      13: initialData.numberFired13 || 0,
      14: initialData.numberFired14 || 0,
      15: initialData.numberFired15 || 0,
      16: initialData.numberFired16 || 0,
    },
    varianceFactorK: {
      1: initialData.varianceFactorK1 || 0,
      2: initialData.varianceFactorK2 || 0,
      3: initialData.varianceFactorK3 || 0,
      4: initialData.varianceFactorK4 || 0,
      5: initialData.varianceFactorK5 || 0,
      6: initialData.varianceFactorK6 || 0,
      7: initialData.varianceFactorK7 || 0,
      8: initialData.varianceFactorK8 || 0,
      9: initialData.varianceFactorK9 || 0,
      10: initialData.varianceFactorK10 || 0,
      11: initialData.varianceFactorK11 || 0,
      12: initialData.varianceFactorK12 || 0,
      13: initialData.varianceFactorK13 || 0,
      14: initialData.varianceFactorK14 || 0,
      15: initialData.varianceFactorK15 || 0,
      16: initialData.varianceFactorK16 || 0,
    },
    ptimesK: {
      1: initialData.ptimesK1 || 0,
      2: initialData.ptimesK2 || 0,
      3: initialData.ptimesK3 || 0,
      4: initialData.ptimesK4 || 0,
      5: initialData.ptimesK5 || 0,
      6: initialData.ptimesK6 || 0,
      7: initialData.ptimesK7 || 0,
      8: initialData.ptimesK8 || 0,
      9: initialData.ptimesK9 || 0,
      10: initialData.ptimesK10 || 0,
      11: initialData.ptimesK11 || 0,
      12: initialData.ptimesK12 || 0,
      13: initialData.ptimesK13 || 0,
      14: initialData.ptimesK14 || 0,
      15: initialData.ptimesK15 || 0,
      16: initialData.ptimesK16 || 0,
    },
    skewnessFactorS: {
      1: initialData.skewnessFactorS1 || 0,
      2: initialData.skewnessFactorS2 || 0,
      3: initialData.skewnessFactorS3 || 0,
      4: initialData.skewnessFactorS4 || 0,
      5: initialData.skewnessFactorS5 || 0,
      6: initialData.skewnessFactorS6 || 0,
      7: initialData.skewnessFactorS7 || 0,
      8: initialData.skewnessFactorS8 || 0,
      9: initialData.skewnessFactorS9 || 0,
      10: initialData.skewnessFactorS10 || 0,
      11: initialData.skewnessFactorS11 || 0,
      12: initialData.skewnessFactorS12 || 0,
      13: initialData.skewnessFactorS13 || 0,
      14: initialData.skewnessFactorS14 || 0,
      15: initialData.skewnessFactorS15 || 0,
      16: initialData.skewnessFactorS16 || 0,
    },
    ptimesS: {
      1: initialData.ptimesS1 || 0,
      2: initialData.ptimesS2 || 0,
      3: initialData.ptimesS3 || 0,
      4: initialData.ptimesS4 || 0,
      5: initialData.ptimesS5 || 0,
      6: initialData.ptimesS6 || 0,
      7: initialData.ptimesS7 || 0,
      8: initialData.ptimesS8 || 0,
      9: initialData.ptimesS9 || 0,
      10: initialData.ptimesS10 || 0,
      11: initialData.ptimesS11 || 0,
      12: initialData.ptimesS12 || 0,
      13: initialData.ptimesS13 || 0,
      14: initialData.ptimesS14 || 0,
      15: initialData.ptimesS15 || 0,
      16: initialData.ptimesS16 || 0,
    },
  };
};

export const getFinalValuesForDropTestTable = (
  values: DropTestFormInterface
): DropTestDto => {
  let dto: DropTestDto = new DropTestDto();

  dto = {
    ...dto,
    // Header Fields
    id: values.id ?? 0,
    primerName: values.primer,
    primerId: Number(values.primerId),
    commMilCert: values.commMilCert,
    lotNumber: values.lotNumber,
    eoTmnumber: values.eotmNumber,
    crossSecQ: values.crossSection,

    hplusType: values.hplusType,
    hminusType: values.hminusType,
    // Manufacturing Fields
    mfgdate: values.mfgDate,
    mfgshift: values.mfgShift,
    mfgunit: values.mfgUnit,
    // Test Fields
    testDate: values.testDate,
    testShift: values.testShift,
    testUnit: values.testUnit,
    // Primer Details
    primerEnumber: values.primerENumber,
    primerShellcaseEnumber: values.primerShellcaseE,
    headStamp: values.headStamp,
    // Drop Test Fields
    highDropHeight: values.highDropHeight,
    qtyDropped: values.qtyDropped,
    qtyMisfired: values.qtyMisfired,
    // Ball Fields
    ballWeight: values.ballWeight,
    ballDiameter: values.ballDiameter,
    // Firing Pin Fields
    firingPinMinSpec: values.firingPinMinSpec,
    firingPinMaxSpec: values.firingPinMaxSpec,
    firingPinMeas: values.firingPinMeas || 0,
    // Head Space
    headSpaceSpec: values.headSpaceSpec,
    // Results
    hbarCalc: values.hBar,
    sdevCalc: values.sDev,
    hplusCal: values.h5S,
    hminusCal: values.h2S,
    // Fire Heights
    allFireHeight: values.allFireHeight,
    noFireHeight: values.noFireHeight,
    // Specs
    testHplusValue: values.testHplusValue,
    testHminusValue: values.testHminusValue,
    reTestHplusValue: values.reTestHplusValue,
    reTestHminusValue: values.reTestHminusValue,
    allFireHeightSpec: values.allFireHeightSpec,
    noFireHeightSpec: values.noFireHeightSpec,
    // Sample Size
    sampleSize: values.sampleSize,
    // Status Fields
    testTypeName: values.testType,
    disposition: values.disposition,
    dispositionId: Disposition[values.disposition as keyof typeof Disposition],
    inspector: values.inspector,
    // Additional Fields
    legacyId: values.testNumber,

    misfires1: values.misfires[1],
    misfires2: values.misfires[2],
    misfires3: values.misfires[3],
    misfires4: values.misfires[4],
    misfires5: values.misfires[5],
    misfires6: values.misfires[6],
    misfires7: values.misfires[7],
    misfires8: values.misfires[8],
    misfires9: values.misfires[9],
    misfires10: values.misfires[10],
    misfires11: values.misfires[11],
    misfires12: values.misfires[12],
    misfires13: values.misfires[13],
    misfires14: values.misfires[14],
    misfires15: values.misfires[15],
    misfires16: values.misfires[16],

    percentMisfire1: values.percentMisfire[1],
    percentMisfire2: values.percentMisfire[2],
    percentMisfire3: values.percentMisfire[3],
    percentMisfire4: values.percentMisfire[4],
    percentMisfire5: values.percentMisfire[5],
    percentMisfire6: values.percentMisfire[6],
    percentMisfire7: values.percentMisfire[7],
    percentMisfire8: values.percentMisfire[8],
    percentMisfire9: values.percentMisfire[9],
    percentMisfire10: values.percentMisfire[10],
    percentMisfire11: values.percentMisfire[11],
    percentMisfire12: values.percentMisfire[12],
    percentMisfire13: values.percentMisfire[13],
    percentMisfire14: values.percentMisfire[14],
    percentMisfire15: values.percentMisfire[15],
    percentMisfire16: values.percentMisfire[16],

    numberFired1: values.numberFired[1],
    numberFired2: values.numberFired[2],
    numberFired3: values.numberFired[3],
    numberFired4: values.numberFired[4],
    numberFired5: values.numberFired[5],
    numberFired6: values.numberFired[6],
    numberFired7: values.numberFired[7],
    numberFired8: values.numberFired[8],
    numberFired9: values.numberFired[9],
    numberFired10: values.numberFired[10],
    numberFired11: values.numberFired[11],
    numberFired12: values.numberFired[12],
    numberFired13: values.numberFired[13],
    numberFired14: values.numberFired[14],
    numberFired15: values.numberFired[15],
    numberFired16: values.numberFired[16],

    varianceFactorK1: values.varianceFactorK[1],
    varianceFactorK2: values.varianceFactorK[2],
    varianceFactorK3: values.varianceFactorK[3],
    varianceFactorK4: values.varianceFactorK[4],
    varianceFactorK5: values.varianceFactorK[5],
    varianceFactorK6: values.varianceFactorK[6],
    varianceFactorK7: values.varianceFactorK[7],
    varianceFactorK8: values.varianceFactorK[8],
    varianceFactorK9: values.varianceFactorK[9],
    varianceFactorK10: values.varianceFactorK[10],
    varianceFactorK11: values.varianceFactorK[11],
    varianceFactorK12: values.varianceFactorK[12],
    varianceFactorK13: values.varianceFactorK[13],
    varianceFactorK14: values.varianceFactorK[14],
    varianceFactorK15: values.varianceFactorK[15],
    varianceFactorK16: values.varianceFactorK[16],

    ptimesK1: values.ptimesK[1],
    ptimesK2: values.ptimesK[2],
    ptimesK3: values.ptimesK[3],
    ptimesK4: values.ptimesK[4],
    ptimesK5: values.ptimesK[5],
    ptimesK6: values.ptimesK[6],
    ptimesK7: values.ptimesK[7],
    ptimesK8: values.ptimesK[8],
    ptimesK9: values.ptimesK[9],
    ptimesK10: values.ptimesK[10],
    ptimesK11: values.ptimesK[11],
    ptimesK12: values.ptimesK[12],
    ptimesK13: values.ptimesK[13],
    ptimesK14: values.ptimesK[14],
    ptimesK15: values.ptimesK[15],
    ptimesK16: values.ptimesK[16],

    skewnessFactorS1: values.skewnessFactorS[1],
    skewnessFactorS2: values.skewnessFactorS[2],
    skewnessFactorS3: values.skewnessFactorS[3],
    skewnessFactorS4: values.skewnessFactorS[4],
    skewnessFactorS5: values.skewnessFactorS[5],
    skewnessFactorS6: values.skewnessFactorS[6],
    skewnessFactorS7: values.skewnessFactorS[7],
    skewnessFactorS8: values.skewnessFactorS[8],
    skewnessFactorS9: values.skewnessFactorS[9],
    skewnessFactorS10: values.skewnessFactorS[10],
    skewnessFactorS11: values.skewnessFactorS[11],
    skewnessFactorS12: values.skewnessFactorS[12],
    skewnessFactorS13: values.skewnessFactorS[13],
    skewnessFactorS14: values.skewnessFactorS[14],
    skewnessFactorS15: values.skewnessFactorS[15],
    skewnessFactorS16: values.skewnessFactorS[16],

    ptimesS1: values.ptimesS[1],
    ptimesS2: values.ptimesS[2],
    ptimesS3: values.ptimesS[3],
    ptimesS4: values.ptimesS[4],
    ptimesS5: values.ptimesS[5],
    ptimesS6: values.ptimesS[6],
    ptimesS7: values.ptimesS[7],
    ptimesS8: values.ptimesS[8],
    ptimesS9: values.ptimesS[9],
    ptimesS10: values.ptimesS[10],
    ptimesS11: values.ptimesS[11],
    ptimesS12: values.ptimesS[12],
    ptimesS13: values.ptimesS[13],
    ptimesS14: values.ptimesS[14],
    ptimesS15: values.ptimesS[15],
    ptimesS16: values.ptimesS[16],

    legacySource: values.legacySource,
    siteCode: values.siteCode,
    siteId: values.siteId ? Number(values.siteId) : null,
    departmentId:
      values.departmentId !== "" &&
      values?.departmentId !== null &&
      values?.departmentId !== undefined
        ? Number(values.departmentId)
        : null,

    status: values.status,
  };

  return dto;
};

/**
 * Formats a Date object to a local ISO string (YYYY-MM-DDTHH:mm:ss)
 * @param {Date} date - The date to format
 * @returns - string in YYYY-MM-DDTHH:mm:ss format
 */
function formatToLocalISO(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

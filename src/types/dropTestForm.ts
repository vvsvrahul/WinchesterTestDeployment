export interface DropTestFormInterface {
  // Header Fields
  id: number;
  primer: string;
  primerId: number | string;
  lotNumber: string;
  eotmNumber: string;
  crossSection: string;

  //
  hplusType: number | null;
  hminusType: number | null;

  // Manufacturing Fields
  mfgDate: string;
  mfgShift: number | null;
  mfgUnit: string;

  // Test Fields
  testDate: string;
  testShift: number | null;
  testUnit: string;

  // Primer Details
  primerENumber: string;
  primerShellcaseE: string;
  headStamp: string;

  // Drop Test Fields
  highDropHeight: number | null;
  qtyDropped: number | null;
  qtyMisfired: number | null;

  // Ball Fields
  ballWeight: number | null;
  ballDiameter: number | null;

  // Firing Pin Fields
  firingPinMinSpec: number | null;
  firingPinMaxSpec: number | null;
  firingPinMeas: number | null;

  // Head Space
  headSpaceSpec: number | null;

  // Results
  hBar: number | null;
  sDev: number | null;
  h5S: number | null;
  h2S: number | null;

  // Fire Heights
  allFireHeight: number | null;
  noFireHeight: number | null;

  // Specs
  testHplusValue: number | null;
  testHminusValue: number | null;
  reTestHplusValue: number | null;
  reTestHminusValue: number | null;
  allFireHeightSpec: number | null;
  noFireHeightSpec: number | null;

  // Sample Size
  sampleSize: number | null;

  // Status Fields
  testType: string;
  disposition: string;
  dispositionId: number | string;
  inspector: string;

  // Additional Fields
  testNumber: number | null;

  commMilCert: string;
  legacySource: string;
  siteCode: string;
  siteId: number | string;
  departmentId: number | string;
  departmentName: string;
  status: number;

  // Table Fields
  misfires: Record<number, number | null>;
  percentMisfire: Record<number, number | null>;
  numberFired: Record<number, number | null>;
  varianceFactorK: Record<number, number | null>;
  ptimesK: Record<number, number | null>;
  skewnessFactorS: Record<number, number | null>;
  ptimesS: Record<number, number | null>;
}

export type DropTestFormFieldNames = keyof DropTestFormInterface;

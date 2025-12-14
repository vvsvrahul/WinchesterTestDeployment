export interface PrimerDto {
  id: number;
  createdOn: string | null; // ISO date string
  primerType: string;
  hplusType: number;
  hminusType: number;
  testHplusValue: number;
  testHminusValue: number;
  reTestHplusValue: number;
  reTestHminusValue: number;
  ballWeight: number;
  ballDiameter: number;
  headSpace: number;
  firingPinMax: number;
  firingPinMin: number;
  highDropTest: number;
  allFireValue: number;
  noFireValue: number;
  commMilCert: string;
  departmentId: number | null;
  isDeleted?: boolean;
  department: Department | null;
}

export interface Department {
  id: number;
  createdOn: string | null; // ISO date string
  name: string;
  siteId: number | null;
  status?: boolean; // true = Active, false = Inactive (frontend-only for now)
  isDeleted?: boolean;
  primers: PrimerDto[];
  site: Site | null;
}

export interface Site {
  id: number;
  createdOn: string; // ISO date string
  siteCode: string;
  siteName: string;
  status?: boolean; 
  isDeleted?: boolean;
  departments: Department[];
}

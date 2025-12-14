import { Site, Department, PrimerDto } from "@/types";
import { MRT_ColumnDef, MRT_TableState } from "material-react-table";

export const siteTableColumnConfig: MRT_ColumnDef<Site>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
  },
  {
    accessorKey: "siteCode",
    header: "Site Code",
    size: 100,
  },
  {
    accessorKey: "siteName",
    header: "Site",
    size: 100,
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
    size: 100,
    accessorFn: (row: Site) =>
      row?.createdOn ? new Date(row.createdOn).toLocaleDateString() : "",
  },
];

export const siteTableInitialState: Partial<MRT_TableState<Site>> = {
  columnVisibility: {
    id: false,
    siteCode: true,
    siteName: true,
    createdOn: false,
  },
};

export const departmentTableColumnConfig: MRT_ColumnDef<Department>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 100,
  },
  {
    id: "siteCode",
    header: "Site Code",
    size: 100,
    enableColumnFilter: true,
    filterVariant: "text",
  },
  {
    id: "siteName",
    header: "Site",
    size: 100,
    enableColumnFilter: true,
    filterVariant: "text",
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
    size: 100,
    accessorFn: (row: Department) =>
      row?.createdOn ? new Date(row.createdOn).toLocaleDateString() : "",
  },
];

export const departmentTableInitialState: Partial<MRT_TableState<Department>> = {
  columnVisibility: {
    id: false,
    name: true,
    siteCode: true,
    siteName: true,
    createdOn: false,
  },
};

export const primerTableColumnConfig: MRT_ColumnDef<PrimerDto>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
  },
  {
    accessorKey: "primerType",
    header: "Name",
    size: 100,
  },
  {
    id: "department",
    header: "Department",
    size: 100,
    enableColumnFilter: true,
    filterVariant: "text",
  },
  {
    id: "siteCode",
    header: "Site Code",
    size: 100,
    enableColumnFilter: true,
    filterVariant: "text",
  },
  {
    accessorKey: "hplusType",
    header: "H+ Type",
    size: 80,
  },
  {
    accessorKey: "hminusType",
    header: "H- Type",
    size: 80,
  },
  {
    accessorKey: "testHplusValue",
    header: "Test H+ Value",
    size: 110,
    accessorFn: (row: PrimerDto) =>
      row?.testHplusValue ? row.testHplusValue.toFixed(2) : "",
  },
  {
    accessorKey: "testHminusValue",
    header: "Test H- Value",
    size: 110,
    accessorFn: (row: PrimerDto) =>
      row?.testHminusValue ? row.testHminusValue.toFixed(2) : "",
  },
  {
    accessorKey: "reTestHplusValue",
    header: "Re-Test H+ Value",
    size: 100,
    accessorFn: (row: PrimerDto) =>
      row?.reTestHplusValue ? row.reTestHplusValue.toFixed(2) : "",
  },
  {
    accessorKey: "reTestHminusValue",
    header: "Re-Test H- Value",
    size: 100,
    accessorFn: (row: PrimerDto) =>
      row?.reTestHminusValue ? row.reTestHminusValue.toFixed(2) : "",
  },
  {
    accessorKey: "ballWeight",
    header: "Ball Weight",
    size: 100,
    accessorFn: (row: PrimerDto) =>
      row?.ballWeight ? row.ballWeight.toFixed(6) : "",
  },
  {
    accessorKey: "ballDiameter",
    header: "Ball Diameter",
    size: 110,
    accessorFn: (row: PrimerDto) =>
      row?.ballDiameter ? row.ballDiameter.toFixed(4) : "",
  },
  {
    accessorKey: "headSpace",
    header: "Head Space",
    size: 100,
    accessorFn: (row: PrimerDto) =>
      row?.headSpace ? row.headSpace.toFixed(4) : "",
  },
  {
    accessorKey: "firingPinMax",
    header: "Firing Pin Max",
    size: 110,
    accessorFn: (row: PrimerDto) =>
      row?.firingPinMax ? row.firingPinMax.toFixed(2) : "",
  },
  {
    accessorKey: "firingPinMin",
    header: "Firing Pin Min",
    size: 110,
    accessorFn: (row: PrimerDto) =>
      row?.firingPinMin ? row.firingPinMin.toFixed(2) : "",
  },
  {
    accessorKey: "highDropTest",
    header: "High Drop Test",
    size: 110,
    accessorFn: (row: PrimerDto) =>
      row?.highDropTest ? row.highDropTest.toFixed(2) : "",
  },
  {
    accessorKey: "allFireValue",
    header: "All Fire Value",
    size: 110,
    accessorFn: (row: PrimerDto) =>
      row?.allFireValue ? row.allFireValue.toFixed(2) : "",
  },
  {
    accessorKey: "noFireValue",
    header: "No Fire Value",
    size: 110,
    accessorFn: (row: PrimerDto) =>
      row?.noFireValue ? row.noFireValue.toFixed(2) : "",
  },
  {
    accessorKey: "commMilCert",
    header: "Comm Mil Cert",
    size: 100,
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
    size: 100,
    accessorFn: (row: PrimerDto) =>
      row?.createdOn ? new Date(row.createdOn).toLocaleDateString() : "",
  },
];

export const primerTableInitialState: Partial<MRT_TableState<PrimerDto>> = {
  columnVisibility: {
    id: false,
    primerType: true,
    department: true,
    siteCode: true,
    hplusType: false,
    hminusType: false,
    testHplusValue: false,
    testHminusValue: false,
    reTestHplusValue: false,
    reTestHminusValue: false,
    ballWeight: false,
    ballDiameter: false,
    headSpace: false,
    firingPinMax: false,
    firingPinMin: false,
    highDropTest: true,
    allFireValue: false,
    noFireValue: false,
    commMilCert: true,
    createdOn: false,
  },
};

import { MRT_ColumnDef } from "material-react-table";
import { DropTestDto } from "@/types";

export const dispositionStyles: Record<string, string> = {
  Accept: "bg-[#1b5e20]",
  Reject: "bg-red-500",
  Retest: "bg-[#e65100]",
  "In-Progress": "bg-blue-500",
};

export const dropTestTableColumnConfig: MRT_ColumnDef<DropTestDto>[] = [
  {
    accessorKey: "createdOn",
    header: "Created On",
    accessorFn: (row: DropTestDto) =>
      row?.createdOn ? new Date(row.createdOn).toLocaleDateString() : "",
    enableSorting: false,
  },
  {
    accessorKey: "primerName",
    header: "Primer",
    enableSorting: false,
  },
  {
    accessorKey: "primerId",
    header: "Primer ID",
    enableSorting: false,
  },
  {
    accessorKey: "departmentId",
    header: "Department ID",
    enableSorting: false,
  },
  {
    accessorKey: "testdate",
    header: "Test Date",
    accessorFn: (row: DropTestDto) =>
      row?.testDate ? new Date(row.testDate).toLocaleDateString() : "",
  },
  {
    accessorKey: "departmentName",
    header: "Department",
    accessorFn: (row: DropTestDto) =>
      row?.department?.name || row?.departmentName || "",
    enableSorting: false,
  },
  {
    accessorKey: "siteCode",
    header: "Site",
    accessorFn: (row: DropTestDto) =>
      row?.site?.siteCode || row?.siteCode || "",
  },
  {
    accessorKey: "lotNumber",
    header: "Lot Number",
  },
  {
    accessorKey: "testTypeName",
    header: "Test Type",
  },
  {
    accessorKey: "disposition",
    header: "Disposition",
    enableSorting: false,
    Cell: ({ cell }) => (
      <div
        className={`${
          dispositionStyles?.[cell.getValue()?.toString()?.trim() || ""]
        } font-medium text-white px-1 py-1 rounded-sm text-center`}
      >
        {cell.getValue<string>()}
      </div>
    ),
  },
  {
    accessorKey: "dispositionId",
    header: "Disposition ID",
    enableSorting: false,
  },
  {
    accessorKey: "inspector",
    header: "Inspector",
  },
  {
    accessorKey: "siteId",
    header: "Site ID",
    enableSorting: false,
  },
  {
    accessorKey: "crossSecQ",
    header: "Cross Sec Q",
    enableSorting: false,
  },
  {
    accessorKey: "eoTmnumber",
    header: "EO TM Number",
    enableSorting: false,
  },
  {
    accessorKey: "mfgdate",
    header: "Mfg Date",
    accessorFn: (row: DropTestDto) =>
      row?.mfgdate ? new Date(row.mfgdate).toLocaleDateString() : "",
    enableSorting: false,
  },
  {
    accessorKey: "mfgshift",
    header: "Mfg Shift",
    enableSorting: false,
  },
  {
    accessorKey: "testDate",
    header: "Test Date Raw",
    enableSorting: false,
  },
  {
    accessorKey: "testShift",
    header: "Test Shift",
    enableSorting: false,
  },
  {
    accessorKey: "testUnit",
    header: "Test Unit",
    enableSorting: false,
  },
  {
    accessorKey: "sampleSize",
    header: "Sample Size",
    enableSorting: false,
  },
  {
    accessorKey: "primerEnumber",
    header: "Primer E Number",
    enableSorting: false,
  },
  {
    accessorKey: "primerShellcaseEnumber",
    header: "Primer Shellcase E Number",
    enableSorting: false,
  },
  {
    accessorKey: "headStamp",
    header: "Head Stamp",
    enableSorting: false,
  },
  {
    accessorKey: "allFireHeight",
    header: "All Fire Height",
    enableSorting: false,
  },
  {
    accessorKey: "noFireHeight",
    header: "No Fire Height",
    enableSorting: false,
  },
  {
    accessorKey: "misfires16",
    header: "Misfires 16",
    enableSorting: false,
  },
  {
    accessorKey: "misfires15",
    header: "Misfires 15",
    enableSorting: false,
  },
  {
    accessorKey: "misfires14",
    header: "Misfires 14",
    enableSorting: false,
  },
  {
    accessorKey: "misfires13",
    header: "Misfires 13",
    enableSorting: false,
  },
  {
    accessorKey: "misfires12",
    header: "Misfires 12",
    enableSorting: false,
  },
  {
    accessorKey: "misfires11",
    header: "Misfires 11",
    enableSorting: false,
  },
  {
    accessorKey: "misfires10",
    header: "Misfires 10",
    enableSorting: false,
  },
  {
    accessorKey: "misfires9",
    header: "Misfires 9",
    enableSorting: false,
  },
  {
    accessorKey: "misfires8",
    header: "Misfires 8",
    enableSorting: false,
  },
  {
    accessorKey: "misfires7",
    header: "Misfires 7",
    enableSorting: false,
  },
  {
    accessorKey: "misfires6",
    header: "Misfires 6",
    enableSorting: false,
  },
  {
    accessorKey: "misfires5",
    header: "Misfires 5",
    enableSorting: false,
  },
  {
    accessorKey: "misfires4",
    header: "Misfires 4",
    enableSorting: false,
  },
  {
    accessorKey: "misfires3",
    header: "Misfires 3",
    enableSorting: false,
  },
  {
    accessorKey: "misfires2",
    header: "Misfires 2",
    enableSorting: false,
  },
  {
    accessorKey: "misfires1",
    header: "Misfires 1",
    enableSorting: false,
  },
  {
    accessorKey: "hplusType",
    header: "H+ Type",
    enableSorting: false,
  },
  {
    accessorKey: "hminusType",
    header: "H- Type",
    enableSorting: false,
  },
  {
    accessorKey: "hplusCal",
    header: "H+ Cal",
    enableSorting: false,
  },
  {
    accessorKey: "hminusCal",
    header: "H- Cal",
    enableSorting: false,
  },
  {
    accessorKey: "qtyDropped",
    header: "Qty Dropped",
    enableSorting: false,
  },
  {
    accessorKey: "qtyMisfired",
    header: "Qty Misfired",
    enableSorting: false,
  },
  {
    accessorKey: "ballWeight",
    header: "Ball Weight",
    enableSorting: false,
  },
  {
    accessorKey: "ballDiameter",
    header: "Ball Diameter",
    enableSorting: false,
  },
  {
    accessorKey: "highDropHeight",
    header: "High Drop Height",
    enableSorting: false,
  },
  {
    accessorKey: "allFireHeightSpec",
    header: "All Fire Height Spec",
    enableSorting: false,
  },
  {
    accessorKey: "noFireHeightSpec",
    header: "No Fire Height Spec",
    enableSorting: false,
  },
  {
    accessorKey: "headSpaceSpec",
    header: "Head Space Spec",
    enableSorting: false,
  },
  {
    accessorKey: "firingPinMinSpec",
    header: "Firing Pin Min Spec",
    enableSorting: false,
  },
  {
    accessorKey: "firingPinMaxSpec",
    header: "Firing Pin Max Spec",
    enableSorting: false,
  },
  {
    accessorKey: "firingPinMeas",
    header: "Firing Pin Meas",
    enableSorting: false,
  },
  {
    accessorKey: "testHplusValue",
    header: "Test H+ Value",
    enableSorting: false,
  },
  {
    accessorKey: "testHminusValue",
    header: "Test H- Value",
    enableSorting: false,
  },
  {
    accessorKey: "reTestHplusValue",
    header: "Re Test H+ Value",
    enableSorting: false,
  },
  {
    accessorKey: "reTestHminusValue",
    header: "Re Test H- Value",
    enableSorting: false,
  },
  {
    accessorKey: "mfgunit",
    header: "Mfg Unit",
    enableSorting: false,
  },
  {
    accessorKey: "hbarCalc",
    header: "Hbar Calc",
    enableSorting: false,
  },
  {
    accessorKey: "sdevCalc",
    header: "Sdev Calc",
    enableSorting: false,
  },
  {
    accessorKey: "commMilCert",
    header: "Comm Mil Cert",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire16",
    header: "Percent Misfire 16",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire15",
    header: "Percent Misfire 15",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire14",
    header: "Percent Misfire 14",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire13",
    header: "Percent Misfire 13",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire12",
    header: "Percent Misfire 12",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire11",
    header: "Percent Misfire 11",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire10",
    header: "Percent Misfire 10",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire9",
    header: "Percent Misfire 9",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire8",
    header: "Percent Misfire 8",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire7",
    header: "Percent Misfire 7",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire6",
    header: "Percent Misfire 6",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire5",
    header: "Percent Misfire 5",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire4",
    header: "Percent Misfire 4",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire3",
    header: "Percent Misfire 3",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire2",
    header: "Percent Misfire 2",
    enableSorting: false,
  },
  {
    accessorKey: "percentMisfire1",
    header: "Percent Misfire 1",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired16",
    header: "Number Fired 16",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired15",
    header: "Number Fired 15",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired14",
    header: "Number Fired 14",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired13",
    header: "Number Fired 13",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired12",
    header: "Number Fired 12",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired11",
    header: "Number Fired 11",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired10",
    header: "Number Fired 10",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired9",
    header: "Number Fired 9",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired8",
    header: "Number Fired 8",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired7",
    header: "Number Fired 7",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired6",
    header: "Number Fired 6",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired5",
    header: "Number Fired 5",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired4",
    header: "Number Fired 4",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired3",
    header: "Number Fired 3",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired2",
    header: "Number Fired 2",
    enableSorting: false,
  },
  {
    accessorKey: "numberFired1",
    header: "Number Fired 1",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK16",
    header: "Variance Factor K16",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK15",
    header: "Variance Factor K15",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK14",
    header: "Variance Factor K14",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK13",
    header: "Variance Factor K13",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK12",
    header: "Variance Factor K12",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK11",
    header: "Variance Factor K11",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK10",
    header: "Variance Factor K10",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK9",
    header: "Variance Factor K9",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK8",
    header: "Variance Factor K8",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK7",
    header: "Variance Factor K7",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK6",
    header: "Variance Factor K6",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK5",
    header: "Variance Factor K5",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK4",
    header: "Variance Factor K4",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK3",
    header: "Variance Factor K3",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK2",
    header: "Variance Factor K2",
    enableSorting: false,
  },
  {
    accessorKey: "varianceFactorK1",
    header: "Variance Factor K1",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK16",
    header: "PxK 16",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK15",
    header: "PxK 15",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK14",
    header: "PxK 14",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK13",
    header: "PxK 13",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK12",
    header: "PxK 12",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK11",
    header: "PxK 11",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK10",
    header: "PxK 10",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK9",
    header: "PxK 9",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK8",
    header: "PxK 8",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK7",
    header: "PxK 7",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK6",
    header: "PxK 6",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK5",
    header: "PxK 5",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK4",
    header: "PxK 4",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK3",
    header: "PxK 3",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK2",
    header: "PxK 2",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesK1",
    header: "PxK 1",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS16",
    header: "Skewness Factor S16",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS15",
    header: "Skewness Factor S15",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS14",
    header: "Skewness Factor S14",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS13",
    header: "Skewness Factor S13",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS12",
    header: "Skewness Factor S12",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS11",
    header: "Skewness Factor S11",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS10",
    header: "Skewness Factor S10",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS9",
    header: "Skewness Factor S9",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS8",
    header: "Skewness Factor S8",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS7",
    header: "Skewness Factor S7",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS6",
    header: "Skewness Factor S6",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS5",
    header: "Skewness Factor S5",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS4",
    header: "Skewness Factor S4",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS3",
    header: "Skewness Factor S3",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS2",
    header: "Skewness Factor S2",
    enableSorting: false,
  },
  {
    accessorKey: "skewnessFactorS1",
    header: "Skewness Factor S1",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS16",
    header: "PxS 16",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS15",
    header: "PxS 15",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS14",
    header: "PxS 14",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS13",
    header: "PxS 13",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS12",
    header: "PxS 12",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS11",
    header: "PxS 11",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS10",
    header: "PxS 10",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS9",
    header: "PxS 9",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS8",
    header: "PxS 8",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS7",
    header: "PxS 7",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS6",
    header: "PxS 6",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS5",
    header: "PxS 5",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS4",
    header: "PxS 4",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS3",
    header: "PxS 3",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS2",
    header: "PxS 2",
    enableSorting: false,
  },
  {
    accessorKey: "ptimesS1",
    header: "PxS 1",
    enableSorting: false,
  },
  {
    accessorKey: "legacySource",
    header: "Legacy Source",
    enableSorting: false,
  },
  {
    accessorKey: "legacyId",
    header: "Test Number",
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
  },
];

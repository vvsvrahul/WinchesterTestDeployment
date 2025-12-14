"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";

import { Department, PrimerDto, Site } from "@/types";
import { 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  primerTypeLookup,
  siteLookup,
  updatePrimer 
} from "@/api/services";
import { departmentValidationSchema, departmentFields } from "@/config";
import InputMapper from "@/components/extend/input-mapper";

interface DepartmentFormProps {
  initialData: any;
  isEdit: boolean;
  departmentId?: string;
}

export default function DepartmentForm({
  initialData,
  isEdit,
  departmentId,
}: DepartmentFormProps): React.JSX.Element {
  const router = useRouter();

  const [addedPrimers, setAddedPrimers] = useState<PrimerDto[]>([]);
  const [availablePrimers, setAvailablePrimers] = useState<PrimerDto[]>([]);
  const [originalAddedPrimers, setOriginalAddedPrimers] = useState<PrimerDto[]>([]);
  const [selectedAvailable, setSelectedAvailable] = useState<number | null>(null);
  const [selectedAdded, setSelectedAdded] = useState<number | null>(null);

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
  });

  const createDepartmentMutation = useMutation({
    mutationFn: createDepartment,
  });

  const updatePrimerMutation = useMutation({
    mutationFn: updatePrimer,
  });

  const { data: primersData } = useQuery({
    queryKey: ['all-primers'],
    queryFn: () => primerTypeLookup({ PageSize: 1000 }),
    enabled: true,
  });

  const { data: sitesData } = useQuery({
    queryKey: ['all-sites'],
    queryFn: () => siteLookup({ PageSize: 1000 }),
    enabled: true,
  });

  useEffect(() => {
    if (primersData?.data?.items) {
      const allPrimers = primersData.data.items;
      
      if (isEdit && departmentId) {
        const currentDepartmentId = parseInt(departmentId);
        const addedPrimersList = allPrimers.filter(primer => primer.departmentId === currentDepartmentId);
        const availablePrimersList = allPrimers.filter(primer => primer.departmentId === null);
        
        setAddedPrimers(addedPrimersList);
        setAvailablePrimers(availablePrimersList);
        setOriginalAddedPrimers([...addedPrimersList]);
      } else {
        const unassignedPrimers = allPrimers.filter(primer => primer.departmentId === null);
        setAvailablePrimers(unassignedPrimers);
        setOriginalAddedPrimers([]);
      }
    }
  }, [primersData, isEdit, departmentId]);


  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      siteId: initialData?.siteId ? initialData.siteId.toString() : "",
      status: initialData?.status ?? true,
    },
    enableReinitialize: true,
    validationSchema: departmentValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const departmentPayload = {
          name: values.name,
          siteId: values.siteId ? parseInt(values.siteId) : null,
        };

        let departmentIdToUse: number;
        if (isEdit && departmentId) {
          const updateResult = await updateDepartmentMutation.mutateAsync({
            id: parseInt(departmentId),
            createdOn: new Date().toISOString(),
            ...departmentPayload,
          });
          departmentIdToUse = updateResult.data.id;
        } else {
          const createResult = await createDepartmentMutation.mutateAsync(departmentPayload);
          departmentIdToUse = createResult.data.id;
        }

        for (const primer of addedPrimers) {
          updatePrimerMutation.mutate({
            id: primer.id,
            createdOn: primer.createdOn || new Date().toISOString(),
            departmentId: departmentIdToUse,
            primerType: primer.primerType,
            hplusType: primer.hplusType,
            hminusType: primer.hminusType,
            testHplusValue: primer.testHplusValue,
            testHminusValue: primer.testHminusValue,
            reTestHplusValue: primer.reTestHplusValue,
            reTestHminusValue: primer.reTestHminusValue,
            ballWeight: primer.ballWeight,
            ballDiameter: primer.ballDiameter,
            headSpace: primer.headSpace,
            firingPinMax: primer.firingPinMax,
            firingPinMin: primer.firingPinMin,
            highDropTest: primer.highDropTest,
            allFireValue: primer.allFireValue,
            noFireValue: primer.noFireValue,
            commMilCert: primer.commMilCert,
          });
        }

        const originalAddedIds = originalAddedPrimers.map(primer => primer.id);
        const currentAddedIds = addedPrimers.map(primer => primer.id);
        const removedPrimerIds = originalAddedIds.filter(id => !currentAddedIds.includes(id));

        for (const primerId of removedPrimerIds) {
          const primer = originalAddedPrimers.find(p => p.id === primerId);
          if (primer) {
            updatePrimerMutation.mutate({
              id: primer.id,
              createdOn: primer.createdOn || new Date().toISOString(),
              departmentId: null,
              primerType: primer.primerType,
              hplusType: primer.hplusType,
              hminusType: primer.hminusType,
              testHplusValue: primer.testHplusValue,
              testHminusValue: primer.testHminusValue,
              reTestHplusValue: primer.reTestHplusValue,
              reTestHminusValue: primer.reTestHminusValue,
              ballWeight: primer.ballWeight,
              ballDiameter: primer.ballDiameter,
              headSpace: primer.headSpace,
              firingPinMax: primer.firingPinMax,
              firingPinMin: primer.firingPinMin,
              highDropTest: primer.highDropTest,
              allFireValue: primer.allFireValue,
              noFireValue: primer.noFireValue,
            commMilCert: primer.commMilCert,
            });
          }
        }

        router.push("/admin/department");
      } catch (error) {
        console.error("Error saving department:", error);
      }
    },
  });

  const handleAddPrimer = () => {
    if (selectedAvailable !== null && selectedAvailable >= 0) {
      const primerToAdd = availablePrimers[selectedAvailable];
      if (primerToAdd) {
        const updatedPrimer = { ...primerToAdd, departmentId: isEdit ? parseInt(departmentId!) : null };
        setAddedPrimers([...addedPrimers, updatedPrimer]);
        setAvailablePrimers(availablePrimers.filter((_, index) => index !== selectedAvailable));
        setSelectedAvailable(null);
      }
    }
  };

  const handleRemovePrimer = () => {
    if (selectedAdded !== null && selectedAdded >= 0) {
      const primerToRemove = addedPrimers[selectedAdded];
      if (primerToRemove) {
        const updatedPrimer = { ...primerToRemove, departmentId: null };
        setAvailablePrimers([...availablePrimers, updatedPrimer]);
        setAddedPrimers(addedPrimers.filter((_, index) => index !== selectedAdded));
        setSelectedAdded(null);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, primer: PrimerDto, source: 'available' | 'added') => {
    e.dataTransfer.setData('application/json', JSON.stringify({ primer, source }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, target: 'available' | 'added') => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const { primer, source } = data;

    if (source === target) return;

    if (source === 'available' && target === 'added') {
      movePrimerToAdded(primer);
    } else if (source === 'added' && target === 'available') {
      movePrimerToAvailable(primer);
    }
  };

  const handleCancel = () => {
    router.push("/admin/department");
  };

  const movePrimerToAdded = (primer: PrimerDto) => {
    const updatedPrimer = { ...primer, departmentId: isEdit ? parseInt(departmentId!) : null };
    setAddedPrimers([...addedPrimers, updatedPrimer]);
    setAvailablePrimers(availablePrimers.filter(p => p.id !== primer.id));
  };

  const movePrimerToAvailable = (primer: PrimerDto) => {
    const updatedPrimer = { ...primer, departmentId: null };
    setAvailablePrimers([...availablePrimers, updatedPrimer]);
    setAddedPrimers(addedPrimers.filter(p => p.id !== primer.id));
  };

  const primerColumns = useMemo<MRT_ColumnDef<PrimerDto>[]>(
    () => [
      {
        accessorKey: "primerType",
        header: "Primer Name",
        size: 200,
      },
    ],
    []
  );

  const addedPrimersTable = useMaterialReactTable({
    columns: primerColumns,
    data: addedPrimers,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater({}) : updater;
      const selectedRowKey = Object.keys(newSelection)[0];
      const selectedRowIndex = selectedRowKey ? parseInt(selectedRowKey) : null;
      setSelectedAdded(selectedRowIndex);
    },
    state: {
      rowSelection: selectedAdded !== null ? { [selectedAdded]: true } : {},
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: '450px',
        width: '100%',
      },
      onDragOver: handleDragOver,
      onDrop: (e: React.DragEvent) => handleDrop(e, 'added'),
    },
    muiTableBodyRowProps: ({ row }) => ({
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, row.original, 'added'),
      style: {
        cursor: 'move',
      },
    }),
    renderRowActions: ({ row }) => (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => movePrimerToAvailable(row.original)}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </Button>
    ),
    enableRowActions: true,
    positionActionsColumn: 'last',
  });

  const availablePrimersTable = useMaterialReactTable({
    columns: primerColumns,
    data: availablePrimers,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater({}) : updater;
      const selectedRowKey = Object.keys(newSelection)[0];
      const selectedRowIndex = selectedRowKey ? parseInt(selectedRowKey) : null;
      setSelectedAvailable(selectedRowIndex);
    },
    state: {
      rowSelection: selectedAvailable !== null ? { [selectedAvailable]: true } : {},
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: '450px',
        width: '100%',
      },
      onDragOver: handleDragOver,
      onDrop: (e: React.DragEvent) => handleDrop(e, 'available'),
    },
    muiTableBodyRowProps: ({ row }) => ({
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, row.original, 'available'),
      style: {
        cursor: 'move',
      },
    }),
    renderRowActions: ({ row }) => (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => movePrimerToAdded(row.original)}
        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Plus className="h-4 w-4" />
      </Button>
    ),
    enableRowActions: true,
    positionActionsColumn: 'last',
  });

  return (
    <div className="max-w-[1200px] mx-auto">
      <Card className="!w-full overflow-auto max-h-[calc(100vh-19vh)] p-0 pb-4">
      <CardHeader className="sticky top-0 z-10 bg-white border-b !p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold">
          {isEdit ? "Edit Department" : "New Department"}
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
        {/* Department Details Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Department Details</CardTitle>
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
              {departmentFields.map((field) => {
                // Get options for siteId field
                const getOptions = () => {
                  if (field.name === "siteId" && sitesData?.data?.items) {
                    return sitesData.data.items.map((site: Site) => ({
                      value: site.id.toString(),
                      label: site.siteName || site.siteCode,
                    }));
                  }
                  return [];
                };

                return (
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
                    options={getOptions()}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Associated Primers Section */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Associated Primers */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">Associated Primers</h4>
                <div className="border rounded-lg overflow-hidden">
                  <MaterialReactTable table={addedPrimersTable} />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemovePrimer}
                  disabled={selectedAdded === null}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>

               <div className="space-y-4">
                 <h4 className="text-xl font-semibold">Available Primers</h4>
                <div className="border rounded-lg overflow-hidden">
                  <MaterialReactTable table={availablePrimersTable} />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddPrimer}
                  disabled={selectedAvailable === null}
                  className="w-full"
                >
                  Add Primer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
      </CardContent>
    </Card>
    </div>
  );
}

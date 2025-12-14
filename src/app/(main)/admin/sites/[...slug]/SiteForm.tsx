"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Site, Department } from "@/types";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { getSiteById, createSite, updateSite, departmentLookup, updateDepartment } from "@/api/services";
import { siteValidationSchema, siteFields } from "@/config";
import InputMapper from "@/components/extend/input-mapper";

interface SiteFormProps {
  initialData: any;
  isEdit: boolean;
  siteId?: string;
}

export default function SiteForm({
  initialData,
  isEdit,
  siteId,
}: SiteFormProps): React.JSX.Element {
  const router = useRouter();

  const [addedDepartments, setAddedDepartments] = useState<Department[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);
  const [originalAddedDepartments, setOriginalAddedDepartments] = useState<Department[]>([]);
  const [selectedAvailable, setSelectedAvailable] = useState<number | null>(null);
  const [selectedAdded, setSelectedAdded] = useState<number | null>(null);

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
  });

  const createSiteMutation = useMutation({
    mutationFn: createSite,
  });

  const updateSiteMutation = useMutation({
    mutationFn: updateSite,
  });

  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentLookup({ PageSize: 1000 }),
    enabled: true,
  });

  useEffect(() => {
    if (departmentsData?.data?.items) {
      const allDepartments = departmentsData.data.items;
      
      if (isEdit && siteId) {
        const currentSiteId = parseInt(siteId);
        const addedDepts = allDepartments.filter(dept => dept.siteId === currentSiteId);
        const availableDepts = allDepartments.filter(dept => dept.siteId === null);
        
        setAddedDepartments(addedDepts);
        setAvailableDepartments(availableDepts);
        setOriginalAddedDepartments([...addedDepts]);
      } else {
        const unassignedDepartments = allDepartments.filter(dept => dept.siteId === null);
        setAvailableDepartments(unassignedDepartments);
      }
    }
  }, [departmentsData, isEdit, siteId]);


  const formik = useFormik({
    initialValues: {
      siteCode: initialData?.siteCode || "",
      name: initialData?.siteName || "",
      status: initialData?.status ?? true,
    },
    enableReinitialize: true,
    validationSchema: siteValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const sitePayload = {
          siteCode: values.siteCode,
          siteName: values.name,
        };

        let siteIdToUse: number;
        if (isEdit && siteId) {
          const updateResult = await updateSiteMutation.mutateAsync({
            id: parseInt(siteId),
            createdOn: new Date().toISOString(),
            ...sitePayload,
          });
          siteIdToUse = updateResult.data.id;
        } else {
          const createResult = await createSiteMutation.mutateAsync(sitePayload);
          siteIdToUse = createResult.data.id;
        }

        for (const department of addedDepartments) {
          updateDepartmentMutation.mutate({
            id: department.id,
            createdOn: department.createdOn || new Date().toISOString(),
            siteId: siteIdToUse,
            name: department.name,
          });
        }

        const originalAddedIds = originalAddedDepartments.map(dept => dept.id);
        const currentAddedIds = addedDepartments.map(dept => dept.id);
        const removedDepartmentIds = originalAddedIds.filter(id => !currentAddedIds.includes(id));

        for (const departmentId of removedDepartmentIds) {
          const department = originalAddedDepartments.find(dept => dept.id === departmentId);
          if (department) {
            updateDepartmentMutation.mutate({
              id: department.id,
              createdOn: department.createdOn || new Date().toISOString(),
              siteId: null,
              name: department.name,
            });
          }
        }

        router.push("/admin/sites");
      } catch (error) {
        console.error("Error saving site:", error);
      }
    },
  });

  const handleAddDepartment = () => {
    if (selectedAvailable !== null && selectedAvailable >= 0) {
      const departmentToAdd = availableDepartments[selectedAvailable];
      if (departmentToAdd) {
        const updatedDepartment = { ...departmentToAdd, siteId: isEdit ? parseInt(siteId!) : null };
        setAddedDepartments([...addedDepartments, updatedDepartment]);
        setAvailableDepartments(availableDepartments.filter((_, index) => index !== selectedAvailable));
        setSelectedAvailable(null);
      }
    }
  };

  const handleRemoveDepartment = () => {
    if (selectedAdded !== null && selectedAdded >= 0) {
      const departmentToRemove = addedDepartments[selectedAdded];
      if (departmentToRemove) {
        const updatedDepartment = { ...departmentToRemove, siteId: null };
        setAvailableDepartments([...availableDepartments, updatedDepartment]);
        setAddedDepartments(addedDepartments.filter((_, index) => index !== selectedAdded));
        setSelectedAdded(null);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, department: Department, source: 'available' | 'added') => {
    e.dataTransfer.setData('application/json', JSON.stringify({ department, source }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, target: 'available' | 'added') => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const { department, source } = data;

    if (source === target) return;

    if (source === 'available' && target === 'added') {
      moveDepartmentToAdded(department);
    } else if (source === 'added' && target === 'available') {
      moveDepartmentToAvailable(department);
    }
  };

  const handleCancel = () => {
    router.push("/admin/sites");
  };

  const moveDepartmentToAdded = (department: Department) => {
    const updatedDepartment = { ...department, siteId: isEdit ? parseInt(siteId!) : null };
    setAddedDepartments([...addedDepartments, updatedDepartment]);
    setAvailableDepartments(availableDepartments.filter(dept => dept.id !== department.id));
  };

  const moveDepartmentToAvailable = (department: Department) => {
    const updatedDepartment = { ...department, siteId: null };
    setAvailableDepartments([...availableDepartments, updatedDepartment]);
    setAddedDepartments(addedDepartments.filter(dept => dept.id !== department.id));
  };

  const departmentColumns = useMemo<MRT_ColumnDef<Department>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Department Name",
        size: 200,
      },
    ],
    []
  );

  const addedDepartmentsTable = useMaterialReactTable({
    columns: departmentColumns,
    data: addedDepartments,
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
        onClick={() => moveDepartmentToAvailable(row.original)}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </Button>
    ),
    enableRowActions: true,
    positionActionsColumn: 'last',
  });

  const availableDepartmentsTable = useMaterialReactTable({
    columns: departmentColumns,
    data: availableDepartments,
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
        onClick={() => moveDepartmentToAdded(row.original)}
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
            {isEdit ? "Edit Site" : "New Site"}
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
          {/* Site Details Section */}
          <Card>
            <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Site Details</CardTitle>
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
              {siteFields.map((field) => (
                <InputMapper
                  key={field.name}
                  field={{
                    ...field,
                    disabled: isEdit && (field.name === 'siteCode' || field.name === 'name') ? true : field.disabled,
                  }}
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
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Associated Departments Section */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Associated Departments */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">Associated Departments</h4>
                <div className="border rounded-lg overflow-hidden">
                  <MaterialReactTable table={addedDepartmentsTable} />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveDepartment}
                  disabled={selectedAdded === null}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold">Available Departments</h4>
                <div className="border rounded-lg overflow-hidden">
                  <MaterialReactTable table={availableDepartmentsTable} />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddDepartment}
                  disabled={selectedAvailable === null}
                  className="w-full"
                >
                  Add Department
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

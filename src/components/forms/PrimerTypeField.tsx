import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copy, Search } from "lucide-react";
import { primerTypeLookup } from "@/api/services";
import { PrimerDto } from "@/types";

interface PrimerTypeFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  onPrimerSelect?: (primer: PrimerDto) => void;
  isEdit?: boolean;
}

export default function PrimerTypeField({
  value,
  onChange,
  onBlur,
  error,
  touched,
  onPrimerSelect,
  isEdit = false,
}: PrimerTypeFieldProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: primersData, isLoading } = useQuery({
    queryKey: ["existing-primers"],
    queryFn: () => primerTypeLookup({ PageSize: 1000 }),
    enabled: isDropdownOpen,
  });

  const filteredPrimers = (primersData?.data?.items || []).filter((primer: PrimerDto) =>
    primer.primerType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrimerSelect = (primer: PrimerDto) => {
    onChange({
      target: { name: "primerType", value: primer.primerType },
    } as React.ChangeEvent<HTMLInputElement>);
    onPrimerSelect?.(primer);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-2">
  <Label htmlFor="primerType">Primer Name</Label>
      <div className="relative flex items-center">
        <Input
          id="primerType"
          name="primerType"
          type="text"
          placeholder="Enter primer name"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${!isEdit ? 'pr-10' : ''} ${error && touched ? "border-destructive" : ""}`}
        />
        {!isEdit && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search primers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-3 text-center text-gray-500">Loading primers...</div>
                  ) : filteredPrimers.length === 0 ? (
                    <div className="p-3 text-center text-gray-500">
                      {searchTerm ? "No primers found" : "No primers available"}
                    </div>
                  ) : (
                    filteredPrimers.map((primer: PrimerDto) => (
                      <Button
                        key={primer.id}
                        type="button"
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto text-left hover:bg-red-800 hover:text-white transition-colors"
                        onClick={() => handlePrimerSelect(primer)}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{primer.primerType}</span>
                          {primer.commMilCert && (
                            <span className="text-sm text-gray-500">{primer.commMilCert}</span>
                          )}
                        </div>
                      </Button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      {error && touched && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

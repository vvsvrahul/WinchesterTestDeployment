import { LoaderCircle } from "lucide-react";
import React from "react";

export default function loading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <LoaderCircle className="animate-spin h-8 w-8 text-red-600" />
      <p className="text-lg font-medium text-gray-700 mt-4">Loading Primer Details...</p>
    </div>
  );
}

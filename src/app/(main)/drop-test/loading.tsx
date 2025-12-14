import { LoaderCircle } from "lucide-react";
import React from "react";

export default function loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoaderCircle className="animate-spin" />
      <p>Loading Primer Drop Test</p>
    </div>
  );
}

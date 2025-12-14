import React from "react";
import { LoaderCircle } from "lucide-react";

export default function loading(): React.JSX.Element {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <span className="animate-spin">
        <LoaderCircle />
      </span>
    </div>
  );
}

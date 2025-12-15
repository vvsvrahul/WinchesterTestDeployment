"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { companyLogoFullImage } from "@/config";
import "@/app/globals.css";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/config/msalConfig";

export default function AuthErrorPage() {
  const { instance } = useMsal();

  const handleRetry = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Image
              src={companyLogoFullImage}
              width={200}
              height={25}
              alt="Winchester Logo"
            />
          </div>
          <CardTitle className="text-red-600">Authentication Error</CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">An error occurred during authentication.</p>

          <Button
            onClick={handleRetry}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

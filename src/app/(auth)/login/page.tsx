"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { companyLogoFullImage } from "@/config";
import "@/app/globals.css";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "@/config/msalConfig";
import { InteractionStatus } from "@azure/msal-browser";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoading = inProgress !== InteractionStatus.None;
  const isLogout = searchParams.get("logout") === "true";

  useEffect(() => {
    if (isAuthenticated && !isLogout) {
      router.replace("/drop-test");
    }
  }, [isAuthenticated, isLogout, router]);

  const handleLogin = async () => {
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
          {/* Branding */}
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Image
              src={companyLogoFullImage}
              width={200}
              height={25}
              alt="Winchester Logo"
            />
          </div>
        </CardHeader>

        <CardContent className="flex justify-center">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {/* Microsoft Logo (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 23 23"
              className="w-5 h-5"
            >
              <rect width="10" height="10" x="1" y="1" fill="#f25022" />
              <rect width="10" height="10" x="12" y="1" fill="#7fba00" />
              <rect width="10" height="10" x="1" y="12" fill="#00a4ef" />
              <rect width="10" height="10" x="12" y="12" fill="#ffb900" />
            </svg>
            {isLoading ? "Signing in..." : "Sign in with Microsoft"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

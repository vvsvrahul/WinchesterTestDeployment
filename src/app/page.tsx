"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

export default function HomePage() {
  const router = useRouter();
  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (inProgress === InteractionStatus.Login || inProgress === InteractionStatus.HandleRedirect) {
      return;
    }

    if (isAuthenticated) {
      router.replace("/drop-test");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, inProgress, router]);

  return null;
}

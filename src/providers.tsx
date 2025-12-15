"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/config/msalConfig";
import { useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

let msalInitPromise: Promise<unknown> | null = null;
if (typeof window !== "undefined") {
  msalInitPromise = msalInstance.initialize()
    .then(() => msalInstance.handleRedirectPromise())
    .catch((error) => {
      console.error("MSAL initialization error:", error);
    });
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (msalInitPromise) {
      msalInitPromise.finally(() => {
        setIsInitialized(true);
      });
    } else {
      setIsInitialized(true);
    }
  }, []);

  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MsalProvider>
  );
}

"use client";

import { useLoginStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { login } = useLoginStore();
  const router = useRouter();

  useEffect(() => {
    if (login) {
      router.push("/drop-test");
    }
  }, [login, router]);
  return <>{children}</>;
}

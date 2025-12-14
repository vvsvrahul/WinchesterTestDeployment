"use client";

import Navbar from "./_navbar/page";
import "../globals.css";
import FooterPage from "./_footer/page";
import { AppBreadcrumb } from "./_breadcrumb/page";
import { useLoginStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { login } = useLoginStore();
  const router = useRouter();

  useEffect(() => {
    if (!login) {
      router.push("/login");
    }
  }, [login, router]);

  return (
    <>
      <header className="sticky top-0 w-full z-50">
        <Navbar />
      </header>
      <main className="min-h-[calc(100vh-125px)] px-5 relative">
        <div className="py-4">
          <AppBreadcrumb />
        </div>
        {children}
      </main>
      <footer className="sticky bottom-0 w-full z-50">
        <FooterPage />
      </footer>
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useBreadcrumbStore } from "@/store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Cog, HomeIcon, icons } from "lucide-react";
import React from "react";
import { Crumb } from "@/types";

const labelMap: Record<string, { label: string; icon?: React.ReactNode }> = {
  "": { label: "Home", icon: <HomeIcon className="w-4 h-4" /> },
  tests: { label: "Tests", icon: <Cog className="w-4 h-4" /> },
  "drop-test": { label: "Tests" },
  admin: { label: "Admin", icon: <Cog className="w-4 h-4" /> },
  sites: { label: "Sites" },
  department: { label: "Department" },
  primer: { label: "Primer" },
};

export function AppBreadcrumb(): React.JSX.Element {
  const pathname = usePathname();
  const { crumbs } = useBreadcrumbStore();

  const segments = pathname.split("/").filter(Boolean);

  const builtIn = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const staticData = labelMap[seg];

    return {
      href,
      label: staticData?.label ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      icon: staticData?.icon,
    };
  });

  const merged = builtIn.map(
    (c) => crumbs.find((d: Crumb) => d.href === c.href) ?? c
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/drop-test" className="flex items-center gap-1 leading-0">
              <HomeIcon className="w-4 h-4" /> Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {merged.map((c, idx) => (
          <React.Fragment key={c.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {idx === merged.length - 1 ? (
                <span className="flex items-center gap-1 text-gray-500 font-medium leading-0">
                  {c.icon}
                  {c.label}
                </span>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={c.href}
                    className="flex items-center gap-1 leading-0"
                  >
                    {c.icon}
                    {c.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

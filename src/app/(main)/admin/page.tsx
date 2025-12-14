"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.push("/drop-test");
  }, [router]);

  return <div></div>;
}

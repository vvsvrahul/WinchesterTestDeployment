import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./globals.css";

export const metadata = {
  title: "404 | Winchester",
  description: "Sorry, we couldn't find the page you're looking for.",
};

export default function NotFound(): React.JSX.Element {
  return (
    <html lang="en" className="w-full h-full">
      <body className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="w-full space-y-6 text-center">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                404 Page Not Found
              </h1>
              <p className="text-gray-500">
                Sorry, we couldn&#x27;t find the page you&#x27;re looking for.
              </p>
            </div>
            <Link href="/">
              <Button className="cursor-pointer">Go to Homepage</Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

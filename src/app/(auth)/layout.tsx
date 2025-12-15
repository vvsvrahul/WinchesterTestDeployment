"use client";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // AuthLayout no longer needs to handle redirects - MSAL handles authentication
  // Individual pages (like login/page.tsx) handle their own redirects
  return <>{children}</>;
}

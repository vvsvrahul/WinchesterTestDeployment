import { Metadata } from "next";
import Providers from "../providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Winchester",
    template: "%s | Winchester",
  },
  description: "Primer Testing Document Management System",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        url: "/assets/image/company-logo-short.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/assets/image/company-logo-short.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/assets/image/company-logo-short.png"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/image/company-logo-short.png"
        />
      </head>
      <body>
        <Toaster
          position={"top-center"}
          theme="light"
          toastOptions={{
            classNames: {
              success: "!bg-green-300",
              info: "!bg-blue-300",
              warning: "!bg-orange-300",
              error: "!bg-red-300",
            },
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

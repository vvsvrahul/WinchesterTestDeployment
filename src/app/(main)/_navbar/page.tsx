"use client";

import React from "react";
import Link from "next/link";
import { companyLogoShortImage } from "@/config";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { LogOut, LucideProps } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { useMsal } from "@azure/msal-react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar(): React.JSX.Element {
  const { instance, accounts } = useMsal();
  const pathname = usePathname();
  const router = useRouter();

  const username = accounts[0]?.name || "User";
  
  const generateInitials = (name: string): string => {
    if (!name) return "U";
    
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return words.map(word => word.charAt(0)).join("").toUpperCase();
    }
  };

  const navLeftOptions: {
    title: string;
    link: string;
  }[] = [
    {
      title: "Tests",
      link: "/drop-test",
    },
  ];

  const adminOptions: {
    title: string;
    link: string;
  }[] = [
    {
      title: "Sites",
      link: "/admin/sites",
    },
    {
      title: "Departments",
      link: "/admin/department",
    },
    {
      title: "Primers",
      link: "/admin/primer",
    },
  ];

  const profileOptions: {
    title: string;
    shortcut: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    link?: string;
    onclick?: () => void;
  }[] = [
    {
      title: "Logout",
      shortcut: LogOut,
      onclick: async () => {
        try {
          instance.setActiveAccount(null);
          await instance.clearCache();
          router.push("/login?logout=true");
        } catch (error) {
          console.error("Logout error:", error);
          router.push("/login?logout=true");
        }
      },
    },
  ];

  return (
    <div className="bg-black shadow-sm border-b flex items-center px-5 justify-between">
      <div className="flex items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="py-2">
            <Image
              src={companyLogoShortImage}
              width={60}
              height={60}
              alt="Winchester Logo"
              className="my-2"
            />
          </Link>
          <span className="text-white font-semibold text-xl ml-3">Primer Drop Test</span>
        </div>
        <div className="ml-8">
          {navLeftOptions.map((option, idx) => {
            return (
              <Button
                className={`font-semibold text-xl hover:font-semibold hover:text-red-600 hover:bg-black ${
                  pathname === option.link ? "text-red-600" : "text-white"
                }`}
                variant={"ghost"}
                asChild
                key={`nav-left-option-${idx}`}
              >
                <Link href={option.link}>{option.title}</Link>
              </Button>
            );
          })}
        </div>
        <div className="ml-6">
          <Menubar className="border-none bg-black">
            <MenubarMenu>
              <MenubarTrigger 
                className={`!bg-black hover:!text-red-600 ${
                  pathname.startsWith('/admin') ? '!text-red-600' : '!text-white'
                }`}
                onClick={() => {}}
              >
                <div className="flex gap-2 cursor-pointer items-center">
                  <p className="text-xl font-semibold">Admin</p>
                </div>
              </MenubarTrigger>
              <MenubarContent 
                className="text-white w-[100px]" 
                style={{ backgroundColor: '#ED1B2F' }}
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                {adminOptions.map((option, idx) => {
                  return (
                    <MenubarItem 
                      key={`admin-option-${idx}`} 
                      className="w-full py-1 data-[highlighted]:!bg-red-800 data-[highlighted]:!text-white transition-colors"
                      onClick={() => router.push(option.link)}
                    >
                      <div className="w-full flex justify-between items-center text-lg font-medium text-white transition-colors cursor-pointer">
                        {option.title}
                      </div>
                    </MenubarItem>
                  );
                })}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <div>
        <Menubar className="border-none bg-black">
          <MenubarMenu>
            <MenubarTrigger className="!bg-black !text-white">
              <div className="flex gap-2 cursor-pointer items-center">
                <Avatar className="border bg-red-600 flex items-center justify-center">
                  <AvatarFallback className="bg-red-600 text-white font-semibold flex items-center justify-center w-full h-full">
                    {generateInitials(username)}
                  </AvatarFallback>
                </Avatar>
                <p>{username}</p>
              </div>
            </MenubarTrigger>
            <MenubarContent className="text-white w-auto min-w-fit" style={{ backgroundColor: '#ED1B2F' }}>
              {profileOptions.map((option, idx) => {
                return option.link ? (
                  <MenubarItem key={`profile-option-${idx}`} className="w-auto py-3 px-4 data-[highlighted]:!bg-red-800 data-[highlighted]:!text-white transition-colors">
                    <Link
                      href={option.link}
                      className="flex justify-between items-center gap-4"
                    >
                      {option.title}
                      <MenubarShortcut>
                        <option.shortcut />
                      </MenubarShortcut>
                    </Link>
                  </MenubarItem>
                ) : (
                  <MenubarItem
                    key={`profile-option-${idx}`}
                    onClick={option.onclick}
                    className="w-auto py-3 px-4 data-[highlighted]:!bg-red-800 data-[highlighted]:!text-white transition-colors"
                  >
                    <div className="flex justify-between items-center gap-4">
                      {option.title}
                      <MenubarShortcut onClick={option.onclick}>
                        <option.shortcut />
                      </MenubarShortcut>
                    </div>
                  </MenubarItem>
                );
              })}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  browningLogoImage,
  companyLogoFullImage,
  whiteFlyerLogoImage,
} from "@/config";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer(): React.JSX.Element {
  return (
    <div className="flex justify-between text-sm font-semibold px-5 sticky bottom-0 shadow-sm border-t py-2 items-center bg-black text-white">
      <span>&copy; 2025 Olin Corporation</span>
      <span className="flex gap-2">
        <Image
          src={companyLogoFullImage}
          width={50}
          height={25}
          alt="Winchester Logo"
        />
        <Image
          src={browningLogoImage}
          width={30}
          height={25}
          alt="Browning Logo"
        />
        <Image
          className="!aspect-square"
          src={whiteFlyerLogoImage}
          width={40}
          height={30}
          alt="White Flyer Logo"
        />
      </span>
      <Link href="#" className="hover:text-white">
        <Button variant={"link"}>Help & FAQs</Button>
      </Link>
    </div>
  );
}

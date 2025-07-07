"use client";
import Image from "next/image";
import { Button } from "@material-tailwind/react";

export default function FixedPlugin() {
  return (
    <a href="#" target="_blank">
      <Button
        color="white"
        size="sm"
        className="!fixed bottom-4 right-4 flex gap-1 pl-2 items-center border border-gray-50"
      >
        <Image
          width={128}
          height={128}
          className="w-5 h-5"
          alt="Abdullah Portfolio"
          src="/favicon.png"
        />{" "}
        Abdullah Portfolio
      </Button>
    </a>
  );
}

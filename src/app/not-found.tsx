"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <Image
        className="mx-auto"
        src="/error.svg"
        alt="error"
        width={1000}
        height={1000}
      />
      <div className="flex items-center">
        <Link
          className="border-lg mt-10 rounded bg-primary p-2 text-xl text-foreground text-white"
          href="/"
        >
          Return Home
        </Link>
        <div className="mx-auto text-center text-xl">
          <h2>Not Found</h2>
          <p>Could not find requested resource</p>
        </div>
      </div>
    </div>
  );
}

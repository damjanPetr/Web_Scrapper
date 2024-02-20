import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const source_sans_3 = Source_Sans_3({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${source_sans_3.className} `}>
        <Navbar />
        <main className="mx-auto min-h-svh max-w-screen-xl">{children}</main>
      </body>
    </html>
  );
}

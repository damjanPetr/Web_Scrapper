import { ThemeProvider } from "@/contex/ThemeContex";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./globals.css";

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
    <html lang="en" className={``}>
      <body className={`${source_sans_3.className} `}>
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-141px)] max-w-screen-xl p-[0.1px]">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

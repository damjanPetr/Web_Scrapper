import { ThemeProvider } from "@/contex/ThemeContex";
import type { Metadata } from "next";
import { Source_Sans_3, Inter, Roboto } from "next/font/google";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./globals.css";

const source_sans_3 = Source_Sans_3({
  subsets: ["latin"],
  style: ["normal"],
  variable: "--font-source-sans-3",
  // weight: ["400", "500", "600", "700"],
  weight: ["400"],
});

const inter = Inter({
  subsets: ["latin"],
  style: ["normal"],
  variable: "--font-inter",
  // weight: ["400", "500", "600", "700"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={` ${inter.variable}  ${source_sans_3.variable}`}>
      <body className={``}>
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-160px)] max-w-screen-xl p-[0.1px] max-xl:px-4">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

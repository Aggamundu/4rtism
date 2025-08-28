import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "4rtism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>
          {/* @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap'); */}
          {/* @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Vend+Sans:ital,wght@0,300..700;1,300..700&display=swap'); */}
          @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Vend+Sans:ital,wght@0,300..700;1,300..700&display=swap');
        </style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}

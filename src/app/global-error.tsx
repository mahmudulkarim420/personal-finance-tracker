"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="en" data-theme="caramellatte">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex items-center justify-center bg-base-100 p-4`}>
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <div className="relative bg-base-200 border border-base-300 rounded-[32px] p-10 shadow-2xl overflow-hidden">
              <h1 className="text-4xl font-black text-base-content mb-2 tracking-tighter">Something went wrong!</h1>
              <p className="text-sm font-black text-base-content/60 leading-relaxed mb-10">
                A critical error occurred while trying to render the application.
              </p>
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:opacity-90 text-primary-content font-black text-sm py-4 px-6 rounded-2xl transition-all duration-300 active:scale-95 shadow-lg shadow-primary/25"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import Main from "@/components/layout/Main";
import { NotificationProvider } from "@/context/NotificationContext";
import { NotificationStack } from "@/components/ui/Notification";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevstockHub",
  description: "Devstock shop next app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased scrollbar-gutter-stable`}
    >
      <body className="flex flex-col w-full max-w-360 mx-auto items-center justify-center">
        <SessionProvider>
          <NotificationProvider>
            <CartProvider>
              <Header />
              <NotificationStack />
              <Main>{children}</Main>
              <Footer />
            </CartProvider>
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

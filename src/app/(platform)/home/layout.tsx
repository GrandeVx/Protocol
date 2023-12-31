import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RoutingNavbar from "@/components/navbar/RoutingNavbar";
import MailsNavbar from "@/components/navbar/MailsNavbar";
import SendButton from "@/components/layouts/SendButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full">
      <div className="h-full grid-cols-5 gap-4 p-2 sm:hidden md:grid">
        <div className="col-span-2 h-full border-r border-zinc-200">
          <RoutingNavbar />
          <MailsNavbar />
        </div>
        <div className="col-span-3">
          <div className="flex h-full flex-col">
            <div className="flex-1">{children}</div>
            <SendButton />
          </div>
        </div>
      </div>

      <div className="hidden h-full border-r border-zinc-200 sm:block md:hidden">
        <RoutingNavbar />
        <MailsNavbar />
        <SendButton />
      </div>
    </main>
  );
}

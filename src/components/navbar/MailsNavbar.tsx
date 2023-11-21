"use client";
import NavMailComponent from "../layouts/NavMailComponent";
import { api as trpc } from "@/trpc/react";
import { useAuth } from "@clerk/nextjs";

import useNavigationStore from "@/lib/zutstand";
import Loading from "@/app/(platform)/home/loading";
import { useRouter } from "next/navigation";
export default function MailsNavbar() {
  const router = useRouter();
  const { userId } = useAuth();
  const { selected } = useNavigationStore();

  if (!userId) {
    return <Loading />;
  }

  const { data: InboundData, isLoading: InboundLoading } =
    trpc.mails.getInboundMails.useQuery({
      user_id: userId,
    });

  const { data: OutboundData, isLoading: OutboundLoading } =
    trpc.mails.getOutboundMails.useQuery({
      user_id: userId,
    });

  if (!InboundData || InboundLoading || !OutboundData || OutboundLoading) {
    return (
      <nav className="h-full border-r border-zinc-200 p-2 dark:border-zinc-800">
        <Loading />
      </nav>
    );
  }

  const mails = selected == "inbound" ? InboundData.mails : OutboundData.mails;

  if (mails.length == 0) {
    return (
      <div className=" flex h-full flex-col items-center justify-center gap-3  font-semibold text-slate-100 transition-all duration-100 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-slate-800">
        <p className="text-md font-medium">
          {selected == "inbound"
            ? "Non Hai Ancora Ricevuto nessuna mail"
            : "Non Hai Ancora Inviato nessuna mail"}
        </p>
        <button
          onClick={() => router.push("/s/")}
          className="rounded-full bg-blue-500 p-3 font-bold text-white"
        >
          Invia Una Mail
        </button>
      </div>
    );
  }

  return (
    <main className="mt-5 text-center">
      <p className="text-2xl font-bold">
        {selected == "inbound" ? "Inbox" : "All Sent"}
      </p>
      <ul className="divide-y divide-zinc-200   transition-all duration-100 dark:divide-zinc-800 dark:border-zinc-800">
        {mails.map((mail: any, index: number) => (
          <NavMailComponent key={mail.id} mail={mail} />
        ))}
      </ul>
    </main>
  );
}

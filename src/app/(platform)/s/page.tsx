"use client";

import { api as trpc } from "@/trpc/react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Poplol from "@/components/layouts/Poplol";
import Loading from "../home/loading";

export default function SendMailPage() {
  const { userId } = useAuth();
  const util = trpc.useUtils();
  const router = useRouter();
  const [value, setValue] = useState("");

  if (!userId) {
    console.log("Not logged in");
    return;
  }

  const { data: UsersData, isLoading } = trpc.users.GetUsersFromName.useQuery({
    name: "",
  });

  const { mutate: SendMail, isLoading: Sending } =
    trpc.mails.sendMail.useMutation({
      onSuccess: () => {
        util.mails.getOutboundMails.invalidate({
          user_id: userId,
        });
        router.push(`/home`);
      },
    });

  if (isLoading || !UsersData) {
    return <Loading />;
  }

  const OnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = e.currentTarget.subject.value;
    const body = e.currentTarget.body.value;

    SendMail({
      sender_id: userId,
      title: subject,
      content: body,
      receiver_id: value,
    });
  };
  return (
    <div className="col-span-2 h-screen p-2 dark:bg-slate-800">
      <div className="w-12/20 col-span-2 flex flex-col">
        <div className="sticky top-0 flex items-center space-x-0 border-b border-zinc-200  p-4 dark:border-zinc-800  sm:justify-center md:justify-between">
          <p className="text-xl font-bold dark:text-white">Send a New Mail</p>
        </div>
        <div className="flex-grow space-y-4 overflow-y-auto p-4">
          <form className="space-y-4" onSubmit={OnSubmit}>
            <div className="relative flex flex-col space-y-2">
              <Poplol UsersData={UsersData} value={value} setValue={setValue} />
            </div>

            <hr className="my-4 border-t border-zinc-200 dark:border-zinc-800" />
            <div className="relative flex flex-col space-y-2">
              <input
                className="rounded border border-zinc-200 px-3 py-2 pl-24 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-slate-100 dark:focus:ring-zinc-700"
                id="subject"
                type="text"
              />
              <label
                className="absolute left-3 top-1 text-sm font-semibold text-zinc-500 dark:text-zinc-800"
                htmlFor="subject"
              >
                Subject:
              </label>
            </div>
            <hr className="my-4 border-t border-zinc-200 dark:border-zinc-800" />
            <div className="flex flex-col space-y-2">
              <label
                className="text-sm font-semibold text-zinc-500 dark:text-slate-100"
                htmlFor="body"
              >
                Body:
              </label>
              <textarea
                className="rounded border border-zinc-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-slate-100 dark:focus:ring-zinc-700"
                id="body"
                rows={10}
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-zinc-600 text-white hover:bg-zinc-700 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                type="submit"
                disabled={Sending}
              >
                {Sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

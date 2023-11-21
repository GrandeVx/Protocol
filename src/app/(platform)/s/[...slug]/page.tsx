"use client";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { api as trpc } from "@/trpc/react";
import LoadingComponent from "@/components/loading";
import { useRouter } from "next/navigation";

export default function SendToMail({ params }: { params: { slug: string } }) {
  const { slug } = params || { slug: "" };
  const router = useRouter();
  const { userId } = useAuth();
  const util = trpc.useUtils();

  if (!userId) {
    console.log("Not logged in");
    return;
  }

  const { mutate: ReplyMail, isLoading: Sending } =
    trpc.mails.replyMail.useMutation({
      onSuccess: () => {
        util.mails.getOutboundMails.invalidate({
          user_id: userId,
        });
        util.mails.getInboundMails.invalidate({
          user_id: userId,
        });
        router.push(`/home`);
      },
    });

  const { data: mail, isLoading: MailLoading } =
    trpc.mails.getMailMessages.useQuery({
      mail_id: slug,
    });

  if (!mail || MailLoading) {
    return (
      <div className="space-x- flex items-center p-3">
        <LoadingComponent />
      </div>
    );
  }

  const OnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const to = e.currentTarget.to.value;
    const subject = e.currentTarget.subject.value;
    const body = e.currentTarget.body.value;

    ReplyMail({
      mail_id: slug,
      title: subject,
      content: body,
      user_id: userId,
    });

    console.log("Mail sent");
  };
  return (
    <div className="col-span-2 h-screen p-2">
      <div className="w-12/20 col-span-2 flex flex-col">
        <div className="sticky top-0 flex items-center justify-between space-x-0 border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xl font-bold">Respondo to {mail.mail.to}</p>
        </div>
        <div className="flex-grow space-y-4 overflow-y-auto p-4">
          <form className="space-y-4" onSubmit={OnSubmit}>
            <div className="relative flex flex-col space-y-2">
              <input
                className="rounded border border-zinc-200 px-3 py-2 pl-14 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:focus:ring-zinc-700"
                id="to"
                type="text"
                disabled={true}
                value={mail.mail.from}
              />
              <label
                className="absolute left-3 top-1 text-sm text-zinc-500 dark:text-zinc-400 "
                htmlFor="to"
              >
                To:
              </label>
            </div>

            <hr className="my-4 border-t border-zinc-200 dark:border-zinc-800" />
            <div className="relative flex flex-col space-y-2">
              <input
                className="rounded border border-zinc-200 px-3 py-2 pl-24 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:focus:ring-zinc-700"
                id="subject"
                type="text"
              />
              <label
                className="absolute left-3 top-1 text-sm text-zinc-500 dark:text-zinc-400"
                htmlFor="subject"
              >
                Subject:
              </label>
            </div>
            <hr className="my-4 border-t border-zinc-200 dark:border-zinc-800" />
            <div className="flex flex-col space-y-2">
              <label
                className="text-sm text-zinc-500 dark:text-zinc-400"
                htmlFor="body"
              >
                Body:
              </label>
              <textarea
                className="rounded border border-zinc-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:focus:ring-zinc-700"
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

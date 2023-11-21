"use client";
import { Button } from "../ui/button";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import useNavigationStore from "@/lib/zutstand";

export default function MailOptionNav({ index }: { index: string }) {
  const { userId } = useAuth();

  const { selected } = useNavigationStore();

  if (!userId) return;

  const utility = trpc.useUtils();
  const router = useRouter();

  const RemoveMessage = trpc.mails.deleteMail.useMutation({
    onSuccess: () => {
      if (selected == "inbound") {
        utility.mails.getInboundMails.invalidate({
          user_id: userId,
        });
      } else {
        utility.mails.getOutboundMails.invalidate({
          user_id: userId,
        });
      }
      router.push("/home");
    },
  });

  const UncheckMessage = trpc.mails.unmarkMail.useMutation({
    onSuccess: () => {
      if (selected == "inbound") {
        utility.mails.getInboundMails.invalidate({
          user_id: userId,
        });
      } else {
        utility.mails.getOutboundMails.invalidate({
          user_id: userId,
        });
      }
    },
  });

  return (
    <div className="sticky top-0 flex items-center space-x-0 border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:justify-center md:justify-start">
      <Button
        variant="ghost"
        onClick={() => UncheckMessage.mutate({ mail_id: index })}
      >
        <svg
          className=" h-5 w-5"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect height="16" rx="2" width="20" x="2" y="4" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </Button>
      <Button
        variant="ghost"
        onClick={() => RemoveMessage.mutate({ mail_id: index })}
      >
        <svg
          className=" h-5 w-5"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </Button>
      <Button variant="ghost" onClick={() => router.push(`/s/${index}`)}>
        <svg
          className=" h-5 w-5"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="9 17 4 12 9 7" />
          <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
        </svg>
      </Button>
      <Button variant="ghost">
        <svg
          className=" h-5 w-5"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="15 17 20 12 15 7" />
          <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
        </svg>
      </Button>
      <div className="ml-auto">
        <Button variant="ghost">
          <svg
            className=" h-5 w-5"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

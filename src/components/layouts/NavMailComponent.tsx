"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

const fixText = (text: string) => {
  // if the text is bigger than 100 characters, cut it
  if (text.length > 20) {
    text = text.substring(0, 20) + "...";
  }

  return text;
};

const getNotificationColor = (checked: Boolean) => {
  if (checked) return "bg-zinc-200 dark:bg-zinc-800";

  return "bg-blue-500 dark:bg-blue-400";
};

export default function EmailOnList({ mail }: { mail: any }) {
  const { data: senderData, isLoading } = trpc.users.GetUser.useQuery({
    id: mail.from,
  });

  const { data: message, isLoading: messageLoading } =
    trpc.mails.GetMailFirstMessage.useQuery({
      mail_id: mail.id,
    });

  if (isLoading || messageLoading || !senderData || !message) {
    return (
      <div className="space-x- flex items-center p-3">
        {" "}
        <Skeleton className="h-6 w-6 rounded-full" />{" "}
        <div className="space-y-2">
          {" "}
          <Skeleton className="h-4 w-[250px]" />{" "}
          <Skeleton className="h-4 w-[70px]" />{" "}
          <Skeleton className="h-4 w-[150px]" />{" "}
          <Skeleton className="h-4 w-[60px]" />{" "}
        </div>{" "}
      </div>
    );
  }

  const router = useRouter();

  return (
    <li
      className="flex cursor-pointer items-start justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      onClick={() => {
        router.push("/r/" + mail.id);
      }}
    >
      <div className="flex gap-4">
        <span
          className={cn(
            "h-3 w-3 self-center rounded-full transition-colors duration-100",
            getNotificationColor(mail.is_viewed),
          )}
        ></span>
        <div className="flex flex-col items-start ">
          <div className="flex flex-col items-start">
            <span className="flex flex-row items-start justify-start gap-3 align-top">
              <h2 className="text-base font-bold">
                {fixText(senderData.firstName + " " + senderData.lastName)}
              </h2>
            </span>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {fixText(message.subject)}
            </p>
            <p className="truncate text-sm">{fixText(message.body)}</p>
          </div>
          <time className="text-xs text-zinc-500 dark:text-zinc-400">
            {new Date(mail.createdAt).toLocaleDateString()}
          </time>
        </div>
      </div>
    </li>
  );
}

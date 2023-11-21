import MailOptionNav from "@/components/navbar/MailOptionNav";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";

export default async function MailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const data = await api.mails.getMailMessages.query({
    mail_id: slug,
  });

  const { mail, messages } = data;

  if (!mail || !messages || !messages[0]) {
    return <h1>Loading...</h1>;
  }

  const SenderData = await api.users.GetUser.query({
    id: mail.from,
  });

  console.log(messages);

  return (
    <div className="w-12/20 col-span-2 flex flex-col">
      <MailOptionNav index={slug} />
      <div className="flex-grow space-y-4 overflow-y-auto p-4">
        <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <h2 className="text-xl font-bold">{messages[0].subject}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            From: {SenderData.firstName + " " + SenderData.lastName}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">To: Me</p>
          <time className="text-xs text-zinc-500 dark:text-zinc-400">
            {new Date(messages[0].createdAt).toLocaleDateString()}
          </time>
        </div>
        {messages.map((message: any) => (
          <div
            key={message.id}
            className="border-b border-zinc-200 pb-4 dark:border-zinc-800"
          >
            <p>{message.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

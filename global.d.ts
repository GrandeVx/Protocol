import { mail } from "@prisma/client";

declare interface MailsPacket {
  size: number;
  mails: mail[];
}

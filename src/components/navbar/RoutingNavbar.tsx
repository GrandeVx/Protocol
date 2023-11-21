"use client";

import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { api as trpc } from "@/trpc/react";
import { UserButton, useAuth } from "@clerk/nextjs";
import useNavigationStore from "@/lib/zutstand";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

export default function MailOptionNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userId } = useAuth();
  const { selected, setSelected } = useNavigationStore();
  const router = useRouter();

  if (!userId) {
    return <h1>Loading User...</h1>;
  }

  const { data: InboundMails, isLoading: InboundLoading } =
    trpc.mails.getInboundMails.useQuery({
      user_id: userId,
    });

  const { data: OutboundMails, isLoading: OutboundLoading } =
    trpc.mails.getOutboundMails.useQuery({
      user_id: userId,
    });

  if (InboundLoading || OutboundLoading || !InboundMails || !OutboundMails) {
    console.log(InboundLoading, OutboundLoading, InboundMails, OutboundMails);
    return null;
  }

  return (
    <>
      <HamburgerIcon
        w={4}
        h={4}
        onMouseOver={() => onOpen()}
        color="blue.500"
        className="absolute left-3 m-2 cursor-pointer sm:top-2 md:top-4"
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <nav className="w-3/20 flex h-full flex-col space-y-2 overflow-y-auto border-r border-zinc-200   p-3 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                Protocol
              </h1>

              <ul>
                <li
                  className="flex cursor-pointer items-center justify-between space-x-2 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => {
                    setSelected("inbound");
                    router.push("/home");
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <svg
                      className=" h-4 w-4"
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
                      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                    </svg>
                    <span className="text-sm">Inbox</span>
                  </div>
                  <span className="rounded-full bg-zinc-200 px-2 py-1 text-xs dark:bg-zinc-600">
                    {InboundMails.size}
                  </span>
                </li>
                {/*
                <li className="flex cursor-pointer items-center justify-between space-x-2 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <div className="flex items-center space-x-1">
                    <svg
                      className=" h-4 w-4"
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
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" x2="4" y1="22" y2="15" />
                    </svg>
                    <span className="text-sm">Flagged</span>
                  </div>
                  <span className="rounded-full bg-zinc-200 px-2 py-1 text-xs dark:bg-zinc-800">
                    15
                  </span>
                </li>
                */}
                <li
                  className="flex cursor-pointer items-center justify-between space-x-2 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => {
                    setSelected("outbound");
                    router.push("/home");
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <svg
                      className=" h-4 w-4"
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
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                    <span className="text-sm">All Sent</span>
                  </div>
                  <span className="rounded-full bg-zinc-200 px-2 py-1 text-xs dark:bg-zinc-600">
                    {OutboundMails.size}
                  </span>
                </li>
              </ul>
              <hr className="my-4" />
              <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <li className="flex cursor-pointer items-center space-x-2 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <svg
                    className=" h-4 w-4"
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
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  </svg>
                  <span className="text-sm">Work</span>
                </li>
                <li className="flex cursor-pointer items-center space-x-2 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <svg
                    className=" h-4 w-4"
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
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  </svg>
                  <span className="text-sm">Expenses</span>
                </li>
                <li className="flex cursor-pointer items-center space-x-2 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <svg
                    className=" h-4 w-4"
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
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  </svg>
                  <span className="text-sm">Personal</span>
                </li>
              </ul>
              <section className="flex h-full items-end justify-end p-4">
                <div className="flex items-center justify-center gap-3">
                  <p className="text-sm font-semibold">Profile </p>
                  <UserButton />
                </div>
              </section>
            </nav>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

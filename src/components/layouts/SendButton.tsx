"use client";
import { useRouter } from "next/navigation";
export default function SendButton() {
  const router = useRouter();
  // make a button with absolute that bottom right
  return (
    <button
      onClick={() => router.push("/s")}
      className=" fixed bottom-4 right-4 rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      Send
    </button>
  );
}

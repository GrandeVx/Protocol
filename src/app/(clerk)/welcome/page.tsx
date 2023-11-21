import Link from "next/link";
export default function welcome() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-200">
      <p className="text-4xl font-semibold text-slate-700">
        Welcome to Protocol!
      </p>
      <Link
        href={"/home"}
        className="rounded-full bg-blue-300 p-3 font-semibold text-white "
      >
        Go to Home..
      </Link>
    </div>
  );
}

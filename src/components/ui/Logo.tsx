import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="text-3xl font-semibold font-['Inter'] leading-10">
      <span className="text-primary-500 ">Devstock</span>
      <span className="text-neutral-900">Hub</span>
    </Link>
  );
}

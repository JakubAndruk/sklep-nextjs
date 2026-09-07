import Link from "next/link";
import { CheckmarkBadge } from "../icons/CheckmarkBadge";

export default function RegisterSuccess() {
  return (
    <div className="self-stretch p-6 flex flex-col justify-start items-center gap-10">
      <div className="size-24 relative flex items-center justify-center">
        <CheckmarkBadge className="size-20 text-success-600" />
      </div>

      <div className="self-stretch flex flex-col justify-start items-center gap-14">
        <div className="self-stretch flex flex-col justify-start items-center gap-8">
          <div className="self-stretch flex flex-col justify-start items-center gap-4">
            <div className="self-stretch text-center text-neutral-900 text-5xl font-bold leading-13.5">
              Thank you!
            </div>
            <div className="self-stretch text-center text-neutral-900 text-2xl font-medium leading-9">
              You have successfully registered
            </div>
          </div>

          <div className="self-stretch flex flex-col justify-start items-center gap-5">
            <div className="self-stretch text-center text-neutral-600 text-lg font-normal leading-7">
              Please check your e-mail for further information. Let&rsquo;s
              exploring our products and enjoy many gifts.
            </div>
            <div className="self-stretch flex justify-center items-center gap-1">
              <span className="text-center text-neutral-600 text-lg font-normal leading-7">
                Having problem?{" "}
              </span>
              <Link
                href="/contact"
                className="text-center text-primary-600 text-lg font-normal leading-7 hover:underline"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

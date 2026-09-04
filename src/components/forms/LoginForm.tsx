"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  identifierSchema,
  passwordStepSchema,
  type IdentifierInput,
  type PasswordStepInput,
} from "@/lib/validators/auth";
import { Logo } from "@/components/ui/Logo";
import { Input, PasswordInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Step = "identifier" | "password";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [savePassword, setSavePassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const identifierForm = useForm<IdentifierInput>({
    resolver: zodResolver(identifierSchema),
    defaultValues: { identifier: "" },
  });

  const passwordForm = useForm<PasswordStepInput>({
    resolver: zodResolver(passwordStepSchema),
    defaultValues: { password: "" },
  });

  const handleContinue = useCallback((data: IdentifierInput) => {
    setFormError(null);
    setIdentifier(data.identifier);
    setStep("password");
  }, []);

  const handleBack = useCallback(() => {
    setFormError(null);
    passwordForm.reset({ password: "" });
    setStep("identifier");
  }, [passwordForm]);

  const handleSignIn = useCallback(
    async (data: PasswordStepInput) => {
      setFormError(null);
      setIsSubmitting(true);
      try {
        const result = await signIn("credentials", {
          identifier,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          if (result.code === "too_many_attempts") {
            setFormError(
              "Too many attempts. Please wait a minute and try again.",
            );
          } else {
            setFormError("Invalid email/phone number or password.");
          }
          return;
        }

        router.push(callbackUrl);
        router.refresh();
      } catch {
        setFormError("Something went wrong with connection. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [identifier, callbackUrl, router],
  );

  return (
    <div className="w-full min-w-sm flex flex-col items-center gap-8 justify-center py-15">
      <Logo />

      <div className="self-stretch p-6 bg-base-white rounded-md outline-1 outline-gray-200 flex flex-col justify-start items-start gap-8">
        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          <div className="self-stretch text-neutral-900 text-2xl font-medium leading-9">
            Sign in
          </div>
          <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />
        </div>

        {step === "identifier" ? (
          <form
            onSubmit={identifierForm.handleSubmit(handleContinue)}
            noValidate
            className="self-stretch flex flex-col justify-start items-start gap-8"
          >
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <label
                htmlFor="identifier"
                className="text-neutral-900 text-lg font-medium leading-7"
              >
                Email or mobile phone number
              </label>
              <div className="relative self-stretch flex flex-col justify-start items-start gap-2">
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Email or Mobile phone Number"
                  autoFocus
                  aria-invalid={!!identifierForm.formState.errors.identifier}
                  aria-describedby={
                    identifierForm.formState.errors.identifier
                      ? "identifier-error"
                      : undefined
                  }
                  className="px-5 py-3.5 outline-gray-400"
                  {...identifierForm.register("identifier")}
                />
                {identifierForm.formState.errors.identifier && (
                  <p
                    id="identifier-error"
                    role="alert"
                    className="self-stretch text-danger-500 text-sm font-normal leading-6"
                  >
                    {identifierForm.formState.errors.identifier.message}
                  </p>
                )}
              </div>
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <Button type="submit" className="px-5 py-3.5">
                Continue
              </Button>

              <div className="self-stretch">
                <span className="text-neutral-600 text-base font-normal">
                  Don&rsquo;t have an account?{" "}
                </span>
                <Link
                  href="/register"
                  className="text-neutral-900 text-base font-medium hover:underline"
                >
                  Register
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <form
            onSubmit={passwordForm.handleSubmit(handleSignIn)}
            noValidate
            className="self-stretch flex flex-col justify-start items-start gap-8"
          >
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex items-center justify-between">
                <span className="text-neutral-900 text-lg font-medium leading-7 truncate">
                  {identifier}
                </span>
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-primary-500 text-sm font-semibold hover:underline shrink-0 ml-2"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="self-stretch flex flex-col justify-center items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <label
                  htmlFor="password"
                  className="text-neutral-900 text-lg font-medium leading-7"
                >
                  Password
                </label>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <PasswordInput
                    id="password"
                    autoFocus
                    aria-invalid={!!passwordForm.formState.errors.password}
                    aria-describedby={
                      passwordForm.formState.errors.password
                        ? "password-error"
                        : undefined
                    }
                    className="px-5 py-3.5 outline-gray-400"
                    {...passwordForm.register("password")}
                  />
                  {passwordForm.formState.errors.password && (
                    <p
                      id="password-error"
                      role="alert"
                      className="self-stretch text-danger-500 text-sm font-normal leading-6"
                    >
                      {passwordForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="self-stretch flex justify-between items-center gap-4">
                <label className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
                  <span className="relative inline-flex shrink-0">
                    <input
                      type="checkbox"
                      checked={savePassword}
                      onChange={(e) => setSavePassword(e.target.checked)}
                      className="peer size-6 appearance-none rounded-md border-2 border-gray-300 bg-white checked:bg-primary-500 checked:border-primary-500 cursor-pointer transition-colors"
                    />
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="absolute inset-0 m-auto size-4 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                    >
                      <path
                        d="M3 8.5L6.5 12L13 4"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="flex-1 text-neutral-600 text-base font-normal">
                    Save password
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="flex-1 text-right text-neutral-900 text-base font-medium hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {formError && (
              <p
                role="alert"
                className="self-stretch text-danger-500 text-sm font-medium text-center"
              >
                {formError}
              </p>
            )}

            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-3.5"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

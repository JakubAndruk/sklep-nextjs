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
import { FormCard } from "@/components/forms/FormCard";
import { FormField } from "@/components/forms/FormField";
import { CheckboxField } from "@/components/forms/CheckboxField";

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
    <div className="w-full min-w-75 flex flex-col items-center gap-8 justify-center py-15">
      <Logo />

      <FormCard title="Sign in" className="self-stretch p-6">
        {step === "identifier" ? (
          <form
            onSubmit={identifierForm.handleSubmit(handleContinue)}
            noValidate
            className="self-stretch flex flex-col justify-start items-start gap-8"
          >
            <FormField
              id="identifier"
              label="Email or mobile phone number"
              error={identifierForm.formState.errors.identifier?.message}
            >
              <Input
                id="identifier"
                type="text"
                placeholder="Email or Mobile phone Number"
                autoFocus
                aria-invalid={!!identifierForm.formState.errors.identifier}
                className="px-5 py-3.5 outline-gray-400"
                {...identifierForm.register("identifier")}
              />
            </FormField>

            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <Button type="submit">Continue</Button>

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
              <FormField
                id="password"
                label="Password"
                error={passwordForm.formState.errors.password?.message}
              >
                <PasswordInput
                  id="password"
                  autoFocus
                  aria-invalid={!!passwordForm.formState.errors.password}
                  className="px-5 py-3.5 outline-gray-400"
                  {...passwordForm.register("password")}
                />
              </FormField>

              <div className="self-stretch flex justify-between items-center gap-4">
                <CheckboxField
                  label="Save password"
                  checked={savePassword}
                  onChange={(e) => setSavePassword(e.target.checked)}
                  className="flex-1"
                  wrapperClassName="flex-1"
                />

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

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        )}
      </FormCard>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/ui/Logo";
import { Input, PasswordInput } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { COUNTRIES } from "@/lib/constants/countries";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth";
import RegisterSuccess from "../ui/RegisterSuccess";

const PASSWORD_RULE_TEXT =
  "Create a password which has at least 8 characters and includes at least 1 upper case letter, 1 lower case letter and 1 number.";

const errorInputClass = "outline-danger-300";
const defaultInputClass = "outline-gray-400";

export default function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
      password: "",
      repeatPassword: "",
      country: COUNTRIES[0]?.code ?? "",
      agreed: false,
    },
  });

  const countryOptions = COUNTRIES.map((c) => ({
    value: c.code,
    label: c.name,
  }));

  const onSubmit = async (data: RegisterInput) => {
    setFormError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        if (result?.error && typeof result.error === "object") {
          const fieldMap: Record<string, keyof RegisterInput> = {
            email: "email",
            phoneNumber: "phoneNumber",
            password: "password",
            repeatPassword: "repeatPassword",
            country: "country",
          };
          for (const [key, field] of Object.entries(fieldMap)) {
            const message = result.error[key]?.[0];
            if (message) setError(field, { message });
          }
        } else {
          setFormError(
            typeof result?.error === "string"
              ? result.error
              : "Something went wrong. Please try again.",
          );
        }
        return;
      }

      setIsRegistered(true);
    } catch {
      setFormError("Something went wrong with connection. Please try again.");
    }
  };

  if (isRegistered) {
    return (
      <div className="w-full min-w-sm flex flex-col items-center gap-8 justify-center py-15">
        <RegisterSuccess />
      </div>
    );
  }

  return (
    <div className="w-md min-w-sm flex flex-col items-center gap-8 justify-center py-15">
      <Logo />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-96 p-6 bg-base-white rounded-md outline-1 outline-gray-200 flex flex-col justify-start items-start gap-8"
      >
        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          <div className="self-stretch text-neutral-900 text-2xl font-medium leading-9">
            Create Account
          </div>
          <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-8">
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <label
                htmlFor="email"
                className="text-neutral-900 text-lg font-medium leading-7"
              >
                Email
              </label>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`px-5 py-3.5 ${errors.email ? errorInputClass : defaultInputClass}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="self-stretch text-danger-500 text-sm font-normal leading-6"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <label
                htmlFor="phoneNumber"
                className="text-neutral-900 text-lg font-medium leading-7"
              >
                Phone Number
              </label>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+(Code country) your phone number"
                  aria-invalid={!!errors.phoneNumber}
                  aria-describedby={
                    errors.phoneNumber ? "phoneNumber-error" : undefined
                  }
                  className={`px-5 py-3.5 ${errors.phoneNumber ? errorInputClass : defaultInputClass}`}
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p
                    id="phoneNumber-error"
                    role="alert"
                    className="self-stretch text-danger-500 text-sm font-normal leading-6"
                  >
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

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
                  placeholder="Password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : "password-hint"
                  }
                  className={`px-5 py-3.5 ${errors.password ? errorInputClass : defaultInputClass}`}
                  {...register("password")}
                />
                <p
                  id={errors.password ? "password-error" : "password-hint"}
                  role={errors.password ? "alert" : undefined}
                  className={`self-stretch text-sm font-normal leading-6 ${errors.password ? "text-danger-500" : "text-neutral-600"}`}
                >
                  {errors.password?.message ?? PASSWORD_RULE_TEXT}
                </p>
              </div>
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <label
                htmlFor="repeatPassword"
                className="text-neutral-900 text-lg font-medium leading-7"
              >
                Repeat Password
              </label>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <PasswordInput
                  id="repeatPassword"
                  placeholder="Repeat Password"
                  aria-invalid={!!errors.repeatPassword}
                  aria-describedby={
                    errors.repeatPassword ? "repeatPassword-error" : undefined
                  }
                  className={`px-5 py-3.5 ${errors.repeatPassword ? errorInputClass : defaultInputClass}`}
                  {...register("repeatPassword")}
                />
                {errors.repeatPassword && (
                  <p
                    id="repeatPassword-error"
                    role="alert"
                    className="self-stretch text-danger-500 text-sm font-normal leading-6"
                  >
                    {errors.repeatPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <label
                htmlFor="country"
                className="text-neutral-900 text-lg font-medium leading-7"
              >
                Country or region
              </label>
              <Select
                id="country"
                value={watch("country")}
                onChange={(value) =>
                  register("country").onChange({
                    target: { value, name: "country" },
                  })
                }
                options={countryOptions}
                placeholder="Select country"
                className="outline-gray-400"
              />
              {errors.country && (
                <p
                  id="country-error"
                  role="alert"
                  className="self-stretch text-danger-500 text-sm font-normal leading-6"
                >
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <label className="self-stretch flex justify-start items-start gap-4 cursor-pointer">
                <span className="relative inline-flex shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    aria-invalid={!!errors.agreed}
                    aria-describedby={
                      errors.agreed ? "agreed-error" : undefined
                    }
                    className="peer size-6 appearance-none rounded-md border-2 border-gray-300 bg-white checked:bg-primary-500 checked:border-primary-500 cursor-pointer transition-colors"
                    {...register("agreed")}
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
                <span className="flex-1 text-sm leading-6">
                  <span className="text-neutral-600 font-normal">
                    By creating an account and check, you agree to the{" "}
                  </span>
                  <Link
                    href="/conditions-of-use"
                    className="text-primary-500 font-medium hover:underline"
                  >
                    Conditions of Use
                  </Link>
                  <span className="text-neutral-600 font-normal"> and </span>
                  <Link
                    href="/privacy-notice"
                    className="text-primary-500 font-medium hover:underline"
                  >
                    Privacy Notice
                  </Link>
                  <span className="text-neutral-600 font-normal">.</span>
                </span>
              </label>
              {errors.agreed && (
                <p
                  id="agreed-error"
                  role="alert"
                  className="self-stretch text-danger-500 text-sm font-normal leading-6"
                >
                  {errors.agreed.message}
                </p>
              )}
            </div>

            {formError && (
              <p
                role="alert"
                className="self-stretch text-danger-500 text-sm font-medium text-center"
              >
                {formError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3.5"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

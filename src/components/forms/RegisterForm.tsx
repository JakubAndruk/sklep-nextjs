"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/ui/Logo";
import { Input, PasswordInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { COUNTRIES } from "@/lib/constants/countries";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth";
import { getInputOutlineClass } from "@/components/ui/inputStyles";
import { FormCard } from "@/components/forms/FormCard";
import { FormField } from "@/components/forms/FormField";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { CountrySelect } from "@/components/forms/CountrySelect";
import RegisterSuccess from "../ui/RegisterSuccess";

const PASSWORD_RULE_TEXT =
  "Create a password which has at least 8 characters and includes at least 1 upper case letter, 1 lower case letter and 1 number.";

export default function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
      password: "",
      repeatPassword: "",
      country: COUNTRIES[95]?.code ?? "",
      agreed: true,
    },
  });

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
      <div className="w-full min-w-75 flex flex-col items-center gap-8 justify-center py-15">
        <RegisterSuccess />
      </div>
    );
  }

  return (
    <div className="max-w-md min-w-75 flex flex-col items-center gap-8 justify-center py-15">
      <Logo />

      <FormCard title="Create Account" className="max-w-96 p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="self-stretch flex flex-col justify-start items-start gap-8"
        >
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <FormField id="email" label="Email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                placeholder="Your Email"
                aria-invalid={!!errors.email}
                className={`px-5 py-3.5 ${getInputOutlineClass(!!errors.email)}`}
                {...register("email")}
              />
            </FormField>

            <FormField
              id="phoneNumber"
              label="Phone Number"
              error={errors.phoneNumber?.message}
            >
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+(Code country) your phone number"
                aria-invalid={!!errors.phoneNumber}
                className={`px-5 py-3.5 ${getInputOutlineClass(!!errors.phoneNumber)}`}
                {...register("phoneNumber")}
              />
            </FormField>

            <FormField
              id="password"
              label="Password"
              error={errors.password?.message}
              hint={PASSWORD_RULE_TEXT}
            >
              <PasswordInput
                id="password"
                placeholder="Password"
                aria-invalid={!!errors.password}
                className={`px-5 py-3.5 ${getInputOutlineClass(!!errors.password)}`}
                {...register("password")}
              />
            </FormField>

            <FormField
              id="repeatPassword"
              label="Repeat Password"
              error={errors.repeatPassword?.message}
            >
              <PasswordInput
                id="repeatPassword"
                placeholder="Repeat Password"
                aria-invalid={!!errors.repeatPassword}
                className={`px-5 py-3.5 ${getInputOutlineClass(!!errors.repeatPassword)}`}
                {...register("repeatPassword")}
              />
            </FormField>

            <CountrySelect
              control={control}
              name="country"
              label="Country or region"
              error={errors.country?.message}
            />
          </div>

          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <CheckboxField
              error={errors.agreed?.message}
              {...register("agreed")}
              label={
                <span className="text-sm leading-6">
                  <span className="text-neutral-600 font-normal">
                    By creating an account and check, you agree to the{" "}
                  </span>
                  <Link
                    href=""
                    className="text-primary-500 font-medium hover:underline"
                  >
                    Conditions of Use
                  </Link>
                  <span className="text-neutral-600 font-normal"> and </span>
                  <Link
                    href=""
                    className="text-primary-500 font-medium hover:underline"
                  >
                    Privacy Notice
                  </Link>
                  <span className="text-neutral-600 font-normal">.</span>
                </span>
              }
            />

            {formError && (
              <p
                role="alert"
                className="self-stretch text-danger-500 text-sm font-medium text-center"
              >
                {formError}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}

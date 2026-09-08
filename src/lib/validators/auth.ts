import { z } from "zod";
import { COUNTRIES } from "../constants/countries";

const countryCodes = COUNTRIES.map((c) => c.code) as [string, ...string[]];
export const registerSchema = z
  .object({
    phoneNumber: z
      .string()
      .trim()
      .regex(/^\+[1-9]\d{1,14}$/, "Please enter your phone number"),

    email: z
      .email({ message: "Please enter a valid email." })
      .trim()
      .toLowerCase(),

    password: z
      .string({ message: "Password is required" })
      .trim()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      }),
    repeatPassword: z.string({ message: "Repeat password is required" }).trim(),
    country: z.enum(countryCodes as [string, ...string[]], {
      message: "Select a country",
    }),
    agreed: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept the Conditions of Use and Privacy Notice.",
      }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  })
  .refine(
    (data) => {
      const country = COUNTRIES.find((c) => c.code === data.country);
      if (!country) return false;

      return data.phoneNumber.startsWith(country.dialCode);
    },
    {
      message:
        "Phone number must start with the dial code for the selected country",
      path: ["phoneNumber"],
    },
  );

export function validateRegisterInput(body: unknown) {
  const result = registerSchema.safeParse(body);

  if (!result.success)
    return {
      success: false as const,
      error: result.error.flatten().fieldErrors,
      status: 400,
    };

  return {
    success: true as const,
    data: result.data,
  };
}

export type RegisterInput = z.infer<typeof registerSchema>;

export const identifierSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: "Please enter your email or phone number." }),
});

export const passwordStepSchema = z.object({
  password: z.string().min(1, { message: "Please enter your password." }),
});

export type IdentifierInput = z.infer<typeof identifierSchema>;
export type PasswordStepInput = z.infer<typeof passwordStepSchema>;

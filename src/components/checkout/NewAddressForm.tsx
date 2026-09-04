"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { COUNTRIES } from "@/lib/constants/countries";

const newAddressFormSchema = z.object({
  country: z.string().trim().min(1, { message: "Country is required" }),
  province: z.string().trim().min(1, { message: "Province is required" }),
  city: z.string().trim().min(1, { message: "City is required" }),
  postalCode: z.string().trim().min(1, { message: "Postal code is required" }),
  street: z.string().trim().min(1, { message: "Street is required" }),
  setAsDefault: z.boolean().default(false),
});

export type NewAddressFormValues = z.infer<typeof newAddressFormSchema>;

const countryOptions = COUNTRIES.map((c) => ({ value: c.code, label: c.name }));

type NewAddressFormProps = {
  onSubmit: (values: NewAddressFormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function NewAddressForm({
  onSubmit,
  isSubmitting,
}: NewAddressFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NewAddressFormValues>({
    resolver: zodResolver(newAddressFormSchema),
    defaultValues: {
      country: "",
      province: "",
      city: "",
      postalCode: "",
      street: "",
      setAsDefault: true,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="self-stretch flex flex-col justify-start items-start gap-8"
    >
      <div className="self-stretch flex justify-between items-start flex-wrap content-start gap-4">
        <div className="w-full sm:w-96 flex flex-col justify-start items-start gap-2">
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                id="country"
                name="country"
                value={field.value}
                onChange={field.onChange}
                options={countryOptions}
                placeholder="Country"
                className={
                  errors.country ? "outline-danger-300" : "outline-gray-400"
                }
              />
            )}
          />
          {errors.country && (
            <p
              role="alert"
              className="text-danger-500 text-sm font-normal leading-6"
            >
              {errors.country.message}
            </p>
          )}
        </div>

        <div className="w-full sm:w-96 flex flex-col justify-start items-start gap-2">
          <Input
            id="province"
            type="text"
            placeholder="Province"
            aria-invalid={!!errors.province}
            className={`px-4 py-3.5 ${
              errors.province ? "outline-danger-300" : "outline-gray-400"
            }`}
            {...register("province")}
          />
          {errors.province && (
            <p
              role="alert"
              className="text-danger-500 text-sm font-normal leading-6"
            >
              {errors.province.message}
            </p>
          )}
        </div>

        <div className="w-full sm:w-96 flex flex-col justify-start items-start gap-2">
          <Input
            id="city"
            type="text"
            placeholder="City"
            aria-invalid={!!errors.city}
            className={`px-4 py-3.5 ${
              errors.city ? "outline-danger-300" : "outline-gray-400"
            }`}
            {...register("city")}
          />
          {errors.city && (
            <p
              role="alert"
              className="text-danger-500 text-sm font-normal leading-6"
            >
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="w-full sm:w-96 flex flex-col justify-start items-start gap-2">
          <Input
            id="postalCode"
            type="text"
            placeholder="Postal Code"
            aria-invalid={!!errors.postalCode}
            className={`px-4 py-3.5 ${
              errors.postalCode ? "outline-danger-300" : "outline-gray-400"
            }`}
            {...register("postalCode")}
          />
          {errors.postalCode && (
            <p
              role="alert"
              className="text-danger-500 text-sm font-normal leading-6"
            >
              {errors.postalCode.message}
            </p>
          )}
        </div>
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <textarea
          id="street"
          placeholder="Input Complete Address"
          rows={4}
          aria-invalid={!!errors.street}
          className={`self-stretch px-5 py-3.5 bg-base-white rounded-md outline-1 outline-offset-[-1px] resize-none text-neutral-900 text-base font-normal placeholder:text-neutral-500 focus:outline-2 focus:outline-primary-500 transition-colors ${
            errors.street ? "outline-danger-300" : "outline-gray-400"
          }`}
          {...register("street")}
        />
        {errors.street && (
          <p
            role="alert"
            className="self-stretch text-danger-500 text-sm font-normal leading-6"
          >
            {errors.street.message}
          </p>
        )}
      </div>

      <label className="flex justify-start items-center gap-4 cursor-pointer">
        <span className="relative inline-flex shrink-0">
          <input
            type="checkbox"
            {...register("setAsDefault")}
            className="peer size-6 appearance-none rounded-md border-2 border-gray-300 bg-white checked:bg-primary-500 checked:border-primary-500 cursor-pointer transition-colors"
          />
          <svg
            viewBox="0 0 16 16"
            fill="none"
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
        <span className="text-neutral-900 text-base font-medium leading-6">
          Make it the main address
        </span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-stretch px-5 py-3.5 bg-primary-500 rounded-md flex justify-center items-center gap-3.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-base-white text-base font-medium leading-6">
          {isSubmitting ? "Saving..." : "Save Address"}
        </span>
      </button>
    </form>
  );
}

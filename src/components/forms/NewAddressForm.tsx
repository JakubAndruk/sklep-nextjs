"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getInputOutlineClass } from "@/components/ui/inputStyles";
import { FormField } from "@/components/forms/FormField";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { CountrySelect } from "@/components/forms/CountrySelect";
import { COUNTRIES } from "@/lib/constants/countries";

const newAddressFormSchema = z.object({
  country: z.string().trim().min(1, { message: "Country is required" }),
  province: z.string().trim().min(1, { message: "Province is required" }),
  city: z.string().trim().min(1, { message: "City is required" }),
  postalCode: z.string().trim().min(1, { message: "Postal code is required" }),
  street: z.string().trim().min(1, { message: "Street is required" }),
  setAsDefault: z.boolean(),
});

export type NewAddressFormValues = z.infer<typeof newAddressFormSchema>;

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
      country: COUNTRIES[95]?.code ?? "",
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
        <div className="w-full sm:w-96">
          <CountrySelect
            control={control}
            name="country"
            error={errors.country?.message}
          />
        </div>

        <div className="w-full sm:w-96">
          <FormField id="province" error={errors.province?.message}>
            <Input
              id="province"
              type="text"
              placeholder="Province"
              aria-invalid={!!errors.province}
              className={`px-4 py-3.5 ${getInputOutlineClass(!!errors.province)}`}
              {...register("province")}
            />
          </FormField>
        </div>

        <div className="w-full sm:w-96">
          <FormField id="city" error={errors.city?.message}>
            <Input
              id="city"
              type="text"
              placeholder="City"
              aria-invalid={!!errors.city}
              className={`px-4 py-3.5 ${getInputOutlineClass(!!errors.city)}`}
              {...register("city")}
            />
          </FormField>
        </div>

        <div className="w-full sm:w-96">
          <FormField id="postalCode" error={errors.postalCode?.message}>
            <Input
              id="postalCode"
              type="text"
              placeholder="Postal Code"
              aria-invalid={!!errors.postalCode}
              className={`px-4 py-3.5 ${getInputOutlineClass(!!errors.postalCode)}`}
              {...register("postalCode")}
            />
          </FormField>
        </div>
      </div>

      <FormField id="street" error={errors.street?.message}>
        <textarea
          id="street"
          placeholder="Input Complete Address"
          rows={4}
          aria-invalid={!!errors.street}
          className={`self-stretch px-5 py-3.5 bg-base-white rounded-md outline-1 -outline-offset-1 resize-none text-neutral-900 text-base font-normal placeholder:text-neutral-500 focus:outline-2 focus:outline-primary-500 transition-colors ${getInputOutlineClass(!!errors.street)}`}
          {...register("street")}
        />
      </FormField>

      <CheckboxField
        label="Make it the main address"
        {...register("setAsDefault")}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Address"}
      </Button>
    </form>
  );
}

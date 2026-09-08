"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Select } from "@/components/ui/Select";
import { COUNTRIES } from "@/lib/constants/countries";
import { getInputOutlineClass } from "@/components/ui/inputStyles";

const countryOptions = COUNTRIES.map((c) => ({
  value: c.code,
  label: c.name,
}));

type CountrySelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
};

export function CountrySelect<T extends FieldValues>({
  control,
  name,
  label,
  error,
}: CountrySelectProps<T>) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      {label && (
        <label
          htmlFor={name}
          className="text-neutral-900 text-lg font-medium leading-7"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            id={name}
            name={name}
            value={field.value}
            onChange={field.onChange}
            options={countryOptions}
            placeholder="Select country"
            className={getInputOutlineClass(!!error)}
          />
        )}
      />
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="self-stretch text-danger-500 text-sm font-normal leading-6"
        >
          {error}
        </p>
      )}
    </div>
  );
}

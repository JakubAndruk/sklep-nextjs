import { apiFetch } from "./http-client";

export type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type NewAddressPayload = {
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  setAsDefault?: boolean;
};

export function createAddress(payload: NewAddressPayload): Promise<Address> {
  return apiFetch<Address>("/api/addresses", {
    method: "POST",
    body: payload,
    fallbackMessage: "Failed to save address. Please try again.",
  });
}

import { apiFetch } from "./http-client";

export type CreateOrderPayload =
  | { type: "existing"; addressId: string }
  | {
      type: "new";
      newAddress: {
        name: string;
        street: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
        setAsDefault?: boolean;
      };
    };

export function createOrderClient(
  payload: CreateOrderPayload,
): Promise<{ orderId: string }> {
  return apiFetch<{ orderId: string }>("/api/orders", {
    method: "POST",
    body: payload,
    fallbackMessage: "Failed to place order. Please try again.",
  });
}

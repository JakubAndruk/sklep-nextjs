import { ApplePayIcon } from "@/components/icons/payment/ApplePayIcon";
import { GooglePayIcon } from "@/components/icons/payment/GooglePayIcon";
import { MastercardIcon } from "@/components/icons/payment/MastercardIcon";
import { PayPalIcon } from "@/components/icons/payment/PayPalIcon";
import { VisaIcon } from "@/components/icons/payment/VisaIcon";

export const paymentMethods = [
  { name: "Visa", Icon: VisaIcon },
  { name: "Mastercard", Icon: MastercardIcon },
  { name: "PayPal", Icon: PayPalIcon },
  { name: "Apple Pay", Icon: ApplePayIcon },
  { name: "Google Pay", Icon: GooglePayIcon },
];

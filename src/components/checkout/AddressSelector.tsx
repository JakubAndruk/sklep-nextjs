"use client";

import { useState } from "react";
import { Address, createAddress } from "@/lib/api/addresses-client";
import { useNotification } from "@/context/NotificationContext";
import { NewAddressForm, NewAddressFormValues } from "../forms/NewAddressForm";

type AddressSelectorProps = {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
  onAddressCreated: (address: Address) => void;
};

type Tab = "existing" | "new";

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressCreated,
}: AddressSelectorProps) {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<Tab>(
    addresses.length > 0 ? "existing" : "new",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAddress = async (values: NewAddressFormValues) => {
    setIsSubmitting(true);
    try {
      const created = await createAddress({
        name: values.street,
        street: values.street,
        city: values.city,
        province: values.province,
        postalCode: values.postalCode,
        country: values.country,
        setAsDefault: values.setAsDefault,
      });
      onAddressCreated(created);
      onSelectAddress(created.id);
      setActiveTab("existing");
      showNotification("success", "Address saved successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save address.";
      showNotification("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <div className="text-neutral-900 text-2xl font-medium leading-9">
        Address
      </div>

      <div className="self-stretch p-2 xs:p-6 bg-base-white rounded-md outline-1 -outline-offset-1 outline-gray-200 flex flex-col justify-start items-start gap-8">
        <div className="self-stretch flex flex-wrap justify-start items-start">
          <button
            type="button"
            onClick={() => setActiveTab("existing")}
            className="flex-1 flex flex-col justify-center items-center gap-3"
          >
            <span
              className={`text-lg leading-7 ${
                activeTab === "existing"
                  ? "text-primary-500 font-semibold"
                  : "text-neutral-500 font-medium"
              }`}
            >
              Existing Address
            </span>
            <div
              className={`self-stretch h-0 -outline-offset-1 ${
                activeTab === "existing"
                  ? "outline-2 outline-primary-500"
                  : "outline-1 outline-gray-200"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("new")}
            className="flex-1 flex flex-col justify-center items-center gap-3"
          >
            <span
              className={`text-lg leading-7 ${
                activeTab === "new"
                  ? "text-primary-500 font-semibold"
                  : "text-neutral-500 font-medium"
              }`}
            >
              New Address
            </span>
            <div
              className={`self-stretch h-0 -outline-offset-1 ${
                activeTab === "new"
                  ? "outline-2 outline-primary-500"
                  : "outline-1 outline-gray-200"
              }`}
            />
          </button>
        </div>

        {activeTab === "existing" ? (
          addresses.length === 0 ? (
            <p className="self-stretch text-neutral-600 text-base font-normal">
              You don&rsquo;t have any saved addresses yet. Add one in the
              &ldquo;New Address&rdquo; tab.
            </p>
          ) : (
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => onSelectAddress(address.id)}
                  className={`self-stretch p-4 rounded-md outline-1 -outline-offset-1 flex flex-col justify-start items-start gap-4 text-left transition-colors ${
                    selectedAddressId === address.id
                      ? "outline-primary-500 bg-primary-50"
                      : "outline-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="self-stretch flex flex-col justify-start items-start gap-3">
                    <div className="flex  justify-start items-center gap-4">
                      <span className="text-neutral-600 text-base font-medium leading-6">
                        Address
                      </span>
                      {address.isDefault && (
                        <span className="px-2.5 py-1.5 bg-orange-50 rounded-md text-primary-800 text-sm font-medium leading-6">
                          Main Address
                        </span>
                      )}
                    </div>
                    <div className="text-neutral-900 text-lg font-medium leading-7">
                      {address.street}
                    </div>
                  </div>

                  <div className="self-stretch flex flex-wrap justify-between items-start gap-2">
                    <div className="flex flex-col justify-start items-start gap-2">
                      <span className="text-neutral-600 text-base font-medium leading-6">
                        Country
                      </span>
                      <span className="text-neutral-900 text-lg font-medium leading-7">
                        {address.country}
                      </span>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-2">
                      <span className="text-neutral-600 text-base font-medium leading-6">
                        Province
                      </span>
                      <span className="text-neutral-900 text-lg font-medium leading-7">
                        {address.province}
                      </span>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-2">
                      <span className="text-neutral-600 text-base font-medium leading-6">
                        City
                      </span>
                      <span className="text-neutral-900 text-lg font-medium leading-7">
                        {address.city}
                      </span>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-2">
                      <span className="text-neutral-600 text-base font-medium leading-6">
                        Postal Code
                      </span>
                      <span className="text-neutral-900 text-lg font-medium leading-7">
                        {address.postalCode}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          <NewAddressForm
            onSubmit={handleCreateAddress}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

export interface UserPublic {
  id: string;
  phoneNumber: string;
  email: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressPublic {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
  isDefault: boolean;
}

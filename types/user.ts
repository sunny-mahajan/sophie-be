export interface IUserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  refreshToken: string;
  isActive: boolean;
  status: string;
  last_login: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export type IUserCreateAttributes = Omit<
  IUserAttributes,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "lastLogin" | "refreshToken"
>;

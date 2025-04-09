export interface IUserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  refreshToken?: string;
  isActive?: boolean;
  status?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type IUserCreateAttributes = Omit<
  IUserAttributes,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "lastLogin" | "refreshToken"
>;

import { ROLES, PERMISSIONS } from "@config/appConstants";

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type AuthUser = {
  id: number;
  role: string;
  roles?: string[];
  permissions?: string[];
};

export interface InvitedUserType {
  email: string;
  role: string;
}

import { ROLES, PERMISSIONS } from "@config/appConstants";

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

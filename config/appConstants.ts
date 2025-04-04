export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const PERMISSIONS = {
  VIEW_SOPS: "VIEW_SOPS",
  VIEW_TRAININGS: "VIEW_TRAININGS",
  VIEW_REPORTS: "VIEW_REPORTS",
  MANAGE_USER: {
    DELETE_USER: "DELETE_USER",
    EDIT_USER: "EDIT_USER",
    CREATE_USER: "CREATE_USER",
  },
} as const;

export const SUPER_ADMIN_EMAIL = "superadmin@sophie.com";

export const COMMON_MODEL_OPTIONS = {
  paranoid: true,
  timestamps: true,
};

export enum ENTITY_TYPE {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export const DEFAULT_PAGE_SIZE: number = 10;

export const MONTH_NAMES: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export enum GROUP_PERIOD {
  DAY = "DAY",
  MONTH = "MONTH",
}

export const USER_STATUS = {
  INVITATION_PENDING: "INVITATION_PENDING",
  INVITATION_SENT: "INVITATION_SENT",
  CHAIN_INVITATION_SENT: "CHAIN_INVITATION_SENT",
  CHAIN_ACTIVE: "CHAIN_ACTIVE",
  ACTIVE: "ACTIVE",
  DEACTIVE: "DEACTIVE",
};

export const SIGNUP_INVITATION_STATUS = {
  CANCELED: "canceled",
  PENDING: "pending",
  COMPLETED: "completed",
};

export const CACHE_TTL_TIME = 3600; // 1 hour in seconds (60 * 60 = 3600)

export const useApiCaching = process.env.USE_API_CACHING === "true";

export const CHARTDEFAULTCOLOR = "#FF9900";

export const CHARTCOLORS = [
  "#FFB3BA",
  "#FFDFBA",
  "#FFFFBA",
  "#77DD77",
  "#AEC6CF",
  "#D0BAFF",
  "#FFBAE5",
  "#FF9A8B",
  "#C9E4CA",
  "#836953",
];

export const DATE_STRING_LOCALE = "sv-SE";

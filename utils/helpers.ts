import fs from "fs";
import {
  CHARTCOLORS,
  CHARTDEFAULTCOLOR,
  DATE_STRING_LOCALE,
} from "../config/appConstants";

const bcrypt = require("bcrypt");

export const createRateLimitConfig = (
  windowMinutes: number,
  maxRequests: number
) => {
  return {
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    message: `Too many requests from this IP, please try again after ${windowMinutes} minutes`,
  };
};

// Function to validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

export const getHashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return passwordHash;
};

/**
 * Selects a random city and state pair from a predefined list.
 *
 * @returns An object containing a random city and its corresponding state.
 */
export const getRandomCityState = () => {
  const cities = [
    { city: "Caldwell", state: "ID" },
    { city: "Austin", state: "TX" },
    { city: "Orlando", state: "FL" },
    { city: "San Francisco", state: "CA" },
    { city: "Phoenix", state: "AZ" },
  ];
  return cities[Math.floor(Math.random() * cities.length)];
};

/**
 * Returns a Date object representing the expiration time, by default set to 1 day from now.
 * @param {number} [seconds=86400] - The number of seconds until expiration.
 * @returns {Date} - The expiration date.
 */
export const getExpiresAtTime = (seconds: number = 86400): Date => {
  const expiresAt = new Date();
  const expiresInSeconds = seconds;
  expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);
  return expiresAt;
};

export const generateRandomString = (length: number = 10): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const getDateMinusDays = (daysToMinus: number) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - daysToMinus);
  return currentDate.toLocaleDateString(DATE_STRING_LOCALE);
};

/**
 * Function to calculate the Year Over Year (YOY) growth percentage.
 * @param {number} currentYearValue - value for the current year (e.g., 2024).
 * @param {number} previousYearValue - value for the previous year (e.g., 2023).
 * @returns {number} - The YOY growth percentage.
 */
export const calculateYOYGrowth = (
  currentYearValue: number,
  previousYearValue: number
): number | undefined => {
  // Check if the previous year's sales is 0 to avoid division by zero
  if (currentYearValue === 0) {
    return undefined; // Return null or handle as needed
  }

  if (previousYearValue === 0) {
    return 100; // Return 100%
  }

  // Calculate the YOY growth percentage
  const growth =
    ((currentYearValue - previousYearValue) / previousYearValue) * 100;
  return growth;
};

// Function to get the same date but for the previous year
export const getPreviousYearDate = (date: Date) => {
  const previousYearDate = new Date(date); // Create a new Date object to avoid mutating the original
  previousYearDate.setFullYear(previousYearDate.getFullYear() - 1); // Subtract one year
  return previousYearDate;
};

export const dumpModelData = (modelData: any) => {
  console.log(JSON.stringify(modelData?.toJSON(), null, 2));
};

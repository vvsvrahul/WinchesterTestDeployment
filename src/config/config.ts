import { Config } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Configuration object containing environment variables and headers.
 *
 * @typedef {object} Config
 * @property {string} NODE_ENV - The Node environment (e.g., 'development', 'production').
 * @property {string} APP_ENV - The application environment.
 * @property {string} API_BASE_URL - Base URL for the API.
 * @property {string} BLOB_API_BASE_URL - Base URL for blob storage API.
 * @property {object} baseHeaders - Default headers for API requests.
 * @property {string} baseHeaders.Content-Type - The Content-Type header.
 * @property {string} baseHeaders.Accept - The Accept header.
 */
export const config: Config = {
  NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV || "development",
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "development",
  LOGIN_URL: process.env.NEXT_PUBLIC_LOGIN_URL || "",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  AZURE_APP_ID: process.env.NEXT_PUBLIC_AZURE_APP_ID || "",
  AUTHORITY: process.env.NEXT_PUBLIC_B2C_AUTORITY || "",
  SCOPE: process.env.NEXT_PUBLIC_SCOPE || "",
  baseHeaders: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

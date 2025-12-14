export type Config = {
  NODE_ENV: string;
  APP_ENV: string;
  API_BASE_URL: string;
  AZURE_APP_ID: string;
  LOGIN_URL: string;
  baseHeaders: {
    "Content-Type": string;
    Accept: string;
  };
  AUTHORITY: string;
  SCOPE: string;
};

export type AdvanceSearchResult<T> = {
  items: T[];
  count: number;
};

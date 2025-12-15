import axios from "axios";
import { config, HTTP_METHODS } from "@/config";
import { msalInstance, loginRequest } from "@/config/msalConfig";

/**
 * Creates an Axios instance with default base URL and headers.
 */
const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    ...config.baseHeaders,
  },
});

let cachedToken: { token: string; expiry: number } | null = null;

axiosInstance.interceptors.request.use(
  async (config) => {
    const accounts = msalInstance.getAllAccounts();
    
    if (accounts.length > 0) {
      try {
        const now = Date.now();
        if (cachedToken && cachedToken.expiry > now + 60000) {
          config.headers.Authorization = `Bearer ${cachedToken.token}`;
          return config;
        }

        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        
        cachedToken = {
          token: response.accessToken,
          expiry: response.expiresOn?.getTime() || (now + 3600000),
        };
        
        config.headers.Authorization = `Bearer ${response.accessToken}`;
      } catch (error) {
        console.error("Failed to acquire token:", error);
        cachedToken = null;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - API returned 401");
    }
    return Promise.reject(error);
  }
);

/**
 * Object containing HTTP method functions for making API requests.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeRequest: Record<string, (...args: any[]) => Promise<any>> = {
  /**
   * Makes a GET request.
   *
   * @param {string} route - The API route.
   * @param {object} config - Optional configuration object.
   * @returns {Promise} Axios response promise.
   */
  [HTTP_METHODS.GET]: (
    route: string,
    config: {
      signal: AbortSignal | undefined;
      params: object;
      responseType?: "blob" | "json" | "text" | "arraybuffer";
    }
  ) =>
    axiosInstance.get(route, {
      signal: config?.signal,
      params: config?.params,
      responseType: config?.responseType,
    }),

  /**
   * Makes a POST request.
   *
   * @param {string} route - The API route.
   * @param {object} data - The request payload.
   * @param {object} config - Optional configuration object.
   * @returns {Promise} Axios response promise.
   */
  [HTTP_METHODS.POST]: (
    route: string,
    data: object | Array<object> | string | null | undefined,
    config: {
      signal: AbortSignal | undefined;
      params: object;
    }
  ) =>
    axiosInstance.post(route, data, {
      signal: config?.signal,
      params: config?.params,
    }),

  /**
   * Makes a PUT request.
   *
   * @param {string} route - The API route.
   * @param {object} data - The request payload.
   * @param {object} config - Optional configuration object.
   * @returns {Promise} Axios response promise.
   */
  [HTTP_METHODS.PUT]: (
    route: string,
    data: object | Array<object> | string | null | undefined,
    config: {
      signal: AbortSignal | undefined;
      params: object;
    }
  ) =>
    axiosInstance.put(route, data, {
      signal: config?.signal,
      params: config?.params,
    }),

  /**
   * Makes a PATCH request.
   *
   * @param {string} route - The API route.
   * @param {object} data - The request payload.
   * @param {object} config - Optional configuration object.
   * @returns {Promise} Axios response promise.
   */
  [HTTP_METHODS.PATCH]: (
    route: string,
    data: object | Array<object> | string | null | undefined,
    config: {
      signal: AbortSignal | undefined;
      params: object;
    }
  ) =>
    axiosInstance.patch(route, data, {
      signal: config?.signal,
      params: config?.params,
    }),

  /**
   * Makes a DELETE request.
   *
   * @param {string} route - The API route.
   * @param {object} config - Optional configuration object.
   * @returns {Promise} Axios response promise.
   */
  [HTTP_METHODS.DELETE]: (
    route: string,
    config: {
      signal: AbortSignal | undefined;
      params: object;
    }
  ) =>
    axiosInstance.delete(route, {
      signal: config?.signal,
      params: config?.params,
    }),
};

/**
 * Function to make an API request using the specified HTTP method and configuration.
 *
 * @param {string} path - The API endpoint path.
 * @param {string} [method] - The HTTP method to use for the request.
 * @param {object} [configuration] - Optional configuration object containing request options.
 * @param {string} [baseURL] - Optional base URL to override the default.
 * @returns {Promise<{data: object}>} A promise that resolves with the response data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const apiClient = async (
  path: string,
  method: string = HTTP_METHODS.GET,
  configuration: {
    body?: object | Array<object> | Array<string> | string | null;
    params?: object;
    responseType?: "blob" | "json" | "text" | "arraybuffer";
  } = {},
  baseURL: string = "API_BASE_URL"
) => {
  try {
    const { body, params, responseType, ...options } = configuration as {
      body: object | Array<object> | string | null | undefined;
      params: object;
      responseType?: "blob" | "json" | "text" | "arraybuffer";
    };

    const allowsBody = [
      HTTP_METHODS.POST,
      HTTP_METHODS.PUT,
      HTTP_METHODS.PATCH,
    ].includes(method);

    const requestData = allowsBody
      ? [path, body, { ...options, params, responseType }]
      : [path, { ...options, params, responseType }];

    const response = await makeRequest[method](...requestData);

    return { data: response.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const message = err.message || "Network error";
    throw { message, error: true, data: err?.response?.data || {} };
  }
};

import { HTTP_METHODS } from "@/config";
import { apiClient } from "..";
import {
  AdvanceSearchResult,
  AdvanceSearchCriteria,
  PrimerDto,
  Department,
  Site,
} from "@/types";

/**
 * Makes a GET request to retrieve a list of primer types.
 *
 * @param {{
 *   Filter?: string,
 *   Sort?: string,
 *   PageIndex?: number,
 *   PageSize?: number,
 *   Descending?: boolean,
 *   Expand?: boolean,
 * }} params - Optional parameters for the request.
 *
 * @returns {Promise<{data: AdvanceSearchResult<PrimerDto>}>} A promise that resolves with the response data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const primerTypeLookup = ({
  Filter = "",
  Sort = "",
  PageIndex = 0,
  PageSize = 10,
  Descending = false,
  Expand = false,
  departmentId,
}: {
  Filter?: string;
  Sort?: string;
  PageIndex?: number;
  PageSize?: number;
  Descending?: boolean;
  Expand?: boolean;
  departmentId?: number;
}): Promise<{ data: AdvanceSearchResult<PrimerDto> }> => {
  return apiClient("Primer", HTTP_METHODS.GET, {
    params: {
      Filter,
      Sort,
      PageIndex,
      PageSize,
      Descending,
      Expand,
      departmentId,
    },
  });
};

/**
 * Makes a GET request to retrieve a list of departments.
 *
 * @param {{
 *   Filter?: string,
 *   Sort?: string,
 *   PageIndex?: number,
 *   PageSize?: number,
 *   Descending?: boolean,
 *   Expand?: boolean,
 * }} params - Optional parameters for the request.
 *
 * @returns {Promise<{data: AdvanceSearchResult<Department>}>} A promise that resolves with the response data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const departmentLookup = ({
  Filter = "",
  Sort = "",
  PageIndex = 0,
  PageSize = 10,
  Descending = false,
  Expand = false,
  SiteId,
}: {
  Filter?: string;
  Sort?: string;
  PageIndex?: number;
  PageSize?: number;
  Descending?: boolean;
  Expand?: boolean;
  SiteId?: number;
}): Promise<{ data: AdvanceSearchResult<Department> }> => {
  return apiClient("Department", HTTP_METHODS.GET, {
    params: {
      Filter,
      Sort,
      PageIndex,
      PageSize,
      Descending,
      Expand,
      SiteId,
    },
  });
};

/**
 * Makes a GET request to retrieve a list of sites.
 *
 * @param {{
 *   Filter?: string,
 *   Sort?: string,
 *   PageIndex?: number,
 *   PageSize?: number,
 *   Descending?: boolean,
 *   Expand?: boolean,
 * }} params - Optional parameters for the request.
 *
 * @returns {Promise<{data: AdvanceSearchResult<Site>}>} A promise that resolves with the response data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const siteLookup = ({
  Filter = "",
  Sort = "",
  PageIndex = 0,
  PageSize = 10,
  Descending = false,
  Expand = false,
}: {
  Filter?: string;
  Sort?: string;
  PageIndex?: number;
  PageSize?: number;
  Descending?: boolean;
  Expand?: boolean;
}): Promise<{ data: AdvanceSearchResult<Site> }> => {
  return apiClient("Site", HTTP_METHODS.GET, {
    params: {
      Filter,
      Sort,
      PageIndex,
      PageSize,
      Descending,
      Expand,
    },
  });
};

/**
 * Performs an advanced search for sites based on specified criteria.
 *
 * @param {AdvanceSearchCriteria} advanceSearchCriteria - The search criteria including filters, pagination, and sorting options.
 *
 * @returns {Promise<{data: AdvanceSearchResult<Site>}>} A promise that resolves with the paginated search results.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const siteAdvancedSearch = (
  advanceSearchCriteria: AdvanceSearchCriteria
): Promise<{ data: AdvanceSearchResult<Site> }> => {
  return apiClient("Site/advancedSearch", HTTP_METHODS.POST, {
    body: advanceSearchCriteria,
  });
};
/**
 * Performs an advanced search for departments based on specified criteria.
 *
 * @param {AdvanceSearchCriteria} advanceSearchCriteria - The search criteria including filters, pagination, and sorting options.
 *
 * @returns {Promise<{data: AdvanceSearchResult<Department>}>} A promise that resolves with the paginated search results.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const departmentAdvancedSearch = (
  advanceSearchCriteria: AdvanceSearchCriteria
): Promise<{ data: AdvanceSearchResult<Department> }> => {
  return apiClient("Department/advancedSearch", HTTP_METHODS.POST, {
    body: advanceSearchCriteria,
  });
};

/**
 * Performs an advanced search for primers based on specified criteria.
 *
 * @param {AdvanceSearchCriteria} advanceSearchCriteria - The search criteria including filters, pagination, and sorting options.
 *
 * @returns {Promise<{data: AdvanceSearchResult<PrimerDto>}>} A promise that resolves with the paginated search results.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const primerAdvancedSearch = (
  advanceSearchCriteria: AdvanceSearchCriteria
): Promise<{ data: AdvanceSearchResult<PrimerDto> }> => {
  return apiClient("Primer/advancedSearch", HTTP_METHODS.POST, {
    body: advanceSearchCriteria,
  });
};

/**
 * Retrieves a site by its unique identifier.
 *
 * @param {number} id - The unique identifier of the site to retrieve.
 *
 * @returns {Promise<{data: Site}>} A promise that resolves with the site data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const getSiteById = (id: number): Promise<{ data: Site }> => {
  return apiClient(`Site/${id}`, HTTP_METHODS.GET);
};

/**
 * Creates a new site with the provided data.
 *
 * @param {Partial<Site>} site - The site data to create. Only the required fields need to be provided.
 *
 * @returns {Promise<{data: Site}>} A promise that resolves with the created site data including the generated ID.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const createSite = (site: Partial<Site>): Promise<{ data: Site }> => {
  return apiClient("Site", HTTP_METHODS.POST, {
    body: site,
  });
};

/**
 * Updates an existing site with the provided data.
 *
 * @param {Partial<Site>} site - The site data to update. Must include the site ID and the fields to be updated.
 *
 * @returns {Promise<{data: Site}>} A promise that resolves with the updated site data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const updateSite = (site: Partial<Site>): Promise<{ data: Site }> => {
  return apiClient("Site", HTTP_METHODS.PUT, {
    body: site,
  });
};

/**
 * Soft deletes a site by setting IsDeleted to true.
 *
 * @param {number} id - The unique identifier of the site to delete.
 *
 * @returns {Promise<{data: Site}>} A promise that resolves with the updated site data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const deleteSite = (id: number): Promise<{ data: Site }> => {
  return apiClient(`Site/${id}`, HTTP_METHODS.DELETE);
};

/**
 * Retrieves a department by its unique identifier.
 *
 * @param {number} id - The unique identifier of the department to retrieve.
 *
 * @returns {Promise<{data: Department}>} A promise that resolves with the department data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const getDepartmentById = (
  id: number
): Promise<{ data: Department }> => {
  return apiClient(`Department/${id}`, HTTP_METHODS.GET);
};

/**
 * Creates a new department with the provided data.
 *
 * @param {Partial<Department>} department - The department data to create. Only the required fields need to be provided.
 *
 * @returns {Promise<{data: Department}>} A promise that resolves with the created department data including the generated ID.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const createDepartment = (
  department: Partial<Department>
): Promise<{ data: Department }> => {
  return apiClient("Department", HTTP_METHODS.POST, {
    body: department,
  });
};

/**
 * Updates an existing department with the provided data.
 *
 * @param {Partial<Department>} department - The department data to update. Must include the department ID and the fields to be updated.
 *
 * @returns {Promise<{data: Department}>} A promise that resolves with the updated department data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const updateDepartment = (
  department: Partial<Department>
): Promise<{ data: Department }> => {
  return apiClient("Department", HTTP_METHODS.PUT, {
    body: department,
  });
};

/**
 * Soft deletes a department by setting IsDeleted to true.
 *
 * @param {number} id - The unique identifier of the department to delete.
 *
 * @returns {Promise<{data: Department}>} A promise that resolves with the updated department data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const deleteDepartment = (id: number): Promise<{ data: Department }> => {
  return apiClient(`Department/${id}`, HTTP_METHODS.DELETE);
};

/**
 * Retrieves a primer by its unique identifier.
 *
 * @param {number} id - The unique identifier of the primer to retrieve.
 *
 * @returns {Promise<{data: PrimerDto}>} A promise that resolves with the primer data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const getPrimerById = (id: number): Promise<{ data: PrimerDto }> => {
  return apiClient(`Primer/${id}`, HTTP_METHODS.GET);
};

/**
 * Creates a new primer with the provided data.
 *
 * @param {Partial<PrimerDto>} primer - The primer data to create. Only the required fields need to be provided.
 *
 * @returns {Promise<{data: PrimerDto}>} A promise that resolves with the created primer data including the generated ID.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const createPrimer = (
  primer: Partial<PrimerDto>
): Promise<{ data: PrimerDto }> => {
  return apiClient("Primer", HTTP_METHODS.POST, {
    body: primer,
  });
};

/**
 * Updates an existing primer with the provided data.
 *
 * @param {Partial<PrimerDto>} primer - The primer data to update. Must include the primer ID and the fields to be updated.
 *
 * @returns {Promise<{data: PrimerDto}>} A promise that resolves with the updated primer data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const updatePrimer = (
  primer: Partial<PrimerDto>
): Promise<{ data: PrimerDto }> => {
  return apiClient("Primer", HTTP_METHODS.PUT, {
    body: primer,
  });
};

/**
 * Soft deletes a primer by setting IsDeleted to true.
 *
 * @param {number} id - The unique identifier of the primer to delete.
 *
 * @returns {Promise<{data: PrimerDto}>} A promise that resolves with the updated primer data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const deletePrimer = (id: number): Promise<{ data: PrimerDto }> => {
  return apiClient(`Primer/${id}`, HTTP_METHODS.DELETE);
};

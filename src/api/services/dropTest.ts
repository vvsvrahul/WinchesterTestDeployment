import { apiClient } from "..";
import { HTTP_METHODS } from "@/config";
import {
  AdvanceSearchResult,
  DropTestDto,
  AdvanceSearchCriteria,
} from "@/types";

/**
 * Makes a POST request to the drop test advance search endpoint.
 *
 * @param {AdvanceSearchCriteria} advanceSearchCriteria - The search criteria to use for the advance search.
 * @returns {Promise<{data: object}>} A promise that resolves with the response data.
 * @throws {object} An error object containing the error message, error flag, and response data.
 */
export const dropTestAdvanceSearch = (
  advanceSearchCriteria: AdvanceSearchCriteria
): Promise<{ data: AdvanceSearchResult<DropTestDto> }> =>
  apiClient("DropTest/advancedSearch", HTTP_METHODS.POST, {
    body: advanceSearchCriteria,
  });

/**
 * Makes a GET request to retrieve a drop test by its ID.
 *
 * @param {string} id - The ID of the drop test to retrieve.
 * @returns {Promise<{data: DropTestDto}>} A promise that resolves with the drop test data.
 */
export const getDropTestById = (id: string): Promise<{ data: DropTestDto }> =>
  apiClient(`DropTest/${id}`, HTTP_METHODS.GET);

/**
 * Makes a POST request to create a new drop test.
 * @param {DropTestDto} dropTestData - The data for the new drop test.
 * @returns {Promise<{data: DropTestDto}>} A promise that resolves with the created drop test data.
 */
export const createDropTest = (
  dropTestData: DropTestDto
): Promise<{ data: DropTestDto }> =>
  apiClient("DropTest", HTTP_METHODS.POST, { body: dropTestData });

/**
 * Makes a PUT request to update an existing drop test by its ID.
 * @param {DropTestDto} dropTestData - The updated data for the drop test.
 * @returns {Promise<{data: DropTestDto}>} A promise that resolves with the updated drop test data.
 */
export const updateDropTest = (
  dropTestData: DropTestDto
): Promise<{ data: DropTestDto }> =>
  apiClient(`DropTest`, HTTP_METHODS.PUT, { body: dropTestData });

/**
 * Get PDF export of a drop test by its ID.
 * @param id - The ID of the drop test to export.
 * @returns - A promise that resolves with the PDF data as a Blob.
 */
export const exportReportDropTestById = (id: number): Promise<{ data: Blob }> =>
  apiClient(`DropTest/exportReport/${id}`, HTTP_METHODS.GET, {
    responseType: 'blob'
  });

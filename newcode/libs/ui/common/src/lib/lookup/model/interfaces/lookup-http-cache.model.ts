/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Type definition for URL parameters used in lookup requests.
 */
export type LookupUrlParams = { [key: string]: string | number | boolean | null | undefined };

/**
 * Interface for lookup request options.
 */
export interface ILookupRequestOptions {
	/**
	 * URL parameters for the request.
	 */
	params?: LookupUrlParams;

	/**
	 * Body of the request.
	 */
	body?: unknown;
}

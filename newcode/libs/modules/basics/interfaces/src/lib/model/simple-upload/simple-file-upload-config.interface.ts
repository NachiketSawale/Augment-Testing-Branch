/*
 * Copyright(c) RIB Software GmbH
 */

import { CustomRequest } from './custom-request.type';

/**
 * Stores settings for a simple upload operation.
 */
export interface ISimpleFileUploadConfig {

	/**
	 * The base path of the simple upload endpoints.
	 */
	basePath?: string;

	/**
	 * A custom request body to send along with the initial request.
	 */
	customRequest?: CustomRequest | null;

	/**
	 * The chunk size to use.
	 */
	chunkSize?: number;

	/**
	 * The maximum number of concurrent chunk uploads to allow.
	 */
	concurrentUploadCount?: number;
}

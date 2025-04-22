/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * File select control result data.
 */
export interface IFileSelectControlResult {
	/**
	 *  URL with the file content.
	 */
	data?: string;

	/**
	 * {@link File} object for the file
	 */
	file?: File;

	/**
	 * name of the file
	 */
	name: string;

	/**
	 * string content of the file
	 */
	content?: string;
}

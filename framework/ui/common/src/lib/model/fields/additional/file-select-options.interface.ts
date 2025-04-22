/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Stores options for a *file select* control.
 *
 * @group Fields API
 */
export interface IFileSelectOptions {
	/**
	 * An optional filter for MIME types.
	 */
	fileFilter?: string;

	/**
	 * An optional maximum file size such as `2MB`.
	 */
	maxSize?: string;

	/**
	 * A boolean value that indicates whether a `data://` URL with the file content should be stored as property `data` on the result object.
	 * The default value is `false`.
	 */
	retrieveDataUrl?: boolean;

	/**
	 * A boolean value that indicates whether the {@link File} object for the file should be stored as property `file` on the result object.
	 * The default value is `false`.
	 */
	retrieveFile?: boolean;

	/**
	 * A boolean value that indicates whether multiple file selection is allowed.
	 */
	multiSelect?: boolean;

	/**
	 * Additional file select callback
	 * @returns
	 */
	onSelectionChanged?: () => Promise<void> | void;

	/**
	 * A boolean value that indicates whether the text content of the file should be stored as property `content` on the result object.
	 */
	retrieveTextContent?: boolean;
}

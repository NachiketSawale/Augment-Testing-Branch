/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Detailed Exception Information.
 *
 * @group Dialogs
 */
// TODO: replace with some general IException type from platform-common?
export interface IDialogErrorInfo {
	/**
	 * Unique code for error.
	 */
	errorCode: number;

	/**
	 * Version of error.
	 */
	errorVersion: string;

	/**
	 * Short message about error.
	 */
	errorMessage: string;

	/**
	 * Detailed description of error.
	 */
	errorDetail: string;

	/**
	 * Detail stack trace.
	 */
	detailStackTrace: string;

	/**
	 * Error detail method.
	 */
	detailMethod: string | null;

	/**
	 * Detail message;
	 */
	detailMessage?: string;
}

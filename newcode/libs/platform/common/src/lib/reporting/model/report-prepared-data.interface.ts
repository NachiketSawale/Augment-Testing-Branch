/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Report prepared data interface.
 */
export interface IReportPreparedData {
	/**
	 * Name of project.
	 */
	Description: string;

	/**
	 * Unique id (e.g. d38ce6cb3c0c4aa8b1a27c90fa367064).
	 */
	Name: string;

	/**
	 * Client url (e.g. "viewer").
	 */
	ClientUrl: string;

	/**
	 * File extension (e.g. FPX).
	 */
	FileExtension: string;

	/**
	 * Boolean indicating if file is generated.
	 */
	GenerationCompleted: boolean;

	/**
	 * Report sub path.
	 */
	subPath: string | null;

	/**
	 * Unique report id.
	 */
	uuid?: string;
}

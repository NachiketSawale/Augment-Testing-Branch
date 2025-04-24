/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicsBim360DocumentOptionsEntity {
	Status?: string | null;
	Path?: string | null;
	SearchText?: string | null;

	/**
	 * A flag, which indicates whether compress documents to a zip.
	 * Note: this option is used for save.
	 */
	Compress2Zip?: boolean;

	/**
	 * The name for the zip when compress documents to a zip.
	 * Note: this option is used for save.
	 */
	ZipFileName?: string | null;
}

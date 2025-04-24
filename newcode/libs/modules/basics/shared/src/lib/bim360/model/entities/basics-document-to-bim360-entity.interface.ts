/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicsDocumentToBim360Entity {
	Selected: boolean;
	/**
	 * Document Id.
	 */
	Id: number;
	/**
	 * Document FileArchiveDocFk.
	 */
	FileId: number;
	/**
	 * Document Barcode.
	 */
	ExternalId?: string | null;
	/**
	 * Document Code.
	 */
	Code: string | null;
	/**
	 * Document Name.
	 */
	DocumentName: string | null;
	/**
	 * Document Description.
	 */
	Description: string | null;
	/**
	 * ProjectNo.
	 */
	ProjectCode: string | null;
	/**
	 * ProjectName.
	 */
	ProjectName: string | null;

	Status?: string | null;
	StatusDisplay?: string | null;

	DocumentSize?: bigint;
	DocumentSizeDisplay: string | null;

	DocumentType?: string | null;
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';

export interface IJobDocumentEntityGenerated extends IEntityBase, IDocumentBaseEntity {
	/**
	 * Barcode
	 */
	Barcode?: string | null;

	/**
	 * Date
	 */
	Date?: string | null;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * DocumentTypeFk
	 */
	DocumentTypeFk: number;

	/**
	 * FileArchiveDocFk
	 */
	FileArchiveDocFk: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * JobDocumentTypeFk
	 */
	JobDocumentTypeFk: number;

	/**
	 * JobFk
	 */
	JobFk: number;

	/**
	 * OriginFileName
	 */
	OriginFileName?: string | null;
}

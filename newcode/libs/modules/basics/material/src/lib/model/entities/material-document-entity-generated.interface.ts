/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';

export interface IMaterialDocumentEntityGenerated extends IEntityBase, IDocumentBaseEntity {
	/**
	 * CanDownload
	 */
	CanDownload: boolean;

	/**
	 * CanUpload
	 */
	CanUpload: boolean;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * DocumentDate
	 */
	DocumentDate: string;

	/**
	 * DocumentTypeFk
	 */
	DocumentTypeFk: number;

	/**
	 * FileArchiveDocFk
	 */
	FileArchiveDocFk?: number | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * MdcMaterialFk
	 */
	MdcMaterialFk: number;

	/**
	 * OriginFileName
	 */
	OriginFileName?: string | null;
}

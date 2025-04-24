/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IWipHeaderEntity } from './wip-header-entity.interface';

export interface IDocumentEntityGenerated extends IEntityBase {

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
	FileArchiveDocFk: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsExport
	 */
	IsExport: boolean;

	/**
	 * OriginFileName
	 */
	OriginFileName?: string | null;

	/**
	 * SalesDocumentTypeFk
	 */
	SalesDocumentTypeFk: number;

	/**
	 * WipCode
	 */
	WipCode?: string | null;

	/**
	 * WipHeaderEntity
	 */
	WipHeaderEntity?: IWipHeaderEntity | null;

	/**
	 * WipHeaderFk
	 */
	WipHeaderFk: number;
}

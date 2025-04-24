/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListEntity } from './hsq-check-list-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IHsqCheckListDocumentEntityGenerated extends IEntityBase {
	/**
	 * CanDownload
	 */
	CanDownload: boolean;

	/**
	 * CanUpload
	 */
	CanUpload: boolean;

	/**
	 * CheckListFk
	 */
	CheckListFk: number;

	/**
	 * CommentText
	 */
	CommentText?: string | null;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * DocumentDate
	 */
	DocumentDate?: string | null;

	/**
	 * DocumentTypeFk
	 */
	DocumentTypeFk: number;

	/**
	 * FileArchiveDocFk
	 */
	FileArchiveDocFk?: number | null;

	/**
	 * HsqCheckListEntity
	 */
	HsqCheckListEntity?: IHsqCheckListEntity | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * OriginFileName
	 */
	OriginFileName?: string | null;
}

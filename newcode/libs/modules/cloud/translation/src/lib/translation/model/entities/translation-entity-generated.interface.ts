/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 * Translation Entity Generated
 */
export interface ITranslationEntityGenerated extends IEntityBase {
	/*
	 * ApprovedBy
	 */
	ApprovedBy?: string | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsApproved
	 */
	IsApproved?: boolean | null;

	/*
	 * IsTranslated
	 */
	IsTranslated?: boolean | null;

	/*
	 * Ischanged
	 */
	Ischanged?: boolean | null;

	/*
	 * LanguageFk
	 */
	LanguageFk?: number | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * ResourceFk
	 */
	ResourceFk?: number | null;

	/*
	 * Translation
	 */
	Translation?: string | null;
}

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface ITimekeepingEmpVerificationEntityGenerated extends IEntityBase {

	/*
	 * TimeRecorded
	 */
	TimeRecorded?: string | null;

	/*
	 * ReportVerificationTypeFk
	 */
	ReportVerificationTypeFk: number | null;

	/*
	 * ReportFk
	 */
	ReportFk: number | null;

	/*
	 * Longitude
	 */
	Longitude?: number | null;

	/*
	 * Latitude
	 */
	Latitude?: number | null;

	/*
	 * InsertedByOriginal
	 */
	InsertedByOriginal?: number | null;

	/*
	 * InsertedAtOriginal
	 */
	InsertedAtOriginal?: number | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;
}

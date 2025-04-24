/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IPpsPhaseDateSlotEntityGenerated extends IEntityBase {

	/*
	 * ColumnSelection
	 */
	ColumnSelection?: number | null;

	/*
	 * ColumnTitle
	 */
	ColumnTitle?: IDescriptionInfo | null;

	/*
	 * DatetimeFormat
	 */
	DatetimeFormat?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * PpsEntityFk
	 */
	PpsEntityFk?: number | null;

	/*
	 * PpsPhaseTypeFk
	 */
	PpsPhaseTypeFk?: number | null;
}

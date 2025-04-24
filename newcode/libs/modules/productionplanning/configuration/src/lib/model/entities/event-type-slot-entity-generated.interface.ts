/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IEventTypeSlotEntityGenerated extends IEntityBase {
	/*
	 * ColumnSelection
	 */
	ColumnSelection: number;

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
	 * IsReadOnly
	 */
	IsReadOnly?: boolean | null;

	/*
	 * PpsEntityFk
	 */
	PpsEntityFk?: number | null;

	/*
	 * PpsEntityRefFk
	 */
	PpsEntityRefFk?: number | null;

	/*
	 * PpsEventTypeFk
	 */
	PpsEventTypeFk?: number | null;
}

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IScheduleEntity } from '@libs/scheduling/interfaces';

export interface ITimelineEntityGenerated extends IEntityBase {

	/*
	 * Color
	 */
	Color?: number | null;

	/*
	 * Date
	 */
	Date: string;

	/*
	 * EndDate
	 */
	EndDate?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsActive
	 */
	IsActive?: boolean | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * ScheduleEntity
	 */
	ScheduleEntity?: IScheduleEntity | null;

	/*
	 * ScheduleFk
	 */
	ScheduleFk: number;

	/*
	 * Text
	 */
	Text?: string | null;
}

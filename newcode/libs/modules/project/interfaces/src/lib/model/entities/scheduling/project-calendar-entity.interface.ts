/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

/**
 * Material group attribute entity interface
 */
export interface IProjectCalendarEntity extends IEntityBase {
	CalendarFk: boolean;
	CalendarSourceFk: number;
	CalendarTypeFk: number;
	Comment?: IDescriptionInfo | null;
	Id?:number;
	ProjectFk?: number;
}
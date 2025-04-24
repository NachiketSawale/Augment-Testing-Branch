/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ISchedulingWeekdayEntityGenerated extends IEntityBase, IEntityIdentification {
	Id: number;
	WeekdayIndex: number;
	CalendarFk:number;
	Sorting:number;
	IsWeekend:boolean;
	BackgroundColor:number;
	FontColor:number;
	DescriptionInfo?:IDescriptionInfo['Description'];
	AcronymInfo?:string;
}

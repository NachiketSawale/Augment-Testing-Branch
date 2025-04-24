import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ISchedulingCalendarWeekDayEntity extends IEntityBase  {
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

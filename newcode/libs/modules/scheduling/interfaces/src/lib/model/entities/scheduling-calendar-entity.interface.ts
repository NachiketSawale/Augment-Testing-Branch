import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ISchedulingCalendarEntity extends IEntityBase {
	 Id: number;
	 Code: string;
	 CommentText?: string;
	 CalendarTypeFk:number;
	 SchedulingContextFk:number;
	 IsDefault:boolean;
	 WorkHourDefinesWorkDay?:boolean;
	 BasUomHourFk:number;
	 BasUomDayFk:number;
	 WorkHoursPerDay:number;
	 WorkHoursPerWeek:number;
	 WorkHoursPerMonth:number;
	 WorkHoursPerYear:number;
	 UserDefinedText01:string;
	 UserDefinedText02:string;
	 UserDefinedText03:string;
	 UserDefinedText04:string;
	 UserDefinedText05:string;
	 IsLive:boolean;
	 BasUomWorkDayFk:number;
	 BasUomWeekFk:number;
	 BasUomMonthFk:number;
	 BasUomYearFk:number;
	 BasUomMinuteFk:number;
	 DescriptionInfo?:IDescriptionInfo['Description'];
}

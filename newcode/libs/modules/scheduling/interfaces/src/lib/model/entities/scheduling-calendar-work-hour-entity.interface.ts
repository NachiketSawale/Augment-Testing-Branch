import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ISchedulingCalendarWorkHourEntity extends IEntityBase {
	 Id: number;
	 WeekdayFk?: number;
	 WorkStart?:string;
	 WorkEnd?:string;
	 IsWorkingDay:boolean;
	 DescriptionInfo?:IDescriptionInfo;
}
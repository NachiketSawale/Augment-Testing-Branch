import { IEntityBase } from '@libs/platform/common';


export interface ISchedulingCalendarWorkDayEntity extends IEntityBase {
	 Id: number;
	 CommentText?: string;
	 ExceptDate:dateFns
	 WorkStart:dateFns;
	 WorkEnd:dateFns;
}

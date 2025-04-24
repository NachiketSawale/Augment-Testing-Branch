import { IEntityBase } from '@libs/platform/common';

export interface ISchedulingCalendarExceptionDayEntity extends IEntityBase {
	Id: number;
	Code: string;
	CommentText?: string;
	ExceptDate:dateFns;
	CalendarFk:number;
	IsWorkday:boolean;
	BackgroundColor:number;
	FontColor: number;
	WorkStart :dateFns;
	IsShownInChart :boolean;
	WorkEnd :dateFns;

}

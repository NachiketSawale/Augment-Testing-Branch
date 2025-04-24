
import { CompleteIdentification } from '@libs/platform/common';
import { ISchedulingCalendarEntity } from './entities/scheduling-calendar-entity.interface';
import { ISchedulingCalendarExceptionDayEntity } from './entities/scheduling-calendar-exception-day-entity.interface';
import { ISchedulingCalendarWorkDayEntity } from './entities/scheduling-calendar-workday-entity.interface';
import { ISchedulingCalendarWeekDayEntity } from './entities/scheduling-calendar-week-day-entity.interface';
import { ISchedulingCalendarWorkHourEntity } from './entities/scheduling-calendar-work-hour-entity.interface';

export class SchedulingCalendarComplete implements CompleteIdentification<ISchedulingCalendarEntity> {

	//TODO change this class in to an Interface

	public MainItemId: number  = 0;

	public Calendars: ISchedulingCalendarEntity[] | null = [];

	public ExceptionDaysToSave: ISchedulingCalendarExceptionDayEntity[] | null = [];
	public ExceptionDaysToDelete: ISchedulingCalendarExceptionDayEntity[] | null = [];
	public WorkdaysToSave: ISchedulingCalendarWorkDayEntity[] | null = [];
	public WorkdaysToDelete: ISchedulingCalendarWorkDayEntity[] | null = [];

	public WeekdaysToSave: ISchedulingCalendarWeekDayEntity[] | null = [];
	public WeekdaysToDelete: ISchedulingCalendarWeekDayEntity[] | null = [];

	public WorkhourToSave: ISchedulingCalendarWorkHourEntity[] | null = [];
	public WorkhourToDelete: ISchedulingCalendarWorkHourEntity[] | null = [];

}

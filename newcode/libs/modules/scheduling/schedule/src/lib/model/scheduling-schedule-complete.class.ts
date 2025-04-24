import { CompleteIdentification } from '@libs/platform/common';
import { IScheduleEntity } from '@libs/scheduling/interfaces';
import { ITimelineEntity } from './entities/timeline-entity.interface';

export class SchedulingScheduleCompleteClass implements CompleteIdentification<IScheduleEntity>{

	public Id: number = 0;
	public Schedules: IScheduleEntity | null = null;
	public Timelines:ITimelineEntity | null = null;
	public SubSchedules:IScheduleEntity| null = null;
}

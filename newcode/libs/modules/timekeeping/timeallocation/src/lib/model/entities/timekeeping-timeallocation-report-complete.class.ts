import { CompleteIdentification } from '@libs/platform/common';
import { IReportEntity,ITimekeepingBreakEntity } from '@libs/timekeeping/interfaces';

export class TimekeepingTimeallocationReportComplete implements CompleteIdentification<IReportEntity>{

	public Id: number = 0;
	public Reports: IReportEntity | null = null;
	public Breaks : ITimekeepingBreakEntity[] | null = [];


}

import { CompleteIdentification } from '@libs/platform/common';
import { IReportEntity } from '@libs/timekeeping/interfaces';

export class TimekeepingTimeControllingReportComplete implements CompleteIdentification<IReportEntity>{

	public Id: number = 0;

	public Reports: IReportEntity[] | null = [];


}

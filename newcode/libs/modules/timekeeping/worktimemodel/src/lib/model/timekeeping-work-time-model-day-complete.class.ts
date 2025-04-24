import { CompleteIdentification } from '@libs/platform/common';
import { IWorkTimeModelDayEntity } from './entities/work-time-model-day-entity.interface';

export class TimekeepingWorkTimeModelDayComplete implements CompleteIdentification<IWorkTimeModelDayEntity>{

	public Id: number = 0;

	public Datas: IWorkTimeModelDayEntity[] | null = [];


}

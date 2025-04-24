import { CompleteIdentification } from '@libs/platform/common';
import { IWorkTimeModelEntity } from './entities/work-time-model-entity.interface';

export class TimekeepingWorkTimeModelComplete implements CompleteIdentification<IWorkTimeModelEntity>{

	public workTimeId: number = 0;

	public WorkTimeModels: IWorkTimeModelEntity[] | null = [];


}

import { CompleteIdentification } from '@libs/platform/common';
import { IWorkTimeModelDtlEntity } from './entities/work-time-model-dtl-entity.interface';

export class TimekeepingWorkTimeModelDtlComplete implements CompleteIdentification<IWorkTimeModelDtlEntity>{

	public Id: number = 0;

	public Datas: IWorkTimeModelDtlEntity [] | null = [];


}

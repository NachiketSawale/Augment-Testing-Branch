import { CompleteIdentification } from '@libs/platform/common';
import { ITimeSymbol2WorkTimeModelEntity } from './entities/time-symbol-2work-time-model-entity.interface';

export class TimekeepingTimeSymbol2WorkTimeModelComplete implements CompleteIdentification<ITimeSymbol2WorkTimeModelEntity>{

	public Id: number = 0;

	public Datas: ITimeSymbol2WorkTimeModelEntity[] | null = [];


}

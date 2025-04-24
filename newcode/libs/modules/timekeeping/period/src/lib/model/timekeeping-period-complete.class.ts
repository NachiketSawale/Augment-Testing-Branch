import { CompleteIdentification } from '@libs/platform/common';
import { IPeriodEntity } from './entities/period-entity.interface';

export class TimekeepingPeriodComplete implements CompleteIdentification<IPeriodEntity>{

	public Id: number = 0;

	public Periods: IPeriodEntity [] | null = [];
}

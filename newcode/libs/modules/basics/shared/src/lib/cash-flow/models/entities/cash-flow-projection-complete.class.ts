import { CompleteIdentification } from '@libs/platform/common';
import { ICashProjectionDetailEntity } from './cash-projection-detail-entity.interface';
import { ICompanyPeriodEntity } from '@libs/basics/interfaces';

export class CashFlowProjectionComplete<T extends ICashProjectionDetailEntity> extends CompleteIdentification<T> {
	public dtos?: T[] = [];
	public prevPeriod?: ICompanyPeriodEntity | null = null;
}

import { CompleteIdentification } from '@libs/platform/common';
import { IQuoteTotalEntity } from './quote-total-entity.interface';

export class QuoteTotalEntityComplete implements CompleteIdentification<IQuoteTotalEntity> {
	public MainItemId: number = 0;

}
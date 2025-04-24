import { CompleteIdentification } from '@libs/platform/common';
import { IRfqTotalEntity } from './rfq-total-entity.interface';

export class RfqTotalEntityComplete implements CompleteIdentification<IRfqTotalEntity> {
	public MainItemId: number = 0;

}
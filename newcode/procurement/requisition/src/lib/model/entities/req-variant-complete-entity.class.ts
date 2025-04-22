import {CompleteIdentification} from '@libs/platform/common';
import {IReqVariantEntity} from './req-variant-entity.interface';

export class ReqVariantCompleteEntity implements CompleteIdentification<IReqVariantEntity> {
	public MainItemId: number = 0;
	public RequisitionVariant: IReqVariantEntity | null = null;
}
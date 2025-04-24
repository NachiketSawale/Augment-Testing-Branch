import { CompleteIdentification } from '@libs/platform/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';

export class CosLineItemComplete implements CompleteIdentification<IEstLineItemEntity> {
	public LineItems?: IEstLineItemEntity[] | null;
}

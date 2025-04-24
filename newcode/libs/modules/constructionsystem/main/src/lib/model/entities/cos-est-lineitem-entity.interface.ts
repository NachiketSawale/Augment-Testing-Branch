import { IEstLineItemEntity } from '@libs/estimate/interfaces';

export interface ICosEstLineItemEntity extends IEstLineItemEntity {
	/**
	 * CompareLineItem
	 */
	CompareLineItem?: IEstLineItemEntity | null;
}

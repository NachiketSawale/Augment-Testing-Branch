/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingUnitGroupSetParent } from '@libs/controlling/interfaces';
import { IInv2ContractEntityGenerated } from './inv-2-contract-entity-generated.interface';

export interface IInv2ContractEntity extends IInv2ContractEntityGenerated, IControllingUnitGroupSetParent {
	/*
	 * Percentage
	 */
	Percentage: number;
	/*
	 * PriceGross
	 */
	PriceGross: number;
	/*
	 * PrcHeaderId
	 */
	PrcHeaderId: number | null;

	PriceOcGross: number;

	PriceExtra: number;
}

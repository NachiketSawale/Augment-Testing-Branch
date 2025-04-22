/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IInvSalesTaxEntity } from './entities/inv-sales-tax-entity.interface';

export class InvSalesTaxComplete implements CompleteIdentification<IInvSalesTaxEntity> {
	/*
	 * InvSalesTax
	 */
	public InvSalesTax?: IInvSalesTaxEntity | null;

	/*
	 * MainItemId
	 */
	public MainItemId: number = 0;
}

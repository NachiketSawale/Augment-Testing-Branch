/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IWipAccrualEntity } from './entities/wip-accrual-entity.interface';

export class WipAccrualCompleteClass implements CompleteIdentification<IWipAccrualEntity>{
	/*
	 * MainItemId
	 */
	public MainItemId?: number | null;

	public InvoiceAccrualEntity? : IWipAccrualEntity |null;
}
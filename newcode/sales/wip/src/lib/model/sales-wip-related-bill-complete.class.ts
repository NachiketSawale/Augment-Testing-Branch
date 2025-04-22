/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBillHeaderEntity } from './entities/bill-header-entity.interface';

export class SalesWipRelatedBillCompleteClass implements CompleteIdentification<IBillHeaderEntity> {
	public Id: number = 0;
}
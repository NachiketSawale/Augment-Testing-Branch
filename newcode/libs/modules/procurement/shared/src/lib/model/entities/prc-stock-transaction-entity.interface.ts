/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

export interface IPrcStockTransactionEntity extends IEntityIdentification {
	Code: string;
	Description1?: string;
	TransactionDate: string;
	Quantity: number;
	Total: number;
	ProvisionPercent: number;
	ProvisionTotal: number;
}

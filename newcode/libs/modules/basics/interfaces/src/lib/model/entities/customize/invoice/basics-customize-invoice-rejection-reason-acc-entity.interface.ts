/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeInvoiceRejectionReasonAccEntity extends IEntityBase, IEntityIdentification {
	RejectionreasonFk: number;
	LedgerContextFk: number;
	TaxCodeFk: number;
	Account: string;
}

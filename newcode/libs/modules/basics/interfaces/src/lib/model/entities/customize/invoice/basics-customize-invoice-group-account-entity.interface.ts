/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeInvoiceGroupAccountEntity extends IEntityBase, IEntityIdentification {
	GroupFk: number;
	LedgerContextFk: number;
	Account: string;
	OffsetAccount: string;
	NominalDimension01: number;
	NominalDimension02: number;
	NominalDimension03: number;
	OffsetNominalDimension01: number;
	OffsetNominalDimension02: number;
	OffsetNominalDimension03: number;
}

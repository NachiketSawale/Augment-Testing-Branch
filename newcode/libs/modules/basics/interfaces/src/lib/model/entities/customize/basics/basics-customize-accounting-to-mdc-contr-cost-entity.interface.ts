/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeAccountingToMdcContrCostEntity extends IEntityBase, IEntityIdentification {
	ContextFk: number;
	LedgerContextFk: number;
	AccountFk: number;
	ContrCostCodeFk: number;
	Factor: number;
	NominalDimension01: number;
	NominalDimension02: number;
	NominalDimension03: number;
}

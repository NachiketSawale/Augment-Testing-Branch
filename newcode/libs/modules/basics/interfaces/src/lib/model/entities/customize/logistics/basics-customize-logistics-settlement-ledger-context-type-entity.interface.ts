/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLogisticsSettlementLedgerContextTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	SettlementTypeFk: number;
	ContextFk: number;
	LedgerContextFk: number;
	BillingSchemaFk: number;
	TaxCodeFk: number;
}

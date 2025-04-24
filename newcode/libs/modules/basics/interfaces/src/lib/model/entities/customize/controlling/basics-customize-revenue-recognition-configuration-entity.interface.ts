/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRevenueRecognitionConfigurationEntity extends IEntityBase, IEntityIdentification {
	Sorting: number;
	Code: number;
	DescriptionInfo?: IDescriptionInfo;
	LedgerContextFk: number;
	AccrualType: number;
	Account: number;
	StructrueAccountFk: number;
	OffsetAccount: number;
	StructrueOffsetAccountFk: number;
	NominalDimension1: number;
	NominalDimension2: number;
	NominalDimension3: number;
	IsAccrual: boolean;
	IsLive: boolean;
	TransactionTypeFk: number;
}

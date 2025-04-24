/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLogisticsSettlementTypeEntity extends IEntityBase, IEntityIdentification {
	RubricCategoryFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Abbreviation1: string;
	Abbreviation2: string;
	InvoiceTypeFk: number;
	VoucherTypeFk: number;
	Userdefined1: string;
	Userdefined2: string;
	Userdefined3: string;
	Sorting: number;
	IsLive: boolean;
	IsDefault: boolean;
	Icon: number;
	IsInternal: boolean;
	IsExternal: boolean;
	IsInterCompany: boolean;
	TransactionTypeFk: number;
	TransactionTypeCredFk: number;
	VatGroupFk: number;
}

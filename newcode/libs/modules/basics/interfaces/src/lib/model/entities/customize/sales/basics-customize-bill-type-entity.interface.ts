/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBillTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	Isprogress: boolean;
	RubricCategoryFk: number;
	IsCumulativeTransaction: boolean;
	IsProforma: boolean;
	IsCreditMemo: boolean;
	IsPaymentScheduleBalancing: boolean;
	IsPartialFinalInvoice: boolean;
	IsSingle: boolean;
	TypeCode: number;
	IsFinalInvoiceCorrection: boolean;
	IsPaymentSchedule: boolean;
}

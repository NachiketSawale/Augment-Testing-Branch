/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBillTypeEntityGenerated extends IEntityBase {
	Id: number ;
	DescriptionInfo?: string | null;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsProgress: boolean;
	IsCumulativeTransaction: boolean;
	RubricCategoryFk: number;
	IsPartialFinalInvoice: boolean;
	IsProforma: boolean;
	IsCreditmemo: boolean;
	IsPsBalancing: boolean;
	IsSingle: boolean;
	TypeCode: boolean;
	IsFinalInvoiceCorrection: boolean;
	IsPaymentSchedule: boolean;
}
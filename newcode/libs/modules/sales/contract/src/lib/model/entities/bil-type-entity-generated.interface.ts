/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IBillTypeEntityGenerated extends IEntityBase {
	Id: number;
	DescriptionInfo?: IDescriptionInfo | null;
	Abbreviation: string;
	IsCreditMemo: boolean;
	IsCumulativeTransaction: boolean;
	IsDefault: boolean;
	IsFinalInvoiceCorrection: boolean;
	IsLive: boolean;
	IsPartialFinalInvoice: boolean;
	IsPaymentSchedule: boolean;
	IsPaymentScheduleBalancing: boolean;
	IsProforma: boolean;
	IsSingle: boolean;
	Isprogress: boolean;
	RubricCategoryFk: number;
	Sorting: string;
	TypeCode: string;
}
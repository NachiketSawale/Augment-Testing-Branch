/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ISalesConfigurationHeaderEntityGenerated extends IEntityBase {
	ApprovalDealdline: string;
	ApprovalPeriod: string;
	BaselineIntegration: string;
	BilInvoiceTypeFk: string;
	DescriptionInfo: IDescriptionInfo | null;
	Id: number;
	IsDefault: boolean;
	IsFreeItemsAllowed: boolean;
	IsLive: boolean;
	IsMaterial: boolean;
	IsNotAccrualPrr: boolean;
	IsService: boolean;
	PaymentTermFiFk: number;
	PaymentTermPaFk: number;
	PrcAwardMethodFk: number;
	PrcConfigHeaderFk: number;
	PrcConfigHeaderTypeFk: number;
	PrcContractTypeFk: number;
	PrjContractTypeFk: number;
	ProvingDealdline: string;
	ProvingPeriod: string;
	RubricCategoryFk: number;
	RubricFk: number;
	Sorting: string;
}
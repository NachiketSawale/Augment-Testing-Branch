/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 * common billing schema entity interface
 */
export interface ICommonBillingSchemaEntity extends IEntityBase {
	Id: number;
	HeaderFk: number;
	Sorting: number;
	BillingLineTypeFk: number;
	BillingSchemaFk?: number;
	GeneralsTypeFk?: number;
	Value: number;
	Result: number;
	ResultOc: number;
	IsEditable: boolean;
	Group1: boolean;
	Group2: boolean;
	Description: string;
	Description2: string;
	IsPrinted: boolean;
	AccountNo: string;
	OffsetAccountNo: string;
	IsTurnover: boolean;
	TaxCodeFk?: number;
	FinalTotal: boolean;
	HasControllingUnit: boolean;
	ControllingUnitFk?: number;
	UserDefined1: string;
	UserDefined2: string;
	UserDefined3: string;
	IsBold: boolean;
	IsItalic: boolean;
	IsUnderline: boolean;
	DetailAuthorAmountFk?: number;
	BillingSchemaDetailTaxFk?: number;
	CredFactor?: number;
	DebFactor?: number;
	CredLineTypeFk?: number;
	DebLineTypeFk?: number;
	CodeRetention: string;
	PaymentTermFk?: number;
	CostLineTypeFk?: number;
	Formula: string;
	MdcBillingSchemaDetailFk?: number;
	IsHidden: boolean;
	IsResetFI: boolean;
	IsNetAdjusted: boolean;
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvBillingSchemaEntity } from './inv-billing-schema-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvBillingSchemaEntityGenerated extends IEntityBase {
	/*
	 * AccountNo
	 */
	AccountNo?: string | null;

	/*
	 * BillingLineTypeFk
	 */
	BillingLineTypeFk: number;

	/*
	 * BillingSchemaDetailTaxFk
	 */
	BillingSchemaDetailTaxFk?: number | null;

	/*
	 * BillingSchemaFk
	 */
	BillingSchemaFk?: number | null;

	/*
	 * BillingschemaEntities
	 */
	BillingschemaEntities?: IInvBillingSchemaEntity[] | null;

	/*
	 * CodeRetention
	 */
	CodeRetention?: string | null;

	/*
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/*
	 * CostLineTypeFk
	 */
	CostLineTypeFk?: number | null;

	/*
	 * CredFactor
	 */
	CredFactor?: number | null;

	/*
	 * CredLineTypeFk
	 */
	CredLineTypeFk?: number | null;

	/*
	 * DebFactor
	 */
	DebFactor?: number | null;

	/*
	 * DebLineTypeFk
	 */
	DebLineTypeFk?: number | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Description2
	 */
	Description2?: string | null;

	/*
	 * DetailAuthorAmountFk
	 */
	DetailAuthorAmountFk?: number | null;

	/*
	 * FinalTotal
	 */
	FinalTotal: boolean;

	/*
	 * Formula
	 */
	Formula?: string | null;

	/*
	 * GeneralsTypeFk
	 */
	GeneralsTypeFk?: number | null;

	/*
	 * Group1
	 */
	Group1: boolean;

	/*
	 * Group2
	 */
	Group2: boolean;

	/*
	 * HasControllingUnit
	 */
	HasControllingUnit: boolean;

	/*
	 * HeaderEntity
	 */
	HeaderEntity?: IInvHeaderEntity | null;

	/*
	 * HeaderFk
	 */
	HeaderFk: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsBold
	 */
	IsBold: boolean;

	/*
	 * IsEditable
	 */
	IsEditable: boolean;

	/*
	 * IsHidden
	 */
	IsHidden: boolean;

	/*
	 * IsItalic
	 */
	IsItalic: boolean;

	/*
	 * IsModification
	 */
	IsModification: boolean;

	/*
	 * IsNetAdjusted
	 */
	IsNetAdjusted: boolean;

	/*
	 * IsPrinted
	 */
	IsPrinted: boolean;

	/*
	 * IsPrintedZero
	 */
	IsPrintedZero: boolean;

	/*
	 * IsTurnover
	 */
	IsTurnover: boolean;

	/*
	 * IsUnderline
	 */
	IsUnderline: boolean;

	/*
	 * MdcBillingSchemaDetailFk
	 */
	MdcBillingSchemaDetailFk?: number | null;

	/*
	 * OffsetAccountNo
	 */
	OffsetAccountNo?: string | null;

	/*
	 * PaymentTermFk
	 */
	PaymentTermFk?: number | null;

	/*
	 * Result
	 */
	Result: number;

	/*
	 * ResultOc
	 */
	ResultOc: number;

	/*
	 * Sorting
	 */
	Sorting: number;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/*
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/*
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/*
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/*
	 * Value
	 */
	Value: number;
}

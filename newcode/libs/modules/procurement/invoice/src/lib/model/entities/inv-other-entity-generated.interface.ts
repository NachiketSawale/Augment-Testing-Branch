/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IInvOtherEntityGenerated extends IEntityBase {
	/*
	 * Account
	 */
	Account?: string | null;

	/*
	 * AccountDesc
	 */
	AccountDesc?: string | null;

	/*
	 * AmountGross
	 */
	AmountGross: number;

	/*
	 * AmountGrossOc
	 */
	AmountGrossOc: number;

	/*
	 * AmountNet
	 */
	AmountNet: number;

	/*
	 * AmountNetOc
	 */
	AmountNetOc: number;

	/*
	 * AmountTotal
	 */
	AmountTotal: number;

	/*
	 * AmountTotalGross
	 */
	AmountTotalGross: number;

	/*
	 * AmountTotalGrossOc
	 */
	AmountTotalGrossOc: number;

	/*
	 * AmountTotalOc
	 */
	AmountTotalOc: number;

	/*
	 * BasCompanyDeferalTypeFk
	 */
	BasCompanyDeferalTypeFk?: number | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * ControllingUnitFk
	 */
	ControllingUnitFk: number;

	/*
	 * ControllinggrpsetFk
	 */
	ControllinggrpsetFk?: number | null;

	/*
	 * DateDeferalStart
	 */
	DateDeferalStart?: Date | string | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * FixedAssetFk
	 */
	FixedAssetFk?: number | null;

	/**
	 * ICInvHeaderCode
	 */
	ICInvHeaderCode?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * IsAssetManagement
	 */
	IsAssetManagement: boolean;

	/*
	 * JobFk
	 */
	JobFk?: number | null;

	/*
	 * MdcSalesTaxGroupFk
	 */
	MdcSalesTaxGroupFk?: number | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk: number;

	/*
	 * Quantity
	 */
	Quantity: number;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/*
	 * UomFk
	 */
	UomFk: number;

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
}

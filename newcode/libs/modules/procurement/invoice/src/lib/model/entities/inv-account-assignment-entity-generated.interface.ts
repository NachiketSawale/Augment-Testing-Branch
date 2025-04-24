/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IInvAccountAssignmentEntityGenerated extends IEntityBase {
	/*
	 * AccountAssignment01
	 */
	AccountAssignment01?: string | null;

	/*
	 * AccountAssignment02
	 */
	AccountAssignment02?: string | null;

	/*
	 * AccountAssignment03
	 */
	AccountAssignment03?: string | null;

	/*
	 * BasAccAssignAccTypeFk
	 */
	BasAccAssignAccTypeFk?: number | null;

	/*
	 * BasAccAssignFactoryFk
	 */
	BasAccAssignFactoryFk?: number | null;

	/*
	 * BasAccAssignItemTypeFk
	 */
	BasAccAssignItemTypeFk?: number | null;

	/*
	 * BasAccAssignMatGroupFk
	 */
	BasAccAssignMatGroupFk?: number | null;

	/*
	 * BasAccountFk
	 */
	BasAccountFk?: number | null;

	/*
	 * BasCompanyYearFk
	 */
	BasCompanyYearFk?: number | null;

	/*
	 * BasUomFk
	 */
	BasUomFk?: number | null;

	/*
	 * BreakdownAmount
	 */
	BreakdownAmount: number;

	/*
	 * BreakdownAmountOc
	 */
	BreakdownAmountOc: number;

	/*
	 * BreakdownPercent
	 */
	BreakdownPercent: number;

	/*
	 * DateDelivery
	 */
	DateDelivery?: Date | string | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvBreakdownAmount
	 */
	InvBreakdownAmount: number;

	/*
	 * InvBreakdownAmountOc
	 */
	InvBreakdownAmountOc: number;

	/*
	 * InvBreakdownPercent
	 */
	InvBreakdownPercent: number;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * IsDelete
	 */
	IsDelete: boolean;

	/*
	 * IsFinalInvoice
	 */
	IsFinalInvoice: boolean;

	/*
	 * ItemNO
	 */
	ItemNO: number;

	/*
	 * MdcControllingUnitFk
	 */
	MdcControllingUnitFk?: number | null;

	/*
	 * PreviousInvoiceAmount
	 */
	PreviousInvoiceAmount: number;

	/*
	 * PreviousInvoiceAmountOc
	 */
	PreviousInvoiceAmountOc: number;

	/*
	 * Quantity
	 */
	Quantity?: number | null;

	/*
	 * Remark
	 */
	Remark?: string | null;
}

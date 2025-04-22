/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

/**
 * The common warranty entity interface
 */
export interface IPrcCommonAccountAssignmentEntity extends IEntityBase, IEntityIdentification {
	ParentFk: number;
	/**
   * AccountAssignment01
   */
	AccountAssignment01?: string | null;

	/**
	 * AccountAssignment02
	 */
	AccountAssignment02?: string | null;

	/**
	 * AccountAssignment03
	 */
	AccountAssignment03?: string | null;

	/**
	 * BasAccAssignAccTypeFk
	 */
	BasAccAssignAccTypeFk?: number | null;

	/**
	 * BasAccAssignFactoryFk
	 */
	BasAccAssignFactoryFk?: number | null;

	/**
	 * BasAccAssignItemTypeFk
	 */
	BasAccAssignItemTypeFk?: number | null;

	/**
	 * BasAccAssignMatGroupFk
	 */
	BasAccAssignMatGroupFk?: number | null;

	/**
	 * BasAccountFk
	 */
	BasAccountFk?: number | null;

	/**
	 * BasCompanyYearFk
	 */
	BasCompanyYearFk?: number | null;

	/**
	 * BasUomFk
	 */
	BasUomFk?: number | null;

	/**
	 * BreakdownAmount
	 */
	BreakdownAmount: number;

	/**
	 * BreakdownAmountOc
	 */
	BreakdownAmountOc: number;

	/**
	 * BreakdownPercent
	 */
	BreakdownPercent: number;

	/**
	 * ConCrewFk
	 */
	ConCrewFk?: number | null;

	/**
	 * ConHeaderFk
	 */
	ConHeaderFk?: number| null;

	/**
	 * DateDelivery
	 */
	DateDelivery?: Date | string | null;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsDelete
	 */
	IsDelete: boolean;

	/**
	 * IsFinalInvoice
	 */
	IsFinalInvoice: boolean;

	/**
	 * ItemNO
	 */
	ItemNO: number;

	/**
	 * MdcControllingUnitFk
	 */
	MdcControllingUnitFk?: number | null;

	/**
	 * PsdActivityFk
	 */
	PsdActivityFk?: number | null;

	/**
	 * PsdScheduleFk
	 */
	PsdScheduleFk?: number | null;

	/**
	 * Quantity
	 */
	Quantity?: number | null;

	/**Description
	 * Remark
	 */
	Remark?: string | null;

	/**
	 * InvHeaderFk
	 */
	InvHeaderFk?: number | null;
}



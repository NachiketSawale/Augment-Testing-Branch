/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IInvTransactionEntity } from './inv-transaction-entity.interface';
import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvTransactionIcEntityGenerated extends IEntityBase {
	/*
	 * Amount
	 */
	Amount: number;

	/*
	 * BasCompanyCreditorFk
	 */
	BasCompanyCreditorFk: number;

	/*
	 * BasCompanyDebtorFk
	 */
	BasCompanyDebtorFk: number;

	/*
	 * BasUomFk
	 */
	BasUomFk?: number | null;

	/*
	 * BilHeaderFk
	 */
	BilHeaderFk?: number | null;

	/*
	 * BilItemFk
	 */
	BilItemFk?: number | null;

	/*
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/*
	 * ControllingUnitIcFk
	 */
	ControllingUnitIcFk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderEntity
	 */
	InvHeaderEntity?: IInvHeaderEntity | null;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * InvTransactionEntity
	 */
	InvTransactionEntity?: IInvTransactionEntity | null;

	/*
	 * InvTransactionFk
	 */
	InvTransactionFk: number;

	/*
	 * IsSurcharge
	 */
	IsSurcharge?: boolean | null;

	/*
	 * PostingDate
	 */
	PostingDate: Date | string;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * Quantity
	 */
	Quantity: number;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;
}

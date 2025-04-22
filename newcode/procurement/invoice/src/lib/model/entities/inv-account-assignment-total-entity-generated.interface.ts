/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvAccountAssignmentEntity } from './inv-account-assignment-entity.interface';

export interface IInvAccountAssignmentTotalEntityGenerated {
	/*
	 * conCompanyCurrency
	 */
	conCompanyCurrency?: string | null;

	/*
	 * conHeaderCurrency
	 */
	conHeaderCurrency?: string | null;

	/*
	 * conTotalAmount
	 */
	conTotalAmount: number;

	/*
	 * conTotalAmountOc
	 */
	conTotalAmountOc: number;

	/*
	 * conTotalNet
	 */
	conTotalNet: number;

	/*
	 * conTotalNetOc
	 */
	conTotalNetOc: number;

	/*
	 * conTotalPercent
	 */
	conTotalPercent: number;

	/*
	 * dtos
	 */
	dtos?: IInvAccountAssignmentEntity[] | null;

	/*
	 * invCompanyCurrency
	 */
	invCompanyCurrency?: string | null;

	/*
	 * invHeaderCurrency
	 */
	invHeaderCurrency?: string | null;

	/*
	 * invoiceTotalAmount
	 */
	invoiceTotalAmount: number;

	/*
	 * invoiceTotalAmountOc
	 */
	invoiceTotalAmountOc: number;

	/*
	 * invoiceTotalNet
	 */
	invoiceTotalNet: number;

	/*
	 * invoiceTotalNetOc
	 */
	invoiceTotalNetOc: number;

	/*
	 * invoiceTotalPercent
	 */
	invoiceTotalPercent: number;

	/*
	 * previousInvCompanyCurrency
	 */
	previousInvCompanyCurrency?: string | null;

	/*
	 * previousInvHeaderCurrency
	 */
	previousInvHeaderCurrency?: string | null;

	/*
	 * previousInvoiceAmount
	 */
	previousInvoiceAmount: number;

	/*
	 * previousInvoiceAmountOc
	 */
	previousInvoiceAmountOc: number;

	/*
	 * previousInvoiceNet
	 */
	previousInvoiceNet: number;

	/*
	 * previousInvoiceNetOc
	 */
	previousInvoiceNetOc: number;
}

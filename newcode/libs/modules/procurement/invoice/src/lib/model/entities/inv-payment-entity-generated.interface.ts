/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvPaymentEntityGenerated extends IEntityBase {
	/*
	 * Amount
	 */
	Amount: number;

	/*
	 * AmountVat
	 */
	AmountVat?: number | null;

	/*
	 * Amount_Net
	 */
	Amount_Net?: number | null;

	/*
	 * BankAccount
	 */
	BankAccount?: string | null;

	/*
	 * BankEntryNo
	 */
	BankEntryNo?: number | null;

	/*
	 * BankVoucherNo
	 */
	BankVoucherNo?: string | null;

	/*
	 * BpdVatGroupFk
	 */
	BpdVatGroupFk?: number | null;

	/*
	 * CodeRetention
	 */
	CodeRetention?: string | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * DiscountAmount
	 */
	DiscountAmount: number;

	/*
	 * DiscountAmountNet
	 */
	DiscountAmountNet?: number | null;

	/*
	 * DiscountAmountVat
	 */
	DiscountAmountVat?: number | null;

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
	 * IsOverPayment
	 */
	IsOverPayment: boolean;

	/*
	 * IsRetention
	 */
	IsRetention: boolean;

	/*
	 * PaymentDate
	 */
	PaymentDate: Date | string;

	/*
	 * PostingDate
	 */
	PostingDate: Date | string;

	/*
	 * PostingNarritive
	 */
	PostingNarritive?: string | null;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;
}

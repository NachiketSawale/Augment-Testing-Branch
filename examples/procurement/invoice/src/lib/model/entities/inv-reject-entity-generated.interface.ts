/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IInvRejectionReasonEntity } from './inv-rejection-reason-entity.interface';

export interface IInvRejectEntityGenerated extends IEntityBase {
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
	 * AmountTotalOc
	 */
	AmountTotalOc: number;

	/*
	 * AskedForTotal
	 */
	AskedForTotal: number;

	/*
	 * AskedForTotalOc
	 */
	AskedForTotalOc: number;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * ConfirmedTotal
	 */
	ConfirmedTotal: number;

	/*
	 * ConfirmedTotalOc
	 */
	ConfirmedTotalOc?: number | null;

	/*
	 * ControllinggrpsetFk
	 */
	ControllinggrpsetFk?: number | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * InvRejectFk
	 */
	InvRejectFk?: number | null;

	/*
	 * InvRejectionReasonEntity
	 */
	InvRejectionReasonEntity?: IInvRejectionReasonEntity | null;

	/*
	 * InvRejectionReasonFk
	 */
	InvRejectionReasonFk: number;

	/*
	 * Itemreference
	 */
	Itemreference?: string | null;

	/*
	 * MdcSalesTaxGroupFk
	 */
	MdcSalesTaxGroupFk?: number | null;

	/*
	 * NetTotal
	 */
	NetTotal: number;

	/*
	 * NetTotalOc
	 */
	NetTotalOc: number;

	/*
	 * PriceAskedFor
	 */
	PriceAskedFor: number;

	/*
	 * PriceAskedForOc
	 */
	PriceAskedForOc: number;

	/*
	 * PriceConfirmed
	 */
	PriceConfirmed: number;

	/*
	 * PriceConfirmedOc
	 */
	PriceConfirmedOc: number;

	/*
	 * Quantity
	 */
	Quantity: number;

	/*
	 * QuantityAskedFor
	 */
	QuantityAskedFor: number;

	/*
	 * QuantityConfirmed
	 */
	QuantityConfirmed: number;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk: number;

	/*
	 * UomFk
	 */
	UomFk: number;
}

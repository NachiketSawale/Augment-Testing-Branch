/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvTransactionIcEntity } from './inv-transaction-ic-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvTransactionEntityGenerated extends IEntityBase {
	/*
	 * AccountPayable
	 */
	AccountPayable?: string | null;

	/*
	 * Amount
	 */
	Amount: number;

	/*
	 * AmountAuthorized
	 */
	AmountAuthorized: number;

	/*
	 * Assetno
	 */
	Assetno?: string | null;

	/*
	 * BusinessPostingGroup
	 */
	BusinessPostingGroup?: string | null;

	/*
	 * CodeRetention
	 */
	CodeRetention?: string | null;

	/*
	 * CompanyDeferalTypeFk
	 */
	CompanyDeferalTypeFk?: number | null;

	/*
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/*
	 * ContractItemDesc
	 */
	ContractItemDesc?: string | null;

	/*
	 * ControllingUnitAssign01
	 */
	ControllingUnitAssign01?: string | null;

	/*
	 * ControllingUnitAssign02
	 */
	ControllingUnitAssign02?: string | null;

	/*
	 * ControllingUnitAssign03
	 */
	ControllingUnitAssign03?: string | null;

	/*
	 * ControllingUnitAssign04
	 */
	ControllingUnitAssign04?: string | null;

	/*
	 * ControllingUnitAssign05
	 */
	ControllingUnitAssign05?: string | null;

	/*
	 * ControllingUnitAssign06
	 */
	ControllingUnitAssign06?: string | null;

	/*
	 * ControllingUnitAssign07
	 */
	ControllingUnitAssign07?: string | null;

	/*
	 * ControllingUnitAssign08
	 */
	ControllingUnitAssign08?: string | null;

	/*
	 * ControllingUnitAssign09
	 */
	ControllingUnitAssign09?: string | null;

	/*
	 * ControllingUnitAssign10
	 */
	ControllingUnitAssign10?: string | null;

	/*
	 * ControllingUnitCode
	 */
	ControllingUnitCode?: string | null;

	/*
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/*
	 * ControllingUnitIcFk
	 */
	ControllingUnitIcFk?: number | null;

	/*
	 * ControllinggrpsetFk
	 */
	ControllinggrpsetFk?: number | null;

	/*
	 * ControllingunitAssign01Comment
	 */
	ControllingunitAssign01Comment?: string | null;

	/*
	 * ControllingunitAssign01desc
	 */
	ControllingunitAssign01desc?: string | null;

	/*
	 * ControllingunitAssign02Comment
	 */
	ControllingunitAssign02Comment?: string | null;

	/*
	 * ControllingunitAssign02desc
	 */
	ControllingunitAssign02desc?: string | null;

	/*
	 * ControllingunitAssign03Comment
	 */
	ControllingunitAssign03Comment?: string | null;

	/*
	 * ControllingunitAssign03desc
	 */
	ControllingunitAssign03desc?: string | null;

	/*
	 * ControllingunitAssign04Comment
	 */
	ControllingunitAssign04Comment?: string | null;

	/*
	 * ControllingunitAssign04desc
	 */
	ControllingunitAssign04desc?: string | null;

	/*
	 * ControllingunitAssign05Comment
	 */
	ControllingunitAssign05Comment?: string | null;

	/*
	 * ControllingunitAssign05desc
	 */
	ControllingunitAssign05desc?: string | null;

	/*
	 * ControllingunitAssign06Comment
	 */
	ControllingunitAssign06Comment?: string | null;

	/*
	 * ControllingunitAssign06desc
	 */
	ControllingunitAssign06desc?: string | null;

	/*
	 * ControllingunitAssign07Comment
	 */
	ControllingunitAssign07Comment?: string | null;

	/*
	 * ControllingunitAssign07desc
	 */
	ControllingunitAssign07desc?: string | null;

	/*
	 * ControllingunitAssign08Comment
	 */
	ControllingunitAssign08Comment?: string | null;

	/*
	 * ControllingunitAssign08desc
	 */
	ControllingunitAssign08desc?: string | null;

	/*
	 * ControllingunitAssign09Comment
	 */
	ControllingunitAssign09Comment?: string | null;

	/*
	 * ControllingunitAssign09desc
	 */
	ControllingunitAssign09desc?: string | null;

	/*
	 * ControllingunitAssign10Comment
	 */
	ControllingunitAssign10Comment?: string | null;

	/*
	 * ControllingunitAssign10desc
	 */
	ControllingunitAssign10desc?: string | null;

	/*
	 * Creditor
	 */
	Creditor?: string | null;

	/*
	 * CreditorGroup
	 */
	CreditorGroup?: string | null;

	/*
	 * Currency
	 */
	Currency?: string | null;

	/*
	 * DateDeferalStart
	 */
	DateDeferalStart?: Date | string | null;

	/*
	 * DiscountAmount
	 */
	DiscountAmount: number;

	/*
	 * DiscountDuedate
	 */
	DiscountDuedate?: Date | string | null;

	/*
	 * DocumentNo
	 */
	DocumentNo?: string | null;

	/*
	 * DocumentType
	 */
	DocumentType?: string | null;

	/*
	 * ExtOrderNo
	 */
	ExtOrderNo?: string | null;

	/*
	 * ExtPesNo
	 */
	ExtPesNo?: string | null;

	/*
	 * ExternalDate
	 */
	ExternalDate?: Date | string | null;

	/*
	 * ExternalNumber
	 */
	ExternalNumber?: string | null;

	/*
	 * HandoverId
	 */
	HandoverId: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * Inv2ContractFk
	 */
	Inv2ContractFk?: number | null;

	/*
	 * InvHeaderEntity
	 */
	InvHeaderEntity?: IInvHeaderEntity | null;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * InvOtherFk
	 */
	InvOtherFk?: number | null;

	/*
	 * InvTransactionIcEntities
	 */
	InvTransactionIcEntities?: IInvTransactionIcEntity[] | null;

	/*
	 * IsCanceled
	 */
	IsCanceled: boolean;

	/*
	 * IsDebit
	 */
	IsDebit: boolean;

	/*
	 * IsProgress
	 */
	IsProgress: boolean;

	/*
	 * IsSuccess
	 */
	IsSuccess: boolean;

	/*
	 * ItemReference
	 */
	ItemReference?: number | null;

	/*
	 * LineNo
	 */
	LineNo?: number | null;

	/*
	 * LineReference
	 */
	LineReference?: string | null;

	/*
	 * LineType
	 */
	LineType?: string | null;

	/*
	 * MatchText
	 */
	MatchText?: string | null;

	/*
	 * NetDuedate
	 */
	NetDuedate?: Date | string | null;

	/*
	 * NominalAccount
	 */
	NominalAccount?: string | null;

	/*
	 * NominalAccountDesc
	 */
	NominalAccountDesc?: string | null;

	/*
	 * NominalAccountFi
	 */
	NominalAccountFi?: string | null;

	/*
	 * NominalAccountFiDesc
	 */
	NominalAccountFiDesc?: string | null;

	/*
	 * NominalDimension
	 */
	NominalDimension?: string | null;

	/*
	 * NominalDimension2
	 */
	NominalDimension2?: string | null;

	/*
	 * NominalDimension3
	 */
	NominalDimension3?: string | null;

	/*
	 * OrderNumber
	 */
	OrderNumber?: string | null;

	/*
	 * PaymentTermFk
	 */
	PaymentTermFk?: number | null;

	/*
	 * PesHeaderFk
	 */
	PesHeaderFk: number;

	/*
	 * PesItemFk
	 */
	PesItemFk?: number | null;

	/*
	 * PostingDate
	 */
	PostingDate: Date | string;

	/*
	 * PostingNarritive
	 */
	PostingNarritive?: string | null;

	/*
	 * PostingType
	 */
	PostingType?: string | null;

	/*
	 * PrcItemFk
	 */
	PrcItemFk?: number | null;

	/*
	 * Quantity
	 */
	Quantity: number;

	/*
	 * ReturnValue
	 */
	ReturnValue?: string | null;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/*
	 * TaxCodeMatrixCode
	 */
	TaxCodeMatrixCode?: string | null;

	/*
	 * TaxCodeMatrixFk
	 */
	TaxCodeMatrixFk?: number | null;

	/*
	 * TransactionId
	 */
	TransactionId: number;

	/*
	 * Userdefined1
	 */
	Userdefined1?: string | null;

	/*
	 * Userdefined2
	 */
	Userdefined2?: string | null;

	/*
	 * Userdefined3
	 */
	Userdefined3?: string | null;

	/*
	 * VatAmount
	 */
	VatAmount: number;

	/*
	 * VatCode
	 */
	VatCode?: string | null;

	/*
	 * VatGroup
	 */
	VatGroup?: string | null;

	/*
	 * VoucherDate
	 */
	VoucherDate?: Date | string | null;

	/*
	 * VoucherNumber
	 */
	VoucherNumber: string;
}

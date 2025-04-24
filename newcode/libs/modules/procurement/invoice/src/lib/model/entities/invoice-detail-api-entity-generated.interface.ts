/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IInvoiceDetailApiEntityGenerated {
	/*
	 * AmountNetOC
	 */
	AmountNetOC: number;

	/*
	 * AountGrossOC
	 */
	AountGrossOC: number;

	/*
	 * BusinessPartnerName
	 */
	BusinessPartnerName?: string | null;

	/*
	 * ContractCode
	 */
	ContractCode?: string | null;

	/*
	 * Currency
	 */
	Currency?: string | null;

	/*
	 * CustomerCompanyCode
	 */
	CustomerCompanyCode?: string | null;

	/*
	 * CustomerCompanyName
	 */
	CustomerCompanyName?: string | null;

	/*
	 * DiscountAmount
	 */
	DiscountAmount: number;

	/*
	 * DiscountDate
	 */
	DiscountDate?: Date | string | null;

	/*
	 * InvoiceNumber
	 */
	InvoiceNumber?: string | null;

	/*
	 * InvoicedDate
	 */
	InvoicedDate: Date | string;

	/*
	 * Narrative
	 */
	Narrative?: string | null;

	/*
	 * Package
	 */
	Package?: string | null;

	/*
	 * PackageDescription
	 */
	PackageDescription?: string | null;

	/*
	 * PaymentTerm
	 */
	PaymentTerm?: IDescriptionInfo | null;

	/*
	 * PesCode
	 */
	PesCode?: string | null;

	/*
	 * ProjectName
	 */
	ProjectName?: string | null;

	/*
	 * ReceivedDate
	 */
	ReceivedDate: Date | string;

	/*
	 * Status
	 */
	Status?: IDescriptionInfo | null;

	/*
	 * TaxCode
	 */
	TaxCode?: string | null;
}

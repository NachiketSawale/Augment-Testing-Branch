/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IInvoiceApiEntityGenerated {
	/*
	 * AmountGrossOC
	 */
	AmountGrossOC: number;

	/*
	 * CurrencyCode
	 */
	CurrencyCode?: string | null;

	/*
	 * ID
	 */
	ID: number;

	/*
	 * InvoiceCode
	 */
	InvoiceCode?: string | null;

	/*
	 * InvoiceDate
	 */
	InvoiceDate: Date | string;

	/*
	 * InvoiceStatusDescription
	 */
	InvoiceStatusDescription?: IDescriptionInfo | null;

	/*
	 * InvoiceStatusId
	 */
	InvoiceStatusId: number;

	/*
	 * SearchPattern
	 */
	SearchPattern?: string | null;
}

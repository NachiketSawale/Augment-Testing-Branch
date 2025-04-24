/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvHeaderCorrectParameterGenerated {
	/*
	 * NewInvoiceCode
	 */
	NewInvoiceCode?: string | null;

	/*
	 * SelectedInvoice
	 */
	SelectedInvoice?: IInvHeaderEntity | null;

	/*
	 * Type
	 */
	Type?: string | null;
}

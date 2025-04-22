/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvoiceItemApiEntity } from './invoice-item-api-entity.interface';
import { IInvoiceHeaderApiEntity } from './invoice-header-api-entity.interface';

export interface ICreateInvoiceRequestGenerated {
	/*
	 * Header
	 */
	Header?: IInvoiceHeaderApiEntity | null;

	/*
	 * Items
	 */
	Items?: IInvoiceItemApiEntity[] | null;

	/*
	 * LogOptions
	 */
	LogOptions?: 'None' | 'Info' | 'Error' | 'Warning' | 'Debug' | 'DetectionOnly' | 'Default' | null;
}

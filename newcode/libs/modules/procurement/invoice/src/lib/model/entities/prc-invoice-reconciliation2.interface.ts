/*
 * Copyright(c) RIB Software GmbH
 */
import { ITranslated } from '@libs/platform/common';

export interface IInvoiceReconcilition2Entity {
	Id: number;
	Type?: ITranslated;
	Net?: number | null;
	Vat?: number | null;
	Gross?: number | null;
	NetOc?: number | null;
	VatOc?: number | null;
	GrossOc?: number | null;
}
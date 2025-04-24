/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { IQuoteHeaderEntity } from '@libs/procurement/quote';
import { IExtendableObject } from '../extendable-object.interface';

export interface ICompareExportVatPercent {
	Id: number;
	Code: string;
	VatPercent: number;
	DescriptionInfo?: IDescriptionInfo | null;
}

export interface ICompareExportLookupMap extends IExtendableObject {
	Quote: IQuoteHeaderEntity[];
	VatPercent: ICompareExportVatPercent[];
}
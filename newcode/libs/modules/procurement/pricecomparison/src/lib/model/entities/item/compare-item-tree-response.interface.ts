/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompareTreeResponseBase } from '../compare-tree-response-base.interface';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';
import { ICompareRowEntity } from '../compare-row-entity.interface';
import { ICompositeItemEntity } from './composite-item-entity.interface';

export interface ICompareItemTreeResponse extends ICompareTreeResponseBase<ICompositeItemEntity> {
	ItemCustomColumn: ICustomCompareColumnEntity[];
	ItemCustomRow: ICompareRowEntity[];
	ItemCustomQuoteRow: ICompareRowEntity[];
	ItemCustomSchemaRow: ICompareRowEntity[];
	PrcPackage: object[];
	PrcStructure: object[];
	TaxCode: object[];
	ControllingUnit: object[];
	Address: object[];
	PaymentTerm: object[];
	PrcItemStatus: object[];
}
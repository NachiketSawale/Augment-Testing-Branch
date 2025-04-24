/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';


export interface IRfqTotalEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	HeaderFk: number;
	TotalTypeFk: number;
	ValueNet: number;
	ValueNetOc: number;
	ValueTax: number;
	ValueTaxOc: number;
	CommentText?: string;
	Gross: number;
	GrossOc: number;

}
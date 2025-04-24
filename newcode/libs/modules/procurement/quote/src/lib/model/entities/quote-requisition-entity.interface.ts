/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import {
	IRequisitionEntity
} from '@libs/procurement/shared';


export interface IQuoteRequisitionEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	QtnHeaderFk: number;
	ReqHeaderFk: number;
	PrcHeaderFk: number;
	PrcHeaderEntity?: IPrcHeaderEntity | null;
	BpdVatGroupFk: number;
	IsSelected: boolean;
}

export interface IQuoteRequisitionListResponse {
	Main: IQuoteRequisitionEntity[];
	ReqHeaderLookupView: IRequisitionEntity[];
	PrcHeaderLookupView: IPrcHeaderEntity[];
	TotalNoDiscountSplit: number;
	TotalNoDiscountSplitOc: number;
	TotalGrossNoDiscountSplit: number;
	TotalGrossOcNoDiscountSplitOc: number;
}